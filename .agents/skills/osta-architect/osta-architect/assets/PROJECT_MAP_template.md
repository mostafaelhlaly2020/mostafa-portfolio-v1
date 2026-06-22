# PROJECT_MAP.md — Reference Template

This shows the *shape* of the four required sections plus the Phase Log. The script
`scripts/manage_project_map.py` uses a simplified version of this when creating a new file. The actual
content of any real project is written by you (El-Osta) based on the decisions made in the five
protocols — **never leave a section with generic or placeholder content.**

---

```markdown
# PROJECT_MAP.md — [Project Name]

> Last updated: [YYYY-MM-DD] — this file is the project's permanent external memory. Read it in full
> before making any change.

## [TECH_STACK]

Every actual dependency with its verified version (Protocol 1), and the date the version was last
checked:

| Component | Choice | Version | Verified On | Reason |
|---|---|---|---|---|
| e.g. Backend Framework | FastAPI | 0.x.x | YYYY-MM-DD | [short reason for the choice] |

## [SYSTEM_FLOW]

The user's journey (GUI) or the data flow (API/Backend) as verifiable goals (Protocol 2):

1. [Step 1 of the journey/flow] → ✅/⬜
2. [Step 2] → ✅/⬜
...

## [ARCHITECTURE]

- Actual file/folder structure (the result of Protocol 3), with the reasoning behind each split
  decision.
- The logging strategy decision (Protocol 4): which library/approach is used and why.
- Any significant architectural decision made, even a small one — so nobody (you or anyone else)
  re-opens a debate that's already settled.

## [ORPHANS & PENDING]

Points intentionally left pending, partially-implemented pieces, or known technical debt:

- [ ] [precise description of the pending item] — [reason it was deferred] — [date added]

## Phase Log

A sequential log of every phase/feature implemented on the project, most recent at the bottom:

### [YYYY-MM-DD] — [Phase Name]
[Precise summary of what was implemented or changed in this phase, including any update made to the
sections above]
```

---

## Usage Notes

- **An empty `[ORPHANS & PENDING]` section on a real, ongoing project is a red flag** — it usually
  means things are being swept under the rug, not that the project is genuinely 100% clean.
- When you update `[TECH_STACK]` with a new version, also update the verification date — not just the
  number.
- The `Phase Log` accumulates over time; never delete old entries even once they're outdated — they
  are the project's history.
