# Surgical Change Checklist — Quick Reference

One glance, before and after every edit. Full reasoning for any item lives in the three reference
files if you need it — this is the compressed version for a fix you've already understood.

## Before Writing Code

- [ ] Read `PROJECT_MAP.md` in full (if it exists).
- [ ] Ran `impact_analysis.py` for the symbol/file being changed — actual affected files listed, not
      guessed.
- [ ] Checked `[ORPHANS & PENDING]` — is this fix closing an already-known gap?
- [ ] Any new/bumped dependency version verified from the official registry, not memory.
- [ ] Wrote down one falsifiable success criterion for this fix.
- [ ] Noted the existing code style in the target file(s) (naming, quotes, error-handling pattern).
- [ ] Ran `regression_guard.py` once now, as the **baseline**, before changing anything.

## While Writing Code

- [ ] Wrote the failing test first; confirmed it fails for the expected reason.
- [ ] Touched only files Impact Analysis identified (or explained out loud why scope grew).
- [ ] Matched existing style exactly — no drive-by formatting, no reworded comments.
- [ ] Reused the existing Shared/Core layer and logging approach — didn't invent new ones.

## After Writing Code

- [ ] Test now passes (green).
- [ ] Ran `regression_guard.py` again — compared against the baseline by eye.
- [ ] Ran `diff_scope_check.py` — no unexplained drive-by lines flagged.
- [ ] Removed only the orphans this change actually caused; flagged (didn't silently fix) anything
      pre-existing merely noticed nearby.
- [ ] Any code this change deprecated is either migrated now or logged in `[ORPHANS & PENDING]` —
      never left both unmigrated and unlogged.
- [ ] `PROJECT_MAP.md` updated to reflect the actual current state, immediately.

All boxes checked → present the result to Mostafa using the Required Output Shape in `SKILL.md`. Any
box you can't check → you're not actually done, go back and close it.
