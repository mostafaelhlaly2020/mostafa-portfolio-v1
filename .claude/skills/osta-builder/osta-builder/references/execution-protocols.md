# Reference: The 4 Execution Protocols — Full Detail

Expanded version of what `SKILL.md` summarizes. Come back here for rationale, edge cases, or anything
beyond the quick summary.

---

## Execution Standards — Detail

### Execution Simplicity
Every extra abstraction or config knob written *during implementation* (not just at the architecture
stage) has a cost: more surface area to test, more surface area to break, more code for the next
session (you or anyone else) to re-read before touching it. The test is the same one used for
architecture: "does this solve a problem that exists right now?" If a feature needs a simple `if`, write
the simple `if` — don't build a generic rules engine for one rule.

### Goal-Driven Execution
A success criterion has to be **falsifiable** — phrased so that you could be proven wrong by running
the actual code. "The login form works well" is not falsifiable. "Submitting valid credentials
redirects to `/dashboard` within one request cycle, and submitting invalid ones shows an inline error
without redirecting" is. Write the criterion before the code, not after — writing it after tends to
just describe whatever you happened to build, instead of constraining what you build.

---

## Protocol 1: Production-Ready Code Quality — Detail

**Why this matters:** a placeholder or `TODO` left "for now" has a way of quietly becoming permanent —
either nobody remembers it exists, or it ships before anyone circles back. Treating "no placeholders"
as optional is how production incidents get traced back to a comment that said `// handle this later`.

**What counts as a placeholder (non-exhaustive, but representative):**
- `TODO`, `FIXME`, `XXX`, `HACK` comments standing in for missing logic.
- A function/endpoint that returns a hardcoded value "just to make the UI work for now."
- An empty `catch`/`except` block, or one that only logs and silently swallows the error.
- A happy-path-only implementation with no handling for the realistic failure cases (a network call
  that doesn't handle a timeout, a form that doesn't handle invalid input).
- Code with zero logging on a path where `osta-architect`'s logging strategy says there should be one
  (e.g. a caught exception that never gets logged).

**Practical execution:**
1. Write the feature with real error handling and real logging calls from the start — don't write the
   happy path first and "add error handling later." Later rarely comes.
2. Before declaring any task done, run:
   ```bash
   python3 scripts/scan_placeholders.py <path(s) you touched>
   ```
   Fix every hit before moving on. A clean scan is necessary, not sufficient — it catches the obvious
   textual patterns, it doesn't replace actually reading your own code.

---

## Protocol 2: Self-Verification (Loop Until Verified) — Detail

**Why this matters:** "it should work" is not the same claim as "I ran it and it worked." The gap
between those two sentences is exactly where regressions and silent breakage live.

**Practical execution:**
- Prefer a real automated test. If the project's test setup doesn't make that practical yet for a
  specific piece, simulate the actual flow by hand (run the function with realistic inputs, hit the
  endpoint, walk through the UI state transitions) and record what you observed — not what you expect.
- **Orphan-code cleanup scope:** clean up only what your own change orphaned this session — an import
  you no longer need, a branch that's now unreachable, a debug `print`/`console.log` you added and
  forgot to remove. Do **not** use this as license to refactor pre-existing code you merely noticed
  while working nearby; flag that separately (as an `[ORPHANS & PENDING]` entry, or mention it to
  Mostafa) instead of silently expanding the task.
- **Regression check:** before moving to the next feature, mentally (or literally, if a test suite
  exists) re-run the previously-working features your change actually touched. "Touched" means: shared
  a file, a shared function, a shared data shape, or a shared UI component — not "exists in the same
  project."

Full detail and worked examples: `references/verification-and-cleanup-guide.md`.

---

## Protocol 3: Live State Sync — Detail

**Why this matters:** a `PROJECT_MAP.md` that's only updated "at the end" is already lying for most of
the session — it tells the next reader (you, in the next conversation, or anyone else) the project is
further along or further behind than it actually is, the exact thing Protocol 5 of `osta-architect`
exists to prevent.

**Practical execution:**
- Add an `[ORPHANS & PENDING]` entry the instant you notice or create a gap — not when you remember to,
  not in a batch at the end.
- Remove that entry the instant the gap is closed and verified (Protocol 2) — a resolved orphan is
  deleted, not left checked-off as a historical record (that's what `Phase Log` is for).
- Check off `[SYSTEM_FLOW]` steps the moment they're delivered and verified, same logic.

Full mechanics and the exact script commands: `references/state-sync-guide.md`.

---

## Protocol 4: Flow Adherence — Detail

**Why this matters:** scope creep doesn't only happen during planning — it happens line by line during
implementation too, usually disguised as "nice to add while I'm already in this file." Protocol 2 of
`osta-architect` prevents it at the planning stage; this protocol is its enforcement at the keyboard.

**Practical execution:**
- Before writing a piece of code, name the `[SYSTEM_FLOW]` step it serves. If you can't, stop.
- Two outcomes when you can't name one: either the flow is genuinely incomplete (a real gap —
  pause and hand back to `osta-architect`, see "When to Pause" in `SKILL.md`), or what you're about to
  write isn't actually required — drop it.
