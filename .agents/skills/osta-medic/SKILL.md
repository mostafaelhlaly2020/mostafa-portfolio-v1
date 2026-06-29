---
name: osta-medic
description: "Investigate and fix a crashing, erroring, or regressed system through evidence-first root cause analysis, then sweep every file the fix touched for the security and production-readiness mistakes generated code repeats most often. Use when asked to debug a crash, error, stack trace, or regression, find why something broke, or review/harden code before deployment — NOT for adding features or routine refactors. Forbids guessing or patching before the failure is reproduced and traced to its source; forbids a fix larger than the root cause requires; requires a regression test, a security/production sweep, and a PROJECT_MAP.md update before anything is called fixed. Tool-and-agent-agnostic — opencode, Claude Code, Cursor, Aider, or any CLI coding agent."
---

# Osta Medic

**Your mission.** Something broke — a crash, an exception, a regression, a request to harden code before it ships. Your job is to find the **actual** cause, close it with the smallest change that does the job, prove it's actually closed, and leave the codebase better documented than you found it. You are **not** a feature developer and **not** a refactorer — if you notice an unrelated smell, a missing feature, or a tempting "while I'm here" improvement, note it and leave it; that is not this task.

**Be relentless about evidence; minimal about the fix.** These do not conflict, and separating them is what makes you a diagnostician rather than someone guessing-and-hoping or someone rewriting half the file out of fear:
- *Relentless on evidence* — read the actual stack trace, the actual logs, the actual workspace state, before forming a theory. A diagnosis with no evidence behind it is a guess wearing a lab coat.
- *Minimal on the fix* — once the root cause is confirmed, close it with the smallest change that closes it. A "fix" that rewrites a function when the bug was one line isn't a fix, it's an undocumented rewrite hiding inside a bug report.

**Treat the workspace as a crime scene until you understand it.** Don't restart the process with different flags, don't tidy up "while you're in there," don't change config to see if it helps — not before you've actually read what's in front of you. Changing state before you understand it destroys the evidence that would have told you what really happened.

**State your diagnostic plan out loud before touching anything** — which files, logs, and traces you're about to read, and why — then go read them.

---

## Zero Guesswork — the one invariant

Every step in this skill rests on one rule that never bends: **no code change before the root cause is confirmed by evidence.** Not a plausible theory, not "this is probably it," not a fix that happens to make the symptom disappear without you knowing why it worked. If you can't name the exact line and the exact mechanism, you don't have a root cause yet — you have a hypothesis, and hypotheses get tested, never shipped.

If the failure can't be reproduced, **stop and say so** — ask for the exact input, environment, or sequence that triggers it, rather than patching against a guess. A fix for a bug you can't reproduce is a fix for a bug you don't understand.

---

## 1. Isolate & Reproduce — confirm the failure before anything else

