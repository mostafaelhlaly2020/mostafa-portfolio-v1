# Security Sweep & Production-Readiness Checklist — Quick Reference

Same content as `SKILL.md` §3 and §6, flattened into one pass/fail pass — work it top to bottom on
every file the fix touched. Use this specifically when you're short on time or attention; a flat
checklist catches what a rushed read of the prose skips.

## Security Sweep (per file touched)

- [ ] **Injection** — no query/command built by string concatenation or interpolation of user input.
- [ ] **Access control / IDOR** — every fetch-by-ID also checks the caller owns/may access that ID.
- [ ] **Auth brute force** — login, OTP, and password-reset endpoints are rate-limited.
- [ ] **Password reset tokens** — short-lived, high-entropy, single-use, invalidated after use.
- [ ] **Token/session config** — access tokens short-lived; refresh tokens in `httpOnly` cookies; signing secret from env/secret store.
- [ ] **Mass assignment** — update endpoints apply an explicit field allow-list, never the raw request body.
- [ ] **XSS** — user content renders as text by default; any HTML rendering is explicitly sanitized.
- [ ] **CSRF** — state-changing requests carry a CSRF token or rely on `SameSite` cookies + origin check.
- [ ] **SSRF** — any server-side fetch of a client-supplied URL is host/scheme allow-listed.
- [ ] **Hardcoded secrets** — no literal key/password/token anywhere that gets committed.
- [ ] **Sensitive logging** — no password/token/card data in logs or in client-facing error bodies.
- [ ] **File upload** — validated by content, stored under a generated name, size-limited.
- [ ] **Deserialization** — untrusted input parsed with a data-only format (JSON / safe YAML), never one that builds arbitrary objects.
- [ ] **Misconfiguration** — CORS is an explicit allow-list; debug mode is off by default in production.
- [ ] **Dependencies** — the ecosystem's audit tool has been run on anything touched or added.

## Production-Readiness Gate

- [ ] Error responses to the client are generic — no stack trace, file path, or library version.
- [ ] Every external input is validated at the boundary, not trusted because "the frontend checks it."
- [ ] Authentication/authorization is enforced on every endpoint this change touched.
- [ ] Anything accepting external input has a rate limit, a timeout, and a size limit.
- [ ] Secrets are environment/secret-manager sourced — nothing live in `.env.example` or test fixtures.
- [ ] A failure here would actually show up in logs/metrics/traces, not start the next incident from zero.
- [ ] The system fails closed on an unexpected error.
- [ ] Dependencies in the touched area are current and audited.

All boxes checked → proceed to §7 (Clean-Up & State Sync) in `SKILL.md`. Any box you can't check → the
fix isn't done yet, regardless of how confident the rest of the diff looks.
