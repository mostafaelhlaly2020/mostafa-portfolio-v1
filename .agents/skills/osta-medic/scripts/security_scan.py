#!/usr/bin/env python3
"""
security_scan.py — Security Sweep helper (SKILL.md §3)

A regex/heuristic scanner for the subset of SKILL.md's Security Sweep that text patterns can actually
catch: hardcoded secrets, string-built queries/commands, unsafe HTML rendering, weak crypto/randomness
for secrets, insecure deserialization, debug/CORS misconfiguration, mass assignment, weak token
storage, JWTs signed with no expiry, sensitive-data logging, and unsafe file-upload naming/paths.

WHAT THIS CANNOT CATCH: broken access control / IDOR, CSRF, SSRF, and most business-logic flaws are
about *what the code does*, not what it textually contains — no regex tool catches those. Run this
script, then still reason through SKILL.md §3's IDOR/CSRF/SSRF bullets by hand. A clean scan is a
floor, not a ceiling.

Usage:
    python3 security_scan.py path/to/project
    python3 security_scan.py src/payments.py src/auth.py
    python3 security_scan.py . --ext .py,.js,.ts
    python3 security_scan.py . --category hardcoded-secret,sql-injection

Exit code: 0 if nothing found, 1 if at least one finding (so it can gate a "done" claim).

Stdlib only — no dependencies, no network access needed.
"""

import argparse
import os
import re
import sys

SKIP_DIRS = {
    ".git", "node_modules", "venv", ".venv", "__pycache__", "dist", "build",
    ".next", "target", "vendor", ".idea", ".vscode", "coverage", ".pytest_cache",
}

MAX_FILE_BYTES = 2 * 1024 * 1024

# Filenames/path fragments that are expected to contain example/test secrets — lower-severity context,
# not auto-excluded, but worth knowing if a hit comes from one of these.
LOW_SIGNAL_PATH_HINTS = (".example", "test", "spec", "fixture", "mock", "sample")

SECRET_PLACEHOLDER_RE = re.compile(
    r"(?i)(changeme|your[_-]?(api|secret)|placeholder|xxxx|example|<.*>|\$\{|insert[_-]?key)"
)


def contains_any(line, words):
    low = line.lower()
    return any(w in low for w in words)


# Each check takes one line (str) and returns True if it should be flagged.
# Keep these independent and simple — composing them is what keeps false-positive tuning manageable.

def check_hardcoded_secret(line):
    patterns = [
        r"(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*[\"'][^\"']{8,}[\"']",
        r"AKIA[0-9A-Z]{16}",
        r"sk_live_[A-Za-z0-9]{16,}",
        r"ghp_[A-Za-z0-9]{36}",
        r"-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----",
    ]
    if SECRET_PLACEHOLDER_RE.search(line):
        return False
    return any(re.search(p, line) for p in patterns)


def check_sql_injection(line):
    patterns = [
        r"(SELECT|INSERT INTO|UPDATE|DELETE FROM)\b[^\"'`]{0,80}[\"'`].{0,40}\$\{",
        r"f[\"'][^\"']{0,80}(SELECT|INSERT|UPDATE|DELETE)\b[^\"']{0,80}\{",
        r"[\"'][^\"']{0,60}(SELECT|INSERT|UPDATE|DELETE)\b[^\"']{0,60}[\"']\s*\+\s*\w",
        r"execute\(\s*[\"'][^\"']*%s[^\"']*[\"']\s*%\s*",
    ]
    return any(re.search(p, line, re.IGNORECASE) for p in patterns)


def check_command_injection(line):
    patterns = [
        r"\bos\.system\(",
        r"subprocess\.(Popen|call|run)\([^)]*shell\s*=\s*True",
        r"child_process\.exec\(",
        r"Runtime\.getRuntime\(\)\.exec\(",
    ]
    return any(re.search(p, line) for p in patterns)


def check_xss(line):
    patterns = [
        r"dangerouslySetInnerHTML",
        r"\.innerHTML\s*=",
        r"v-html\s*=",
        r"\{\{.*\|\s*safe\s*\}\}",
        r"document\.write\(",
    ]
    return any(re.search(p, line) for p in patterns)