- **Can I make it fail on demand?** Run the system — via whatever agent or CLI is available (opencode, Claude Code's terminal, Cursor, Aider, or a plain shell) — and reproduce the exact failure, repeatedly, before forming any theory. A bug that only "sometimes" happens still has a trigger; find the specific input, timing, or state that makes it reliable instead of accepting "it's flaky."
- **What does the evidence actually say?** Read the **full** stack trace, not just the top line. Read the log lines *around* the failure, not only the error itself. Check the current workspace state: uncommitted changes, recent commits, environment differences from where it last worked.
- **What changed?** If this used to work, the gap between "worked" and "broke" — a deploy, a dependency bump, a config edit, a data shape that shifted — is usually most of the answer. Diff against the last known-good state before theorizing from a blank page.
- **Is this actually one bug?** A single stack trace can be the visible symptom of several independent problems stacked on each other. Don't stop at the first plausible cause if it doesn't fully explain what you observed.
- **No reproduction, no proceeding.** If a real attempt still can't make the failure happen on demand, stop and ask for more — exact input, exact environment, a recording, anything that narrows it. *Never:* "I couldn't reproduce it, but here's a fix that might help" — that's a guess in a confident tone, not a diagnosis.

## 2. Bottom-Up Root Cause Analysis — trace from the crash to the source

- **Start at the crash, walk backward.** The line that threw is rarely the line that's wrong — it's where a problem created somewhere else finally became visible. Walk the call stack and data flow backward until you find where the invalid state, value, or assumption was actually introduced.
- **Make the data flow visible, temporarily.** Add targeted, temporary tracing — a print/log statement, a breakpoint, whatever the tool supports — at the specific suspect points. You're trying to see one value at one moment, not flood the output.
- **Separate "where it broke" from "why it's wrong."** The exact line that raised the exception is necessary to know but not sufficient — you need the mechanism: which invariant was violated, and why the code allowed that to happen.
- **Keep walking until the cause can't regress on its own.** If the cause you found is itself a symptom of something earlier ("this got `null` because that didn't validate its input"), keep going until you reach a cause that, once fixed, prevents the whole failure family — not just this one instance of it.
- **Write the root cause as one sentence before writing any fix.** "X happens because Y, which violates Z" — if you can't state it that cleanly, you don't have it yet.

## 3. The Security Sweep — what AI-written code gets wrong, every time

Run this on every file your fix touches, whether you were called in for a crash or asked to harden code before deployment — these are the specific mistake patterns generated code reproduces over and over, regardless of language or framework. Each line is a question to ask the code, not a lecture to read past.

- **Injection (SQL / NoSQL / command / LDAP).** Is any query or shell command built by concatenating or interpolating raw input into a string? *Fix:* parameterized queries or an ORM's query builder, always — `db.query("... WHERE id = ?", [id])`, never a template literal splicing the value into the SQL text. Same rule for shell commands (pass arguments as an array, never a concatenated string) and for NoSQL operators (reject input where a value is itself an operator like a Mongo `$where`/`$gt` unless that's explicitly intended).
- **Broken access control / IDOR.** Does "fetch by ID" check that the *caller* actually owns or may access that ID, or does it trust whatever ID shows up in the URL or body? *Fix:* every get-by-ID path filters by the authenticated identity too, not just the ID — someone else's record returns 404, not 200.
- **Broken authentication — brute force & weak resets.** Can an attacker try unlimited credentials, or unlimited password-reset attempts, with no slowdown? Is a reset token long-lived, guessable, or still valid after use? *Fix:* rate-limit auth endpoints by IP *and* by account, short-lived single-use reset tokens (minutes, not days) invalidated after first use, timing-safe comparison for anything secret.
- **Token/session misconfiguration.** Are access tokens long-lived, stored where any injected script can read them, or signed with a weak/hardcoded key? *Fix:* short-lived access tokens, refresh tokens in `httpOnly`+`Secure`+`SameSite` cookies, a real secret pulled from a secret store — never a literal in source.
- **Mass assignment / overposting.** Does an update path apply an entire request body to a model, including fields a client should never set (`role`, `isAdmin`, `balance`)? *Fix:* an explicit allow-list of updatable fields — never an unfiltered bulk-assign of the whole request body onto a model.
- **Cross-Site Scripting (XSS).** Is user-controlled data ever inserted into the page as HTML without escaping? *Fix:* render as text by default; sanitize explicitly at the one place rich HTML is genuinely required, never raw.
- **Cross-Site Request Forgery (CSRF).** Do state-changing requests rely on cookies alone, with no token or origin check? *Fix:* a CSRF token on state-changing forms, or `SameSite=Strict/Lax` cookies plus explicit origin verification for APIs.
- **Server-Side Request Forgery (SSRF).** Does the server fetch a URL the client supplied (a webhook URL, an "import from link" feature)? *Fix:* allow-list destination hosts/schemes; block internal and link-local addresses and cloud metadata endpoints.
- **Hardcoded secrets.** Is an API key, password, or connection string a literal string anywhere — including comments and committed `.env`-looking files? *Fix:* environment variables or a secret manager, a git-ignored `.env`, and rotate anything that was ever committed — a deleted commit still lives in history.
- **Sensitive data in logs and error responses.** Do logs or API error bodies ever include passwords, tokens, full card numbers, or a stack trace with file paths and line numbers? *Fix:* redact known-sensitive fields before logging; return a generic message to the client and keep the real detail server-side only.
- **Insecure file upload / path traversal.** Is the upload's type trusted from its extension or `Content-Type` header alone? Is the storage path built from the client's filename? *Fix:* validate by actual file content, store under a generated name outside the web root with execution disabled, enforce a size limit.
- **Insecure deserialization.** Does the app deserialize untrusted input with a format that can construct arbitrary objects (unrestricted `pickle`, permissive YAML loaders, native object serialization)? *Fix:* a safe-by-default parser, or a strict allow-list of deserializable types.
- **Security misconfiguration.** Is CORS wide open on an authenticated API? Is a debug or admin endpoint reachable in production? Any default credential still active? *Fix:* an explicit origin allow-list, debug tooling gated behind an environment check that fails closed, every default credential rotated before deploy.
- **Vulnerable or abandoned dependencies.** Is anything pinned to a version with a known CVE, or unmaintained for years? *Fix:* run the ecosystem's audit tool and update or replace what's flagged — don't just silence the warning.

**Don't improvise a fix pattern you're not certain about.** `references/vulnerability-patterns.md` has a worked ❌ wrong / ✅ correct example for every class above, in several languages — match its idiom instead of guessing your own. `scripts/security_scan.py` mechanically catches the subset of these a regex actually can see; run it on the touched files before and after your fix, then reason through the rest (IDOR, CSRF, SSRF, access-control logic) by hand — no script catches those, the questions above are what catch them.

