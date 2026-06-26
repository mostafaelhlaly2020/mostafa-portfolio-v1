#!/usr/bin/env python3
"""
scan_placeholders.py — Protocol 1 helper (Production-Ready Code Quality)

Scans one or more files/directories for the textual patterns that almost always mean "this isn't
actually done yet": TODO/FIXME/XXX/HACK/TBD markers, "placeholder"/"stub"/"not implemented" text,
NotImplementedError, "coming soon", lorem ipsum filler text.

This is a textual gate, not a substitute for actually reading the code — a clean scan is necessary,
not sufficient. Run it against the files you touched before declaring any task "done."

Usage:
    python3 scan_placeholders.py src/
    python3 scan_placeholders.py src/checkout.py src/payments/webhook.py
    python3 scan_placeholders.py . --ext .py,.ts,.tsx

Exit code: 0 if nothing found, 1 if at least one match was found (so it can gate a "done" claim).

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

MAX_FILE_BYTES = 2 * 1024 * 1024  # skip anything bigger than 2MB — almost certainly not source text

PATTERNS = [
    (re.compile(r"\bTODO\b"), "TODO marker"),
    (re.compile(r"\bFIXME\b"), "FIXME marker"),
    (re.compile(r"\bXXX\b"), "XXX marker"),
    (re.compile(r"\bHACK\b"), "HACK marker"),
    (re.compile(r"\bTBD\b"), "TBD marker"),
    (re.compile(r"placeholder", re.IGNORECASE), "placeholder text"),
    (re.compile(r"not\s+implemented", re.IGNORECASE), "not-implemented marker"),
    (re.compile(r"NotImplementedError"), "NotImplementedError raised"),
    (re.compile(r"coming\s+soon", re.IGNORECASE), '"coming soon" placeholder'),
    (re.compile(r"\bstub\b", re.IGNORECASE), "stub marker"),
    (re.compile(r"lorem\s+ipsum", re.IGNORECASE), "lorem ipsum placeholder text"),
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


def scan_file(path):
    hits = []
    try:
        if os.path.getsize(path) > MAX_FILE_BYTES:
            return hits
        with open(path, "r", encoding="utf-8") as f:
            for lineno, line in enumerate(f, start=1):
                for pattern, label in PATTERNS:
                    if pattern.search(line):
                        hits.append((lineno, label, line.strip()))
    except (UnicodeDecodeError, IsADirectoryError, PermissionError, OSError):
        pass  # binary or unreadable file — not source text, skip silently
    return hits


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="+", help="Files and/or directories to scan")
    parser.add_argument(
        "--ext",
        help="Comma-separated list of extensions to include when scanning directories (e.g. .py,.ts). "
        "Default: scan every text-readable file found.",
    )
    args = parser.parse_args()

    ext_filter = [e.strip() for e in args.ext.split(",")] if args.ext else None

    total_hits = 0
    files_scanned = 0
    for path in iter_files(args.paths, ext_filter):
        files_scanned += 1
        for lineno, label, content in scan_file(path):
            total_hits += 1
            print(f"{path}:{lineno}: [{label}] {content}")

    print(f"\n--- Scanned {files_scanned} file(s), found {total_hits} potential placeholder(s) ---")
    return 1 if total_hits else 0


if __name__ == "__main__":
    sys.exit(main())
