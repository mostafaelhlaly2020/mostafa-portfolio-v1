#!/usr/bin/env python3
"""
regression_guard.py — Protocol 3 helper (No Regression)

Auto-detects the project's test command from the files present, runs it, and reports a clear
pass/fail verdict — so "no regression" means an actual test run, not a guess.

Detection order (first match wins):
  package.json with a "test" script  -> npm/yarn/pnpm test (picked by lockfile present)
  pyproject.toml / pytest.ini / setup.cfg with pytest config, or a tests/ dir with *.py -> pytest
  Cargo.toml                          -> cargo test
  go.mod                              -> go test ./...
  Gemfile                             -> bundle exec rspec
  composer.json                       -> composer test (if a "test" script exists), else phpunit

Override detection entirely with --command "your exact test command".

Exit codes:
  0  tests ran and passed
  1  tests ran and failed
  2  no recognized test runner detected (and no --command given) — fall back to manual verification

Run this ONCE before your edit (baseline) and ONCE after (compare by eye) — it intentionally does not
stash/restore your changes automatically; see references/tdd-and-regression-guide.md for why.

Usage:
    python3 regression_guard.py /path/to/project
    python3 regression_guard.py /path/to/project --command "npm run test:unit"
"""

import argparse
import json
import os
import subprocess
import sys

TIMEOUT_SECONDS = 600
OUTPUT_TAIL_LINES = 60


def exists(root, *names):
    return os.path.exists(os.path.join(root, *names))


def detect_command(root):
    if exists(root, "package.json"):
        try:
            with open(os.path.join(root, "package.json"), "r", encoding="utf-8") as f:
                pkg = json.load(f)
        except (json.JSONDecodeError, OSError):
            pkg = {}
        if pkg.get("scripts", {}).get("test"):
            if exists(root, "pnpm-lock.yaml"):
                return ["pnpm", "test"]
            if exists(root, "yarn.lock"):
                return ["yarn", "test"]
            return ["npm", "test"]

    if exists(root, "pyproject.toml") or exists(root, "pytest.ini") or exists(root, "setup.cfg"):
        return ["pytest"]
    if exists(root, "tests") and any(
        name.endswith(".py") for name in os.listdir(os.path.join(root, "tests"))
    ):
        return ["pytest"]

    if exists(root, "Cargo.toml"):
        return ["cargo", "test"]

    if exists(root, "go.mod"):
        return ["go", "test", "./..."]

    if exists(root, "Gemfile"):
        return ["bundle", "exec", "rspec"]

    if exists(root, "composer.json"):
        try:
            with open(os.path.join(root, "composer.json"), "r", encoding="utf-8") as f:
                comp = json.load(f)
        except (json.JSONDecodeError, OSError):
            comp = {}
        if comp.get("scripts", {}).get("test"):
            return ["composer", "test"]
        return ["vendor/bin/phpunit"]

    return None


def run_command(cmd, root):
    print(f"--- Running: {' '.join(cmd)} (cwd={root}) ---\n")
    try:
        result = subprocess.run(
            cmd, cwd=root, capture_output=True, text=True, timeout=TIMEOUT_SECONDS
        )
    except FileNotFoundError:
        print(f"[error] Command not found: {cmd[0]}. Is the toolchain installed in this environment?")
        return 2
    except subprocess.TimeoutExpired:
        print(f"[error] Test command timed out after {TIMEOUT_SECONDS}s.")
        return 2

    output = (result.stdout or "") + (result.stderr or "")
    lines = output.splitlines()
    tail = lines[-OUTPUT_TAIL_LINES:] if len(lines) > OUTPUT_TAIL_LINES else lines
    if len(lines) > OUTPUT_TAIL_LINES:
        print(f"... ({len(lines) - OUTPUT_TAIL_LINES} earlier line(s) omitted) ...")
    print("\n".join(tail))

    verdict = "PASSED" if result.returncode == 0 else "FAILED"
    print(f"\n--- VERDICT: {verdict} (exit code {result.returncode}) ---")
    return result.returncode


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("root", help="Project root")
    parser.add_argument("--command", help='Override auto-detection with an exact command, e.g. "npm run test:unit"')
    args = parser.parse_args()

    if args.command:
        cmd = args.command.split()
    else:
        cmd = detect_command(args.root)
        if cmd is None:
            print(
                "[no test runner detected] Checked package.json, pyproject.toml/pytest.ini/setup.cfg, "
                "a tests/ dir, Cargo.toml, go.mod, Gemfile, composer.json — none matched.\n"
                "Pass --command explicitly, or fall back to a manual walk-through "
                "(see references/tdd-and-regression-guide.md)."
            )
            return 2

    code = run_command(cmd, args.root)
    return 0 if code == 0 else (1 if code != 2 else 2)


if __name__ == "__main__":
    sys.exit(main())