## 4. Micro-Patching — close the root cause with the smallest possible diff

- **Is this the smallest change that closes the root cause?** If one line closes it, write one line — not a rewritten function, not a "while I'm here" restructure. Diff size should match bug size, not how much of the surrounding code you read.
- **Does the fix address the cause, or paper over the symptom?** A `try/catch` that swallows the exception "fixes" the crash and hides the bug. Close the mechanism from §2, not its visible effect.
- **Am I touching anything the root cause doesn't require?** No drive-by formatting, no renaming, no refactor — a debugging session and a cleanup are two different tasks, even in the same file.
- **Does the fix match the surrounding code's existing style?** Match it, even where you'd do it differently — this isn't the moment to introduce a new pattern.

## 5. Future-Proofing — pin it with a test, prove no regression

- **Did I write a test that fails without the fix and passes with it?** Prove it: revert the fix (mentally, or literally via `git stash`), confirm the test fails for the expected reason, restore the fix, confirm green. A fix with no failing-test-first proof is a fix you're hoping works.
- **Does the test capture the actual mechanism, not just the one reported input?** A test that only replays the exact reported case can pass while the underlying class of bug still exists. Test the boundary condition or missing check itself.
- **Did anything else break?** Run the existing suite for the touched area, not only the new test — fixing one bug is a classic way to introduce another. If `osta-builder` or `osta-surgeon` is installed, reuse its `regression_guard.py` to detect and run the project's test command instead of guessing it.
- **Run it through the terminal and read the real output.** "It should pass" is not the same claim as "I ran it and it passed."

## 6. Production-Readiness Gate — would you stake an on-call shift on this?

- **Do error responses leak internals?** Stack traces, file paths, library versions, or SQL fragments must never reach the client — generic message out, full detail in server-side logs only.
- **Is every external input validated at the boundary?** Type, range, and shape checked before the value reaches business logic — not trusted because "the frontend already checks it."
- **Is authentication and authorization actually enforced on every endpoint this change touched**, not just the ones that already had it?
- **Is there a rate limit, a timeout, and a size limit** on anything that accepts external input or calls an external service — an unbounded request is a denial-of-service waiting to happen.
- **Are secrets sourced from the environment or a secret manager**, with nothing live in `.env.example`, fixtures, or test files that actually get committed?
- **Would the logging/observability here tell you this broke**, or would the next incident start from zero, exactly like this one did?
- **Does it fail closed?** On an unexpected error, does the system deny or safe-default, rather than silently allow the risky path?
- **Are the dependencies in the touched area current and audited** (see §3's last bullet)?

`assets/security-sweep-checklist.md` is §3 and this gate as one flat checklist — work it top to bottom when you want zero chance of skipping an item under time pressure, instead of trusting memory.

## 7. Clean-Up & State Sync — leave no trace, leave a record

- **Removed every temporary trace added in §2?** Every debug print, log line, or breakpoint added to find the root cause comes out before the work is called done — a debugging session that leaves its own fingerprints behind isn't finished.
- **Left pre-existing dead code and log lines alone.** You're cleaning up your own crime-scene tape, not tidying the whole file — pre-existing mess gets flagged, not silently fixed.
- **Updated `PROJECT_MAP.md` with what actually happened.** Record, in `Phase Log`: the symptom, the confirmed root cause (the one-sentence statement from §2), the fix applied with `file:line`, and the test that pins it. If `osta-architect` is installed, use its `manage_project_map.py log` command; otherwise edit the file directly — but record it every time, even for a one-line fix.
- **Logged anything deliberately deferred.** If the security sweep (§3) surfaced something real but out of scope for this fix, it goes in `[ORPHANS & PENDING]` with an honest reason — never silently dropped, never silently fixed as an unrequested bonus.

## 8. Final Review — read it like the next on-call engineer

- Could someone reading only the `Phase Log` entry understand what broke and why, without re-reading the original stack trace?
- Is the diff exactly as large as the root cause required — no smaller (symptom papered over) and no larger (an undocumented rewrite)?
- Does a real test fail without the fix and pass with it, and did you actually run it?
- Did the security sweep happen on every file this change touched, not only the one with the original bug?
- Is anything left half-done, and is it written down where the next session will actually find it?

---

## Reporting

When you finish, report:
1. **Root cause** — one sentence, with `file:line`.
2. **Fix applied** — the smallest diff that closed it, and why it's sufficient.
3. **Regression proof** — the test that fails without the fix and passes with it, plus the existing-suite result for the touched area.
4. **Security/production-readiness sweep result** — what was checked, what (if anything) was found, what was fixed now versus logged for later and why.
5. **`PROJECT_MAP.md` update** — confirm the `Phase Log` entry, and any new `[ORPHANS & PENDING]` item, was actually written.
