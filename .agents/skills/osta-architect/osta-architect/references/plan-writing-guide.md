# Reference: Plan Writing Guide — From Architecture to an Executable Plan

Adapted from the established `writing-plans` methodology, so any implementation plan you hand Mostafa
is actually ready to execute — whether you implement it yourself afterward, hand it to another
programmer, or dispatch it to a subagent — with zero gaps.

**Why this rigor matters:** a plan with a "TODO" or "add validation later" isn't a plan — it's the
*intention* of a plan. Any gap in the plan turns, at actual implementation time, into an improvised
decision made under time pressure — which is exactly what the five protocols were trying to prevent in
the first place.

---

## Before Writing Tasks: Map the Files

Before writing any Task, decide upfront:
- Which files will be created from scratch, and which will be modified (with the approximate line
  range, if the file already exists).
- One sentence describing each file's responsibility.
- Files that change together should be organized close together (Domain-Driven, per Protocol 3).

This is the same decision made in Protocol 3 — just now expressed as something step-by-step
executable.

---

## The Right Task Size (Bite-Sized Tasks)

Every step has to be one simple action, doable in 2–5 minutes:

- "Write the failing test" — a step.
- "Run the test and confirm it fails as expected" — a step.
- "Write the minimal code that makes the test pass" — a step.
- "Run the test again and confirm it passes" — a step.
- "Commit" — a step.

Breaking things down this small means anyone (you, Mostafa, or a third programmer) can stop and pick
the plan back up at any point without getting lost.

---

## The Mandatory Plan Document Header

```markdown
# [Feature Name] — Implementation Plan

**Goal:** [one sentence describing what this plan builds]

**Architecture:** [2-3 sentences about the approach — the result of Protocol 3]

**Tech Stack:** [the actual libraries/versions confirmed in Protocol 1]

---
```

---

## Task Structure

Every Task must specify exact files, and every Step must contain the actual code, never a description
of the code:

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL

- [ ] **Step 3: Write the minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: precise description of the feature"
```
````

---

## The "No Placeholders" Rule — Absolutely Forbidden

Every step must contain the actual content a programmer would need. These patterns are **plan
failures** — never write them:

- "TBD", "TODO", "implement later", "fill in details".
- "Add appropriate error handling" / "add validation" / "handle edge cases" — without actual code.
- "Write tests for the above" without the real test code.
- "Similar to Task N" — write the code again; the programmer may read tasks out of order.
- A step describing the required action without showing *how* (actual code, when the step involves
  code).
- A reference to a type/function/method defined inconsistently in a different task.

---

## Self-Review After Writing the Plan

Once the full plan is written, re-read the original request with fresh eyes and check:

1. **Original request coverage**: is there a Task implementing every part of Mostafa's request? If
   there's a gap, write a new Task — don't leave it unaddressed.
2. **Placeholder scan**: scan the entire plan against the patterns in "No Placeholders" above. Any
   match gets fixed immediately.
3. **Name/type consistency**: a function called `clearLayers()` in Task 3 has to stay `clearLayers()`
   in Task 7 — if you find it became `clearFullLayers()`, that's a bug in the plan itself, before any
   code is even written.

If you find issues, fix them in the plan immediately — there's no such thing as "a second review,"
just fix it and move on.

---

## Where to Save the Plan

Save the plan to `docs/plans/YYYY-MM-DD-<feature-name>.md`, next to `PROJECT_MAP.md` at the project
root, unless the project already has a different convention in place — in that case, follow the
existing one; consistency matters more than the exact template.

---

## Handing Off to Implementation

After saving the plan and passing it through the final review (`references/plan-review-checklist.md`),
present Mostafa with a clear choice:

1. **Step-by-step with him now** — implement one Task, confirm it, move to the next.
2. **One subagent per Task** (if available, e.g. inside Claude Code) — review between each Task and
   the next.

If you're inside Claude Code and have a Task tool, actually use it for distributed execution;
otherwise (plain Claude.ai), execute the tasks yourself in order, pausing for confirmation after each
Task or each tightly related group of Tasks.
