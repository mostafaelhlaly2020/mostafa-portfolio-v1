# Reference: TDD & Regression Guide

Detail for Protocol 3 (Verification & Success) and Protocol 4 (State Sync).

---

## The Red-Green Cycle, For a Surgical Fix Specifically

1. **Write the test that captures the bug/requirement** — it should fail right now, for the reason
   you expect (the bug exists, or the feature doesn't exist yet). Run it and actually read the failure
   — confirm it's failing for *your* reason, not an unrelated setup error.
2. **Write the minimal change that makes it pass.** Minimal matters doubly here — this is a surgical
   fix, not a rewrite; the smallest change that legitimately satisfies the success criterion.
3. **Run it again, confirm green.**

```python
# Step 1 — fails right now: calculate_shipping doesn't handle international addresses
def test_calculate_shipping_international_address():
    result = calculate_shipping(weight_kg=2, country="FR")
    assert result.success is True
    assert result.cost > 0

# Step 2 — minimal fix inside the existing function, matching its existing style
# (the actual diff lives in the real source file, not duplicated here)
```

---

## What "No Regression" Actually Requires

It is not enough that your new test passes. Before calling the fix done:

- **Run the project's existing test suite** for the area you touched (ideally the whole suite, if
  it's fast enough; at minimum every test file covering files Protocol 1 identified as affected).
- Use `scripts/regression_guard.py` to do this without you having to remember the project's specific
  test command:
  ```bash
  python3 scripts/regression_guard.py /path/to/project
  ```
  It auto-detects the test runner from the project's files (`package.json` → npm/yarn/pnpm test,
  `pyproject.toml`/`pytest.ini` → pytest, `Cargo.toml` → cargo test, `go.mod` → go test, etc.) and
  reports a clear pass/fail with the real exit code. Override detection with `--command "..."` if the
  project uses something nonstandard.

### Why this script runs the suite but doesn't diff "before vs. after" automatically

A truly automatic before/after comparison would need to stash your uncommitted change, run the suite,
restore it, run again — that's a `git stash`-based workflow, and automating destructive git operations
on someone else's repository inside a script is exactly the kind of thing that goes wrong in a way
that's hard to undo. Instead: **run it yourself once before you start the edit (note the baseline
pass/fail), and once after (compare by eye).** Slightly more manual, meaningfully safer.

### If no test runner is detected at all

`regression_guard.py` will say so explicitly (exit code 2, distinct from pass=0/fail=1). In that case,
fall back to a manual walk-through of the previously-working behavior your change actually touches —
same standard as `osta-builder`'s verification guide: run it, read the real output, don't just read
the code and assume.

---

## Protocol 4: Handling Deprecated Code — Migrate Now vs. Log as Orphan

When your fix makes something else obsolete (an old helper superseded by a new shared one, an old API
shape no longer used once callers are updated), decide explicitly between two options — don't default
to neither:

**Migrate now, in this same change, when:**
- The number of call sites is small and Protocol 1 already found all of them.
- Leaving both versions around would itself be confusing or risk someone using the wrong one.

**Log as `[ORPHANS & PENDING]` instead, when:**
- Migrating every call site is a large, separate effort beyond this fix's scope (this is the
  legitimate version of "don't expand scope" — log it, don't silently do a much bigger refactor than
  what was asked for).
- The deprecated code might still be needed during a transition period (e.g. an old API version still
  serving existing clients).

Either way, update `PROJECT_MAP.md` the moment you've decided, using whichever tool is available:

```bash
# If osta-builder is installed — reuse its sync_project_state.py directly
python3 ../osta-builder/scripts/sync_project_state.py add-orphan ./PROJECT_MAP.md \
  --item "Old validateEmail() helper" --reason "superseded by shared validator, callers not yet migrated"

# Standalone fallback if osta-builder isn't installed
python3 scripts/log_deprecation.py ./PROJECT_MAP.md \
  --item "Old validateEmail() helper" --reason "superseded by shared validator, callers not yet migrated"
```

Never leave deprecated code both unmigrated *and* unlogged — that's the exact silent drift Protocol 4
exists to prevent.
