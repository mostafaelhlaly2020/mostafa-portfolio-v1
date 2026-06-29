# Reference: Surgical Discipline Guide

Detail for the 3 Surgical Change Rules — the difference between a precise fix and a diff nobody wants
to review.

---

## Rule 1: Touch Only What Must Be Touched

**The test:** for every changed line, can you point to the specific requested behavior it implements
or fixes? If the honest answer is "no, I just thought it'd be nicer this way," revert that line.

**Common ways this rule gets broken without noticing:**
- Your editor auto-formats a file on save and now half the file has whitespace/quote-style changes
  you didn't intend.
- You see a typo in a nearby comment and "just fix it while you're there."
- You notice a function could be cleaner and tidy it up "since you're already in this file."
- You reorder imports, or alphabetize something, as a side effect of adding one new import.

All four of these make the diff harder to review and harder to revert cleanly, and none of them were
asked for. Catch them before presenting the change:

```bash
python3 scripts/diff_scope_check.py /path/to/project
```

This runs `git diff` (or reads a diff you pass with `--diff-file`) and flags:
- Lines that changed only in whitespace.
- Lines where only a comment changed (code itself identical).
- Files touched that weren't in your declared impact-analysis list (pass it with `--expected-files`
  for a stricter check):
  ```bash
  python3 scripts/diff_scope_check.py /path/to/project --expected-files src/utils/shipping.py,tests/test_shipping.py
  ```

This is heuristic, same caveat as `impact_analysis.py` — review what it flags, don't auto-revert
blindly; some flagged lines might be legitimately necessary (e.g. a comment genuinely needed updating
because the behavior it described changed).

---

## Rule 2: Match the Existing Style Exactly

Before writing a single line, look at the file you're editing and answer:
- Indentation: tabs or spaces, how many?
- Quotes: single or double (JS/Python), and is it consistent or mixed?
- Naming: `camelCase`, `snake_case`, `PascalCase` — for variables, functions, classes respectively?
- Error handling pattern: does this codebase use exceptions, result objects, error-first callbacks,
  `Result<T, E>` types? Match whichever is already there.
- Comment style and density: terse one-liners, or fuller explanations? Match the existing density —
  don't suddenly add a paragraph of comments to a file that has none, and don't strip comments from
  a file that's heavily commented.

If the existing style is something you'd personally avoid (no error handling at all, inconsistent
naming, etc.) — match it anyway for this fix. A surgical edit is not the moment to impose your taste;
that's a refactor, and refactors need to be explicitly requested and scoped on their own, not smuggled
into a bug fix.

---

## Rule 3: Clean Up Only Your Own Mess

**Clean up (this change caused it):**
- An import that's no longer used because you removed the only call site.
- A helper function that's now unreachable because you replaced its only caller.
- A parameter that's now unused on a function you just modified.

**Don't clean up (you just noticed it, you didn't cause it):**
- A pre-existing unused import in a file you're editing, unrelated to your change.
- A pre-existing function with no callers that existed before your change.
- Inconsistent style elsewhere in the same file.

For the second list: either flag it as an `[ORPHANS & PENDING]` entry with an honest reason ("found,
not caused, by this fix"), or just mention it to Mostafa directly. Don't fold it into the current
diff — that's the same scope-creep-at-the-code-level problem Rule 1 exists to prevent, just applied to
deletions instead of additions.

---

## When the Three Rules Seem to Conflict With "Do It Properly"

Sometimes the *correct* fix really does require touching more than the minimal lines — e.g. the bug
exists because of a structural problem, not a local one. When that's genuinely true:

1. Say so explicitly to Mostafa rather than silently expanding scope: "the minimal fix would just
   patch the symptom here; the actual cause is X, fixing that properly touches Y and Z too — want the
   minimal patch, or the proper fix?"
2. Let him choose. Don't default to either option on his behalf.

This keeps the discipline intact (you're not casually expanding scope) while still being honest when
a truly minimal change would just be a band-aid.
