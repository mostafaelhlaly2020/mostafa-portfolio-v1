#!/usr/bin/env python3
"""
log_deprecation.py — Protocol 4 standalone helper (State Sync, lightweight)

A self-contained way to record (or resolve) an [ORPHANS & PENDING] entry in PROJECT_MAP.md, for use
when `osta-builder` isn't installed. If `osta-builder` IS installed, prefer its
`sync_project_state.py add-orphan` / `resolve-orphan` instead — this script exists so Protocol 4 still
works standalone, not to duplicate that tool where it's already available.

Usage:
    # Record something this edit deprecated but didn't (or couldn't) fully migrate yet
    python3 log_deprecation.py ./PROJECT_MAP.md --item "Old validateEmail() helper" --reason "superseded by shared validator, callers not yet migrated"

    # Mark it resolved once every caller has actually been migrated and verified
    python3 log_deprecation.py ./PROJECT_MAP.md --item "Old validateEmail() helper" --resolve

Stdlib only.
"""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

ORPHANS_MARKER = "[ORPHANS & PENDING]"


def today():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def find_section(lines, marker):
    start = None
    for i, line in enumerate(lines):
        if line.strip().startswith("##") and marker in line:
            start = i
            break
    if start is None:
        return None, None
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if lines[j].strip().startswith("## "):
            end = j
            break
    return start, end


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("path", help="Path to PROJECT_MAP.md")
    parser.add_argument("--item", required=True, help="Short description of the deprecated/pending item")
    parser.add_argument("--reason", help="Why it's deprecated/pending (required unless --resolve)")
    parser.add_argument("--resolve", action="store_true", help="Remove a previously-logged matching entry instead of adding one")
    args = parser.parse_args()

    if not args.resolve and not args.reason:
        parser.error("--reason is required unless --resolve is given")

    p = Path(args.path)
    if not p.exists():
        print(f"[error] {p} does not exist. Create PROJECT_MAP.md first (see osta-architect).")
        return 1

    lines = p.read_text(encoding="utf-8").splitlines(keepends=True)
    start, end = find_section(lines, ORPHANS_MARKER)
    if start is None:
        print(f"[error] Could not find a '{ORPHANS_MARKER}' heading in {p}. Is this a valid PROJECT_MAP.md?")
        return 1

    if args.resolve:
        kept = []
        removed = 0
        for line in lines[start + 1:end]:
            if line.strip().startswith("- [") and args.item in line:
                removed += 1
                continue
            kept.append(line)
        if removed == 0:
            print(f"[not found] No entry containing '{args.item}' under {ORPHANS_MARKER}.")
            return 1
        new_lines = lines[:start + 1] + kept + lines[end:]
        p.write_text("".join(new_lines), encoding="utf-8")
        print(f"[resolved] removed {removed} entry/entries matching: {args.item}")
        return 0

    section = lines[start + 1:end]
    while section and section[-1].strip() == "":
        section.pop()
    section.append(f"- [ ] {args.item} — {args.reason} — {today()}\n")
    section.append("\n")
    new_lines = lines[:start + 1] + section + lines[end:]
    p.write_text("".join(new_lines), encoding="utf-8")
    print(f"[logged] {args.item}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
