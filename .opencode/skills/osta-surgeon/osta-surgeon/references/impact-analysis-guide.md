# Reference: Impact Analysis Guide

Detail for Protocol 1 — confirming exactly what a surgical edit actually touches before you touch it.

---

## Reading PROJECT_MAP.md Effectively

Don't skim it. Specifically extract, before writing any code:
- **`[TECH_STACK]`** — so you know what's actually available (don't introduce a library that
  duplicates something already in use).
- **`[SYSTEM_FLOW]`** — so you know whether this fix sits inside an existing step, or implies a step
  that was never actually in the approved flow (the second case is an `osta-architect` conversation).
- **`[ARCHITECTURE]`** — so you know where the existing Shared/Core layer actually lives, instead of
  guessing or creating a second one.
- **`[ORPHANS & PENDING]`** — check whether the thing you're fixing is *already* a known, intentionally
  deferred gap. If so, this fix might be closing it — confirm, then resolve that entry as part of
  Protocol 4.

If the project has no `PROJECT_MAP.md` at all (a pre-existing codebase from before these skills
existed), don't block the fix on creating one from scratch — that's disproportionate for a small
surgical change. Mention it to Mostafa as a one-line note, and consider suggesting `osta-architect`
for a proper retrofit if the project is going to see ongoing work.

---

## What "Affected Files" Actually Means

A file is affected if any of these are true — not just "the file where the bug lives":
- It contains the symbol you're changing (the direct edit).
- It calls/imports the symbol or file you're changing.
- It shares a data shape (a type, a DB column, an API response shape) with what you're changing.
- It has a test that exercises the code path you're changing.

Use `scripts/impact_analysis.py` for the first two mechanically — the last two need you to actually
read the affected code, no script will reliably find "shares a data shape with" for you.

```bash
# Find every line referencing a function/class/variable name across the codebase
python3 scripts/impact_analysis.py /path/to/project --symbol calculateShipping

# Find every file that (heuristically) imports/requires a given file
python3 scripts/impact_analysis.py /path/to/project --importers-of src/utils/shipping.py

# Narrow either mode to specific extensions if the codebase is large/mixed-language
python3 scripts/impact_analysis.py /path/to/project --symbol calculateShipping --ext .py,.ts
```

**`--importers-of` is heuristic, not a real static analyzer** — it's regex-based pattern matching for
common `import`/`require`/`from`/`#include`/`use` statements referencing the file's base name. It will
have false positives (a different file that happens to share a name) and false negatives (dynamic
imports, re-exports, string-built import paths). Treat its output as a strong starting list to verify
by reading, not as ground truth to act on blindly.

---

## When Impact Analysis Itself Reveals an Architecture Question

If, while mapping affected files, you discover that the "small fix" actually requires touching
`[ARCHITECTURE]` itself (e.g. the Shared/Core layer doesn't have a sensible place for this logic, or
the fix only makes sense by changing how two domains talk to each other) — stop. That's no longer a
surgical edit, that's a re-architecture, and it belongs to `osta-architect`, not this skill. Say so to
Mostafa explicitly rather than quietly absorbing an architecture decision into what was framed as a
small fix.

---

## Verifying a Dependency Version Before Use

If the fix needs a new package, or bumps an existing one:
- If `osta-architect` is installed, reuse its `check_versions.py` (covers npm/PyPI/crates.io/GitHub
  with zero extra dependencies).
- If it isn't installed, check the official registry directly (npm registry, PyPI JSON API, crates.io
  API, or the package's GitHub releases page) rather than relying on training-data memory, which can
  be stale or include since-deprecated versions.