def check_csrf_missing_hint(line):
    # Heuristic only: a state-changing route declared with no csrf-looking middleware on the same line.
    # Deliberately narrow to avoid noise — this is a hint, not a verdict; SKILL.md §3 still needs a human read.
    return bool(re.search(r"app\.(post|put|patch|delete)\(", line)) and "csrf" not in line.lower()


def check_weak_crypto_for_secrets(line):
    has_weak_hash = bool(re.search(r"\b(md5|sha1)\(", line, re.IGNORECASE))
    return has_weak_hash and contains_any(line, ["password", "passwd", "secret"])


def check_insecure_randomness_for_tokens(line):
    has_weak_random = bool(re.search(r"Math\.random\(|\brandom\.random\(|\brand\(\)", line))
    return has_weak_random and contains_any(line, ["token", "reset", "session", "password"])


def check_insecure_deserialization(line):
    patterns = [
        r"pickle\.loads?\(",
        r"yaml\.load\((?!.*Loader)",
        r"\bunserialize\(",
        r"ObjectInputStream",
        r"Marshal\.load\(",
    ]
    return any(re.search(p, line) for p in patterns)


def check_debug_or_cors_misconfig(line):
    patterns = [
        r"DEBUG\s*=\s*True",
        r"debug\s*:\s*true",
        r"app\.run\([^)]*debug\s*=\s*True",
        r"Access-Control-Allow-Origin[\"']?\s*:\s*[\"']\*[\"']",
        r"origin\s*:\s*true",
        r"origin\s*:\s*[\"']\*[\"']",
    ]
    return any(re.search(p, line) for p in patterns)


def check_mass_assignment(line):
    patterns = [
        r"Object\.assign\([^,]+,\s*req\.body\)",
        r"\.update\(\*\*request\.(json|form|POST)\)",
        r"findByIdAndUpdate\([^,]+,\s*req\.body\b(?!\.\w)",
    ]
    return any(re.search(p, line) for p in patterns)


def check_weak_token_storage(line):
    patterns = [
        r"localStorage\.setItem\([^)]*\b(token|password|secret)\b",
        r"sessionStorage\.setItem\([^)]*\b(token|password|secret)\b",
    ]
    return any(re.search(p, line, re.IGNORECASE) for p in patterns)


def check_jwt_no_expiry(line):
    return bool(re.search(r"jwt\.sign\(", line)) and "expiresIn" not in line


def check_sensitive_logging(line):
    has_log_call = bool(re.search(r"\b(console\.log|logger\.\w+|print)\s*\(", line))
    return has_log_call and contains_any(
        line, ["password", "passwd", "token", "secret", "ssn", "card_number", "credit_card", "req.body"]
    )


def check_unsafe_upload_naming(line):
    patterns = [
        r"file\.originalname",
        r"request\.files\[[^\]]+\]\.filename",
    ]
    return any(re.search(p, line) for p in patterns)


def check_path_traversal(line):
    patterns = [
        r"path\.join\([^)]*req\.(params|query|body)",
        r"os\.path\.join\([^)]*request\.(args|form|GET|POST)",
    ]
    return any(re.search(p, line) for p in patterns)


