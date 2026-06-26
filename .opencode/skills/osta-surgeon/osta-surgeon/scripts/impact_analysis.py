#!/usr/bin/env python3
"""
impact_analysis.py — Protocol 1 helper (Impact Analysis)

Finds every place a symbol is referenced, or every file that (heuristically) imports a given file,
across a codebase — so "which files are affected" is something you confirmed, not something you
guessed.

Two modes:

  --symbol NAME           Find every line referencing NAME (word-boundary match) under <root>.
  --importers-of PATH     Heuristically find every file that imports/requires the file at PATH
                           (relative to <root>), by pattern-matching common import statements
                           against the file's base name across several languages.

Usage:
    python3 impact_analysis.py /path/to/project --symbol calculateShipping
    python3 impact_analysis.py /path/to/project --importers-of src/utils/shipping.py
    python3 impact_analysis.py /path/to/project --symbol calculateShipping --ext .py,.ts

IMPORTANT: --importers-of is regex-based pattern matching, not a real static analyzer. It will have
false positives (a different file with the same base name) and false negatives (dynamic imports,
re-exports, string-built paths). Treat its output as a strong starting list to verify by reading, not
as ground truth.

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

IMPORT_KEYWORDS = re.compile(
    r"\b(import|require|from|#include|use|using|include)\b", re.IGNORECASE
)


def iter_files(root, ext_filter):
    for r, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if ext_filter and not any(name.endswith(e) for e in ext_filter):
                continue
            yield os.path.join(r, name)


def read_text(path):
    try:
        if os.path.getsize(path) > MAX_FILE_BYTES:
            return None
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except (UnicodeDecodeError, IsADirectoryError, PermissionError, OSError):
        return None


def mode_symbol(root, symbol, ext_filter):
    pattern = re.compile(r"\b" + re.escape(symbol) + r"\b")
    files_with_hits = set()
    total_hits = 0
    for path in iter_files(root, ext_filter):
        text = read_text(path)
        if text is None:
            continue
        for lineno, line in enumerate(text.splitlines(), start=1):
            if pattern.search(line):
                print(f"{path}:{lineno}: {line.strip()}")
                files_with_hits.add(path)
                total_hits += 1
    print(f"\n--- '{symbol}': {total_hits} reference(s) across {len(files_with_hits)} file(s) ---")
    return 0


def mode_importers_of(root, target_rel_path, ext_filter):
    base_name = os.path.splitext(os.path.basename(target_rel_path))[0]
    if not base_name:
        print(f"[error] Could not derive a base name from '{target_rel_path}'.")
        return 1

    name_pattern = re.compile(r"\b" + re.escape(base_name) + r"\b")
    abs_target = os.path.normpath(os.path.join(root, target_rel_path))

    files_with_hits = set()
    total_hits = 0
    for path in iter_files(root, ext_filter):
        if os.path.normpath(path) == abs_target:
            continue  # skip the file referencing itself
        text = read_text(path)
        if text is None:
            continue
        for lineno, line in enumerate(text.splitlines(), start=1):
            if IMPORT_KEYWORDS.search(line) and name_pattern.search(line):
                print(f"{path}:{lineno}: {line.strip()}")
                files_with_hits.add(path)
                total_hits += 1

    print(
        f"\n--- heuristic importers of '{target_rel_path}' (base name '{base_name}'): "
        f"{total_hits} matching line(s) across {len(files_with_hits)} file(s) ---"
    )
    print("--- review by reading, not by trusting blindly (regex-based heuristic) ---")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("root", help="Project root to scan")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--symbol", help="Symbol name to find every reference to")
    group.add_argument("--importers-of", dest="importers_of", help="Relative file path to find heuristic importers of")
    parser.add_argument("--ext", help="Comma-separated extensions to restrict the scan to (e.g. .py,.ts)")
    args = parser.parse_args()

    ext_filter = [e.strip() for e in args.ext.split(",")] if args.ext else None

    if args.symbol:
        return mode_symbol(args.root, args.symbol, ext_filter)
    return mode_importers_of(args.root, args.importers_of, ext_filter)


if __name__ == "__main__":
    sys.exit(main())
