#!/usr/bin/env python3
"""
diff_scope_check.py — Surgical Change Rule 1 helper (Touch Only What Must Be Touched)

Looks at your actual diff and flags lines that look like unrelated "drive-by" changes rather than the
requested fix: whitespace-only line changes, comment-only line changes, and (optionally) files touched
that weren't in your declared impact-analysis list.

By default it runs `git diff` (unstaged changes) in the given project root. Use --staged to check
staged changes instead, or --diff-file to check a pre-made unified diff (e.g. saved from `git diff` or
a patch file) without needing git at all.

Usage:
    python3 diff_scope_check.py /path/to/project
    python3 diff_scope_check.py /path/to/project --staged
    python3 diff_scope_check.py /path/to/project --expected-files src/utils/shipping.py,tests/test_shipping.py
    python3 diff_scope_check.py /path/to/project --diff-file my_change.patch

HEURISTIC TOOL: whitespace/comment detection uses simple text normalization, not a real parser for
every language's comment syntax. Review what it flags yourself — some flagged lines may be
legitimately necessary; this is a second opinion, not a verdict.

Stdlib only — no dependencies beyond `git` itself (only needed if not using --diff-file).
"""

import argparse
import re
import subprocess
import sys

FILE_HEADER = re.compile(r"^diff --git a/(.*) b/(.*)$")
COMMENT_MARKERS = ["//", "#"]


def get_diff_text(root, staged, diff_file):
    if diff_file:
        with open(diff_file, "r", encoding="utf-8") as f:
            return f.read()
    cmd = ["git", "-C", root, "diff"]
    if staged:
        cmd.append("--staged")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    except FileNotFoundError:
        print("[error] git is not available in this environment. Use --diff-file instead.")
        sys.exit(2)
    if result.returncode != 0:
        print(f"[error] git diff failed (is '{root}' a git repository?):\n{result.stderr}")
        sys.exit(2)
    return result.stdout


def parse_diff(diff_text):
    """Return {file_path: [hunk, ...]}, each hunk a list of (tag, line) with tag in {'+','-',' '}."""
    files = {}
    current_file = None
    current_hunk = None
    for raw in diff_text.splitlines():
        m = FILE_HEADER.match(raw)
        if m:
            current_file = m.group(2)
            files[current_file] = []
            current_hunk = None
            continue
        if raw.startswith("@@"):
            current_hunk = []
            if current_file is not None:
                files[current_file].append(current_hunk)
            continue
        if current_hunk is None:
            continue
        if raw.startswith("+++") or raw.startswith("---"):
            continue
        if raw.startswith("+"):
            current_hunk.append(("+", raw[1:]))
        elif raw.startswith("-"):
            current_hunk.append(("-", raw[1:]))
        else:
            current_hunk.append((" ", raw[1:] if raw else ""))
    return files


def find_replace_blocks(hunk):
    """Find consecutive (removed_lines, added_lines) blocks within a hunk's tag sequence."""
    blocks = []
    i, n = 0, len(hunk)
    while i < n:
        if hunk[i][0] == "-":
            removed = []
            j = i
            while j < n and hunk[j][0] == "-":
                removed.append(hunk[j][1])
                j += 1
            added = []
            k = j
            while k < n and hunk[k][0] == "+":
                added.append(hunk[k][1])
                k += 1
            if added:
                blocks.append((removed, added))
            i = k if k > j else j
        else:
            i += 1
    return blocks


def normalize_ws(line):
    return re.sub(r"\s+", " ", line.strip())


def strip_comment(line):
    earliest = None
    for marker in COMMENT_MARKERS:
        idx = line.find(marker)
        if idx != -1 and (earliest is None or idx < earliest):
            earliest = idx
    return line[:earliest] if earliest is not None else line


def analyze_file(path, hunks):
    flags = []
    for hunk in hunks:
        for removed, added in find_replace_blocks(hunk):
            if len(removed) != len(added):
                continue  # block sizes differ — not a clean 1:1 replace, skip pairing analysis
            for old_line, new_line in zip(removed, added):
                if old_line == new_line:
                    continue
                if normalize_ws(old_line) == normalize_ws(new_line):
                    flags.append(("whitespace-only", old_line, new_line))
                    continue
                old_code = normalize_ws(strip_comment(old_line))
                new_code = normalize_ws(strip_comment(new_line))
                if old_code == new_code and old_code != "":
                    flags.append(("comment-only", old_line, new_line))
    return flags


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("root", help="Project root (used to run `git diff`, ignored if --diff-file is given)")
    parser.add_argument("--staged", action="store_true", help="Check staged changes instead of unstaged")
    parser.add_argument("--diff-file", help="Read a unified diff from this file instead of running git")
    parser.add_argument("--expected-files", help="Comma-separated list of file paths Impact Analysis declared as affected")
    args = parser.parse_args()

    diff_text = get_diff_text(args.root, args.staged, args.diff_file)
    if not diff_text.strip():
        print("No diff found (no changes, or wrong root/staged flag).")
        return 0

    files = parse_diff(diff_text)
    total_flags = 0

    for path, hunks in files.items():
        for kind, old_line, new_line in analyze_file(path, hunks):
            total_flags += 1
            print(f"[{kind}] {path}")
            print(f"    - {old_line.strip()}")
            print(f"    + {new_line.strip()}")

    if args.expected_files:
        expected = {p.strip() for p in args.expected_files.split(",")}
        unexpected = [p for p in files if p not in expected]
        for path in unexpected:
            total_flags += 1
            print(f"[outside declared scope] {path} was changed but isn't in --expected-files")

    print(f"\n--- {total_flags} potential drive-by/out-of-scope change(s) flagged across {len(files)} file(s) ---")
    return 1 if total_flags else 0


if __name__ == "__main__":
    sys.exit(main())
