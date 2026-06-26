# Reference: Verification & Cleanup Guide

How to actually execute Protocol 2 (Self-Verification — Loop Until Verified) without it becoming a
box-checking exercise.

---

## Writing the Verification (Test or Simulation)

Pick whichever of these is practical for the piece you just built — in order of preference:

1. **A real automated test**, in whatever framework the project already uses (per `[TECH_STACK]` in
   `PROJECT_MAP.md`). One test that exercises the actual success criterion you wrote down
   (`assets/definition_of_done_template.md`), plus at least one realistic failure case.
2. **A scripted simulation**, when a full test isn't practical yet (e.g. the project has no test
   harness set up for this layer): actually run the code with realistic inputs — call the function,
   hit the endpoint with `curl`, drive the CLI command — and read the real output. Record what you
   observed, not what you expected to observe.
3. **A manual walk-through with explicit checks**, only as a last resort (e.g. a piece of UI with no
   testing infrastructure at all yet): describe the exact sequence of actions and the exact expected
   state after each one, then verify you can mentally trace through it without a contradiction.

What's never acceptable: declaring something verified because "the code looks right" with none of the
above actually executed.

### A test that doesn't earn its name
A test that only asserts the function ran without throwing isn't verifying behavior. Match the
assertion to the actual success criterion:
```python
# Doesn't verify the actual requirement — only that nothing crashed.
def test_checkout():
    result = checkout(cart)
    assert result is not None
```
```python
# Verifies the actual success criterion.
def test_checkout_invalid_email_blocks_submission():
    result = checkout(cart, email="not-an-email")
    assert result.status == "rejected"
    assert result.api_calls_made == 0
```

---

## Regression Checking

Before moving to the next feature, ask: **what else reads or writes the things this change touched?**

- Same file → re-check every function in it that you didn't just write, not just the one you edited.
- Same shared function/module → re-check every caller you can find.
- Same data shape (a shared type, a shared DB table/column, a shared API response shape) → re-check
  every consumer of that shape.
- Same shared UI component → re-check every screen that renders it.

If a test suite already exists for any of those, run it. If it doesn't yet, do the same walk-through
from "Writing the Verification" above for the previously-working behavior, not just the new one.

---

## Orphan-Code Cleanup — Scope Discipline

**Clean up:**
- An import you added and no longer need after a refactor within this same change.
- A branch of code that became unreachable because of a change you just made.
- A debug `print`/`console.log`/`dd()` you added while building this feature.
- A function you wrote earlier in this session that got superseded by a later approach in the same
  task.

**Don't clean up (flag instead):**
- Pre-existing dead code you merely noticed while working nearby, that you didn't cause.
- A pre-existing style inconsistency unrelated to what you're building.
- A pre-existing TODO that isn't blocking your current task.

For anything in the second list, either add it to `[ORPHANS & PENDING]` with an honest reason ("found,
not caused, by this change") or mention it to Mostafa directly — don't silently fold it into the
current task's diff. Scope creep at the code level looks exactly like helpfulness in the moment and
exactly like an unreviewable diff in hindsight.

---

## Before You Call It "Done"

Quick gate, every time:

1. Did you run (or simulate) the actual behavior, not just read the code? ✅/❌
2. Did you check the things this change touches for regressions? ✅/❌
3. Did you clean up only what you caused, and flag (not silently fix) what you merely noticed? ✅/❌
4. Did `scripts/scan_placeholders.py` come back clean on the files you touched? ✅/❌

All four "yes" → proceed to Protocol 3 (state sync) and move on. Any "no" → you're not done yet.