CHECKS = [
    ("hardcoded-secret", "high", check_hardcoded_secret,
     "Move the literal to an environment variable or secret manager; rotate it if it was ever committed."),
    ("sql-injection", "critical", check_sql_injection,
     "Use a parameterized query / prepared statement instead of building the query text."),
    ("command-injection", "critical", check_command_injection,
     "Pass arguments as an array/list to the process API; never build a shell string."),
    ("xss", "high", check_xss,
     "Render as text by default; sanitize explicitly only where rich HTML is genuinely required."),
    ("csrf-hint", "info", check_csrf_missing_hint,
     "Confirm this route has CSRF protection or relies on SameSite cookies + origin check (heuristic, verify by hand)."),
    ("weak-crypto", "high", check_weak_crypto_for_secrets,
     "Hash passwords with a slow, salted algorithm (bcrypt/argon2/scrypt), never md5/sha1."),
    ("insecure-randomness", "high", check_insecure_randomness_for_tokens,
     "Use a cryptographically secure random source (crypto.randomBytes, secrets module) for tokens."),
    ("insecure-deserialization", "critical", check_insecure_deserialization,
     "Use a data-only format (JSON, yaml.safe_load) instead of a format that can build arbitrary objects."),
    ("debug-or-cors-misconfig", "medium", check_debug_or_cors_misconfig,
     "Gate debug mode behind an explicit non-default env var; replace wildcard CORS with an allow-list."),
    ("mass-assignment", "high", check_mass_assignment,
     "Apply an explicit allow-list of fields instead of the raw request body."),
    ("weak-token-storage", "medium", check_weak_token_storage,
     "Keep tokens out of localStorage/sessionStorage; use an httpOnly cookie instead."),
    ("jwt-no-expiry", "medium", check_jwt_no_expiry,
     "Add an explicit expiresIn to every signed token."),
    ("sensitive-logging", "high", check_sensitive_logging,
     "Log an explicit safe subset of fields, never the raw request body or a known-sensitive field."),
    ("unsafe-upload-naming", "high", check_unsafe_upload_naming,
     "Generate the stored filename server-side; never trust the client-supplied filename."),
    ("path-traversal", "high", check_path_traversal,
     "Resolve the file via a server-side record/ID, not by joining a path with client input."),
]


def iter_files(paths, ext_filter):
    for raw in paths:
        if os.path.isfile(raw):
            yield raw
            continue
        for root, dirs, files in os.walk(raw):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for name in files:
                if ext_filter and not any(name.endswith(e) for e in ext_filter):
                    continue
                yield os.path.join(root, name)


def scan_file(path, active_checks):
    hits = []
    try:
        if os.path.getsize(path) > MAX_FILE_BYTES:
            return hits
        with open(path, "r", encoding="utf-8") as f:
            for lineno, line in enumerate(f, start=1):
                for cat_id, severity, fn, fix in active_checks:
                    if fn(line):
                        hits.append((lineno, cat_id, severity, fix, line.strip()))
    except (UnicodeDecodeError, IsADirectoryError, PermissionError, OSError):
        pass
    return hits


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="+", help="Files and/or directories to scan")
    parser.add_argument("--ext", help="Comma-separated extensions to include when scanning directories")
    parser.add_argument("--category", help="Comma-separated category ids to run (default: all). See CHECKS ids in this file.")
    args = parser.parse_args()

    ext_filter = [e.strip() for e in args.ext.split(",")] if args.ext else None
    active_checks = CHECKS
    if args.category:
        wanted = {c.strip() for c in args.category.split(",")}
        active_checks = [c for c in CHECKS if c[0] in wanted]
        unknown = wanted - {c[0] for c in CHECKS}
        if unknown:
            print(f"[warning] unknown category id(s) ignored: {', '.join(sorted(unknown))}")

    total_hits = 0
    files_scanned = 0
    severity_order = {"critical": 0, "high": 1, "medium": 2, "info": 3}
    all_hits = []

    for path in iter_files(args.paths, ext_filter):
        files_scanned += 1
        for lineno, cat_id, severity, fix, content in scan_file(path, active_checks):
            all_hits.append((severity_order.get(severity, 9), path, lineno, cat_id, severity, fix, content))

    all_hits.sort(key=lambda h: h[0])
    for _, path, lineno, cat_id, severity, fix, content in all_hits:
        total_hits += 1
        low_signal = " [path looks like a test/example file]" if any(h in path.lower() for h in LOW_SIGNAL_PATH_HINTS) else ""
        print(f"{path}:{lineno}: [{severity.upper()}/{cat_id}] {content}{low_signal}")
        print(f"    fix: {fix}")

    print(f"\n--- Scanned {files_scanned} file(s), {total_hits} potential finding(s) ---")
    if total_hits:
        print("Reminder: this catches text patterns only. Still reason through IDOR/CSRF/SSRF/access-control by hand.")
    return 1 if total_hits else 0


if __name__ == "__main__":
    sys.exit(main())
