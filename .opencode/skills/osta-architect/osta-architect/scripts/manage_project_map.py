#!/usr/bin/env python3
"""
manage_project_map.py — Protocol 5 helper (PROJECT_MAP.md — External Memory)

Three subcommands:

  check <path>                          -> report which required sections exist/are missing,
                                            and the last Phase Log entry (if any). Read-only,
                                            always safe to run first.

  init  <path> --project "NAME"         -> create a fresh PROJECT_MAP.md with the required
                                            section skeleton (TECH_STACK, SYSTEM_FLOW,
                                            ARCHITECTURE, ORPHANS & PENDING, Phase Log). Refuses
                                            to overwrite an existing file — use 'log' for that.

  log   <path> --phase "NAME" --summary "TEXT"
                                         -> append a dated Phase Log entry. Never touches the
                                            other sections — edit those directly with your own
                                            file-editing tools once the real content is known.

This script only scaffolds structure and appends history; it never invents the actual
TECH_STACK/SYSTEM_FLOW/ARCHITECTURE/ORPHANS content for you — that always has to come from a
real architectural decision made during the planning protocols, not from a script default.

Usage:
    python3 manage_project_map.py check ./PROJECT_MAP.md
    python3 manage_project_map.py init ./PROJECT_MAP.md --project "Dropshipping Store"
    python3 manage_project_map.py log ./PROJECT_MAP.md --phase "Add payment gateway" \\
        --summary "Integrated payment gateway X and replaced the old logging system with an async one"
"""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

REQUIRED_SECTIONS = ["[TECH_STACK]", "[SYSTEM_FLOW]", "[ARCHITECTURE]", "[ORPHANS & PENDING]"]
PHASE_LOG_HEADING = "## Phase Log"


def today():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def cmd_check(args):
    path = Path(args.path)
    if not path.exists():
        print(f"[missing] {path} does not exist yet. -> run 'init' for a brand-new project.")
        return 0

    text = path.read_text(encoding="utf-8")
    print(f"[found] {path}\n")

    print("Required sections:")
    for section in REQUIRED_SECTIONS:
        status = "present" if section in text else "MISSING"
        print(f"  - {section:<22} {status}")

    print()
    if PHASE_LOG_HEADING in text:
        entries = [l for l in text.splitlines() if l.startswith("### ")]
        print(f"Phase Log: {len(entries)} entr{'y' if len(entries) == 1 else 'ies'} found.")
        if entries:
            print(f"  Last entry: {entries[-1].strip()}")
    else:
        print("Phase Log: MISSING heading entirely (legacy file?) — 'log' will create it.")
    return 0


SKELETON = """# PROJECT_MAP.md — {project}

> Last updated: {date} — this file is the project's permanent external memory. Read it in full
> before making any change.

## [TECH_STACK]

| Component | Choice | Version | Verified On | Reason |
|---|---|---|---|---|
| _(not yet defined — fill in immediately with the result of Protocol 1)_ | | | {date} | |

## [SYSTEM_FLOW]

1. _(not yet defined — fill in immediately with the result of Protocol 2 as verifiable goals)_

## [ARCHITECTURE]

_(not yet defined — fill in immediately with the result of Protocol 3 and Protocol 4: file structure,
logging decision)_

## [ORPHANS & PENDING]

_(items intentionally left pending or known tech debt — leave this empty only if there's genuinely
nothing, never as a default)_

{phase_log_heading}

### {date} — Initial Setup (Phase 0)
PROJECT_MAP.md created and the five protocols run for the first time on this project.
"""


def cmd_init(args):
    path = Path(args.path)
    if path.exists():
        print(
            f"[refused] {path} already exists — 'init' never overwrites an existing PROJECT_MAP.md.\n"
            f"          Use 'log' to add a Phase Log entry, or edit the file directly for section updates."
        )
        return 1

    path.parent.mkdir(parents=True, exist_ok=True)
    content = SKELETON.format(project=args.project, date=today(), phase_log_heading=PHASE_LOG_HEADING)
    path.write_text(content, encoding="utf-8")
    print(f"[created] {path}")
    print(
        "          Skeleton only — now fill TECH_STACK / SYSTEM_FLOW / ARCHITECTURE / "
        "ORPHANS & PENDING with the real decisions from Protocols 1-4 (no placeholders)."
    )
    return 0


def cmd_log(args):
    path = Path(args.path)
    if not path.exists():
        print(f"[error] {path} does not exist. Run 'init' first for a brand-new project.")
        return 1

    text = path.read_text(encoding="utf-8")
    entry = f"\n### {today()} — {args.phase}\n{args.summary}\n"

    if PHASE_LOG_HEADING in text:
        new_text = text.rstrip("\n") + "\n" + entry
    else:
        # Legacy file without the heading yet — add it before appending the first entry.
        new_text = text.rstrip("\n") + f"\n\n{PHASE_LOG_HEADING}\n" + entry

    path.write_text(new_text, encoding="utf-8")
    print(f"[updated] {path}")
    print(f"          Appended Phase Log entry: {args.phase} ({today()})")
    print(
        "          Remember to also update TECH_STACK / SYSTEM_FLOW / ARCHITECTURE / "
        "ORPHANS & PENDING directly if this phase changed any of them."
    )
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_check = sub.add_parser("check", help="Report section/Phase-Log status (read-only)")
    p_check.add_argument("path")
    p_check.set_defaults(func=cmd_check)

    p_init = sub.add_parser("init", help="Create a brand-new PROJECT_MAP.md skeleton")
    p_init.add_argument("path")
    p_init.add_argument("--project", required=True, help="Project name (Arabic or English)")
    p_init.set_defaults(func=cmd_init)

    p_log = sub.add_parser("log", help="Append a dated Phase Log entry to an existing PROJECT_MAP.md")
    p_log.add_argument("path")
    p_log.add_argument("--phase", required=True, help="Short phase/feature name")
    p_log.add_argument("--summary", required=True, help="Precise summary of what changed in this phase")
    p_log.set_defaults(func=cmd_log)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
