# Reference: Final Quality Gate — Plan Review Checklist

Adapted from the established "Plan Document Reviewer" template — the goal is to genuinely confirm a
plan is ready for implementation before telling Mostafa "okay, we're good to start," by simulating a
critical second pair of eyes reviewing your own work.

**Use this when:** the full plan has finished being written (after
`references/plan-writing-guide.md`), right before presenting it as "ready for implementation."

---

## Two Ways to Run It

### If you have a Task/Subagent tool available (e.g. inside Claude Code)
Send the plan to an independent subagent with exactly this prompt, so you get a genuinely fresh set of
eyes instead of reviewing your own work:

```
Task tool (general-purpose):
  description: "Review plan document"
  prompt: |
    You are a plan document reviewer. Verify this plan is complete and ready for implementation.

    **Plan to review:** [path to the plan file]
    **Spec for reference:** [path to the original spec/request, or the request text itself]

    ## What to Check

    | Category | What to Look For |
    |----------|------------------|
    | Completeness | TODOs, placeholders, incomplete tasks, missing steps |
    | Spec Alignment | Plan covers spec requirements, no major scope creep |
    | Task Decomposition | Tasks have clear boundaries, steps are actionable |
    | Buildability | Could an engineer follow this plan without getting stuck? |

    ## Calibration

    Only flag issues that would cause real problems during implementation. An implementer building
    the wrong thing or getting stuck is an issue. Minor wording or stylistic preferences are not.

    Approve unless there are serious gaps — missing requirements from the spec, contradictory steps,
    placeholder content, or tasks so vague they can't be acted on.

    ## Output Format

    ## Plan Review
    **Status:** Approved | Issues Found
    **Issues (if any):**
    - [Task X, Step Y]: [specific issue] - [why it matters for implementation]
    **Recommendations (advisory, do not block approval):**
    - [suggestions for improvement]
```

### If no subagent is available (plain Claude.ai)
Run the same review yourself, but with a different mindset than the one you wrote the plan with —
read it as if you're seeing it for the first time:

1. **Completeness**: does any Task contain a TODO, a gap, a missing step, or a description without
   actual code?
2. **Spec Alignment**: does every part of Mostafa's original request have a Task implementing it? And
   conversely — did anything extra (feature creep) sneak into the plan without being asked for?
3. **Task Decomposition**: are each Task's boundaries clear? Are the steps actually actionable, not
   vague descriptions?
4. **Buildability**: could a programmer with zero prior context on this project follow the plan
   without getting stuck?

---

## Approval Criteria (Calibration)

Approve the plan unless there are genuinely serious gaps:
- A requirement from the original request is missing from the plan entirely.
- Contradictory steps (one Task assumes something, another Task assumes the opposite).
- Actual placeholder content.
- A Task so vague it isn't actionable as written.

**Stylistic notes or wording preferences are not a reason to reject the plan** — note them under
"Recommendations" and move on.

---

## Output Format

```
## Plan Review
**Status:** Approved | Issues Found
**Issues (if any):**
- [Task X, Step Y]: [the specific issue] — [why it's a problem at implementation time]
**Recommendations (advisory, do not block approval):**
- [improvement suggestions, if any]
```

If the status is "Issues Found," fix the problems in the plan right away (go back to
`references/plan-writing-guide.md` if needed), then present it to Mostafa again — never present a plan
with known issues and call it done just to move things along.
