# Reference: Live State Sync Guide

Exact mechanics for Protocol 3 — keeping `PROJECT_MAP.md` truthful in real time during execution,
instead of reconstructing it from memory at the end of a session.

---

## Division of Labor: `osta-architect` vs `osta-builder`

Both skills touch `PROJECT_MAP.md`, but they own different parts of its lifecycle — there's no
overlap, and you should never need to choose between their scripts for the same job:

| Tool | Owned by | Job |
|---|---|---|
| `manage_project_map.py init` | `osta-architect` | Create the file from scratch for a brand-new project |
| `manage_project_map.py log` | `osta-architect` (also used here) | Append a dated Phase Log entry at the end of a phase/session |
| `manage_project_map.py check` | `osta-architect` | Read-only report of which sections exist |
| `sync_project_state.py add-orphan` | **osta-builder** | Record a gap the instant it's discovered/created |
| `sync_project_state.py resolve-orphan` | **osta-builder** | Delete an orphan the instant it's closed and verified |
| `sync_project_state.py check-flow-step` | **osta-builder** | Mark a `[SYSTEM_FLOW]` step ✅ the instant it's delivered |
| `sync_project_state.py status` | **osta-builder** | Objectively answer "is the product done yet?" |

`osta-architect` fills in `[TECH_STACK]`, `[SYSTEM_FLOW]`, and `[ARCHITECTURE]` with real content when
the project starts. `osta-builder` never edits those three sections' *content* — it only flips
`[SYSTEM_FLOW]` checkmarks and manages `[ORPHANS & PENDING]` entries as execution proceeds. If
execution reveals that `[TECH_STACK]` or `[ARCHITECTURE]` itself needs to change, that's an
architecture decision — hand it back to `osta-architect` (see "When to Pause" in `SKILL.md`).

Still call `manage_project_map.py log` at the end of a meaningful chunk of work (a feature, a session)
to record a Phase Log entry — that habit doesn't change in the execution phase, it's the same
Protocol 5 commitment from `osta-architect`.

---

## When to Add an Orphan

The instant one of these becomes true — not at the end of the session:
- You create a function/endpoint/component that nothing calls yet.
- You discover an existing piece that was never actually wired into the flow.
- You're intentionally deferring part of a feature (e.g. building the happy path now, deferring the
  retry logic to a named follow-up).

```bash
python3 scripts/sync_project_state.py add-orphan ./PROJECT_MAP.md \
  --item "Retry logic for failed payment webhook" \
  --reason "deferred — happy path shipping first per Mostafa's priority"
```

## When to Resolve an Orphan

The instant the gap is actually closed **and verified** (Protocol 2) — not when you start working on
it, not before you've actually run/tested it.

```bash
python3 scripts/sync_project_state.py resolve-orphan ./PROJECT_MAP.md --item "Retry logic for failed payment webhook"
```

This deletes the matching line entirely — an orphan that's resolved doesn't linger as a checked-off
historical record; that's what `Phase Log` is for.

## Checking Off a Flow Step

The instant a `[SYSTEM_FLOW]` step is delivered and verified:

```bash
python3 scripts/sync_project_state.py check-flow-step ./PROJECT_MAP.md --step "User confirms order"
```

This matches the step by substring and flips its trailing `⬜` to `✅` in place — it doesn't touch
the step's wording.

## Checking Whether the Product Is Actually Done

This is the objective version of the Launch Command's stopping condition — don't eyeball the file,
run:

```bash
python3 scripts/sync_project_state.py status ./PROJECT_MAP.md
```

It reports the count of remaining `[ORPHANS & PENDING]` entries and remaining unchecked `⬜`
`[SYSTEM_FLOW]` steps, and prints a clear `COMPLETE` / `NOT COMPLETE` verdict. Only declare the product
finished to Mostafa when this says `COMPLETE`.
