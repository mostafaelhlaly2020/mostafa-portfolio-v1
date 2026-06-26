#!/usr/bin/env python3
"""
sync_project_state.py — Protocol 3 helper (Live State Sync)

Keeps the [ORPHANS & PENDING] and [SYSTEM_FLOW] sections of PROJECT_MAP.md accurate as execution
proceeds, instead of you re-parsing and hand-editing the whole file by eye every time.

This script never touches [TECH_STACK] or [ARCHITECTURE] content — those belong to osta-architect.
It also never creates a brand-new PROJECT_MAP.md — use osta-architect's manage_project_map.py for
that. This tool only manages the two sections that change continuously during execution.

Subcommands:

  add-orphan <path> --item "TEXT" --reason "TEXT"
      Append a new pending item to [ORPHANS & PENDING] the instant a gap is found/created.

  resolve-orphan <path> --item "TEXT"
      Delete the [ORPHANS & PENDING] line(s) whose text contains TEXT. Use the same (or a shorter
      unique substring of the) wording you used in add-orphan.

  check-flow-step <path> --step "TEXT"
      Flip the trailing ⬜ to ✅ on the [SYSTEM_FLOW] line whose text contains TEXT.

  status <path>
      Report how many unresolved orphans and unchecked flow steps remain, and print a clear
      COMPLETE / NOT COMPLETE verdict. Exit code 0 if complete, 1 if not — usable as a gate.

Usage:
    python3 sync_project_state.py add-orphan ./PROJECT_MAP.md --item "Retry logic for payment webhook" --reason "deferred, happy path ships first"
    python3 sync_project_state.py resolve-orphan ./PROJECT_MAP.md --item "Retry logic for payment webhook"
    python3 sync_project_state.py check-flow-step ./PROJECT_MAP.md --step "User confirms order"
    python3 sync_project_state.py status ./PROJECT_MAP.md
"""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

ORPHANS_MARKER = "[ORPHANS & PENDING]"
FLOW_MARKER = "[SYSTEM_FLOW]"


def today():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def read_lines(path):
    p = Path(path)
    if not p.exists():
        print(f"[error] {p} does not exist. Run osta-architect's manage_project_map.py init first.")
        sys.exit(1)
    return p, p.read_text(encoding="utf-8").splitlines(keepends=True)


def find_section(lines, marker):
    """Return (start, end): start = index of the '## ...marker...' heading line, end = index of the
    next '## ' heading after it (or len(lines) if none). Returns (None, None) if marker isn't found."""
    start = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("##") and marker in stripped:
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


def cmd_add_orphan(args):
    path, lines = read_lines(args.path)
    start, end = find_section(lines, ORPHANS_MARKER)
    if start is None:
        print(f"[error] Could not find a '{ORPHANS_MARKER}' heading in {path}. Is this a valid PROJECT_MAP.md?")
        return 1

    section = lines[start + 1:end]
    while section and section[-1].strip() == "":
        section.pop()
    new_entry = f"- [ ] {args.item} — {args.reason} — {today()}\n"
    section.append(new_entry)
    section.append("\n")

    new_lines = lines[:start + 1] + section + lines[end:]
    path.write_text("".join(new_lines), encoding="utf-8")
    print(f"[added] orphan: {args.item}")
    return 0


def cmd_resolve_orphan(args):
    path, lines = read_lines(args.path)
    start, end = find_section(lines, ORPHANS_MARKER)
    if start is None:
        print(f"[error] Could not find a '{ORPHANS_MARKER}' heading in {path}.")
        return 1

    kept = []
    removed = 0
    for line in lines[start + 1:end]:
        if line.strip().startswith("- [") and args.item in line:
            removed += 1
            continue
        kept.append(line)

    if removed == 0:
        print(f"[not found] No orphan line containing '{args.item}' under {ORPHANS_MARKER}.")
        return 1

    new_lines = lines[:start + 1] + kept + lines[end:]
    path.write_text("".join(new_lines), encoding="utf-8")
    print(f"[resolved] removed {removed} orphan line(s) matching: {args.item}")
    return 0


def cmd_check_flow_step(args):
    path, lines = read_lines(args.path)
    start, end = find_section(lines, FLOW_MARKER)
    if start is None:
        print(f"[error] Could not find a '{FLOW_MARKER}' heading in {path}.")
        return 1

    matched = False
    for i in range(start + 1, end):
        if args.step in lines[i]:
            matched = True
            if "⬜" in lines[i]:
                lines[i] = lines[i].replace("⬜", "✅", 1)
                print(f"[checked] {lines[i].strip()}")
            elif "✅" in lines[i]:
                print(f"[already checked] {lines[i].strip()}")
            else:
                print(f"[warning] Matching line has no ⬜/✅ marker, left unchanged: {lines[i].strip()}")

    if not matched:
        print(f"[not found] No {FLOW_MARKER} line containing '{args.step}'.")
        return 1

    path.write_text("".join(lines), encoding="utf-8")
    return 0


def cmd_status(args):
    path, lines = read_lines(args.path)

    o_start, o_end = find_section(lines, ORPHANS_MARKER)
    f_start, f_end = find_section(lines, FLOW_MARKER)

    orphan_count = 0
    if o_start is not None:
        orphan_count = sum(1 for line in lines[o_start + 1:o_end] if line.strip().startswith("- ["))

    unchecked_count = 0
    if f_start is not None:
        unchecked_count = sum(line.count("⬜") for line in lines[f_start + 1:f_end])

    print(f"Orphans pending:      {orphan_count}")
    print(f"Flow steps unchecked: {unchecked_count}")

    if orphan_count == 0 and unchecked_count == 0:
        print("\nVERDICT: COMPLETE")
        return 0

    print("\nVERDICT: NOT COMPLETE")
    return 1


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add-orphan", help="Add a new [ORPHANS & PENDING] entry")
    p_add.add_argument("path")
    p_add.add_argument("--item", required=True)
    p_add.add_argument("--reason", required=True)
    p_add.set_defaults(func=cmd_add_orphan)

    p_resolve = sub.add_parser("resolve-orphan", help="Delete a matching [ORPHANS & PENDING] entry")
    p_resolve.add_argument("path")
    p_resolve.add_argument("--item", required=True, help="Substring uniquely matching the orphan line to remove")
    p_resolve.set_defaults(func=cmd_resolve_orphan)

    p_check = sub.add_parser("check-flow-step", help="Flip a [SYSTEM_FLOW] step's ⬜ to ✅")
    p_check.add_argument("path")
    p_check.add_argument("--step", required=True, help="Substring uniquely matching the flow step line")
    p_check.set_defaults(func=cmd_check_flow_step)

    p_status = sub.add_parser("status", help="Report orphan/flow completion status")
    p_status.add_argument("path")
    p_status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
