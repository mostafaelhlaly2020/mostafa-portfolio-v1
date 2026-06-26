# Definition of Done — Per-Feature Template

Fill this out (mentally or as actual notes) **before** writing a feature's code — that's what makes
Goal-Driven Execution real instead of a slogan. One of these per feature/task, not per project.

```markdown
## Feature: [name]

**Linked [SYSTEM_FLOW] step(s):** [exact step text from PROJECT_MAP.md — Protocol 4 requires this link]

**Success criterion (falsifiable):**
[One sentence that running the actual code could prove false. Not "works well" — something like:
"submitting the form with an invalid email shows an inline error and makes zero API calls."]

**Verification method:** Automated test | Scripted simulation | Manual walk-through
[Pick one — see references/verification-and-cleanup-guide.md for how to choose]

**Realistic failure case(s) this must also handle:**
- [e.g. network timeout, invalid input, empty result set, concurrent write]

**State sync on completion:**
- [ ] `sync_project_state.py check-flow-step` run for the linked [SYSTEM_FLOW] step(s)
- [ ] Any [ORPHANS & PENDING] entry this closes has been resolved (deleted, not just checked)
- [ ] Any new gap this work created has been added as a fresh [ORPHANS & PENDING] entry
- [ ] `scan_placeholders.py` run clean on the touched files
```

---

## Why the criterion has to come first

Writing the success criterion *after* the code tends to just describe whatever got built — it stops
constraining anything and starts rationalizing. Writing it first is what actually lets you stop and
say "this isn't done yet" instead of "this seems fine."
