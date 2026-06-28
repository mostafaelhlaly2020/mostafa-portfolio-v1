# PROJECT_MAP.md
## Mostafa Portfolio v1 — Crystal Glass CRM
**Project Root**: `E:/web site + n8n/portfolio web/mostafa-portfolio-v1/portfolio-v1`
**Stack**: Vite + React 19 + TypeScript + Tailwind CSS + React Router v6
**Branch**: `phase-2-app-shell-routing`
**Remote**: `origin/phase-2-app-shell-routing`
**Last Updated**: 2026-06-28
**Status**: Phase 1 — 100% COMPLETED · Phase 2 — 100% COMPLETED · Phase A — 100% COMPLETED

---

## Project History

| Date | Audit | Status |
|------|-------|--------|
| 2026-06-23 | Passed | Phase 2 App Shell & Routing stable. Core components decoupled. Language Context safely isolated in separate Provider/Context modules. GSAP contexts sanitized. |
| 2026-06-28 | Passed | Phase A Data Integrity Fixes complete. All Phase 2 regressions from Phase 1 resolved. |

---

## Directory Structure (Post-Phase 2)
```
mostafa-portfolio-v1/
├── src/
│   ├── app/                      # Legacy (Next.js 14 App Router — unused, retained for reference)
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.tsx              # ← NEW: Global layout wrapper (<Outlet> + Preloader + BottomNav + Footer + dir/lang sync)
│   │       └── SectionErrorBoundary.tsx # ← NEW: Per-section fault isolation with skeleton fallback
│   ├── contexts/
│   │   ├── LanguageContext.tsx          # ← NEW: Context + useLanguage hook (decoupled for React Refresh)
│   │   └── LanguageProvider.tsx         # ← NEW: Provider component (separate file — Fast Refresh compliant)
│   ├── hooks/
│   │   ├── useDirection.ts             # ← NEW: RTL/LTR MutationObserver with prev !== newDir loop guard
│   │   └── use-mobile.ts               # Pre-existing mobile detection
│   ├── data/                     # JSON data layer (9 files, UTF-8 clean)
│   │   ├── site.json             # Site metadata, nav, social, quickLinks
│   │   ├── hero.json             # Hero status, name, title, CTA, backgroundGradient
│   │   ├── about.json            # About label, heading, highlight, paragraphs
│   │   ├── skills.json           # Skills items with icon strings
│   │   ├── experience.json       # Experience items with bilingual dates/titles
│   │   ├── certifications.json   # Cert items with icon strings, platform, year
│   │   ├── testimonials.json     # Testimonials + companies array
│   │   ├── contact.json          # Form fields, methods (value normalized to LocalizedString)
│   │   └── projects.json         # Empty items array — ready for Phase 2 content
│   ├── lib/
│   │   └── data.ts               # Zod validation + iconMap + loadData()
│   ├── pages/                    # ← NEW: Route-level page components (7 files)
│   │   ├── LandingPage.tsx       # GSAP ScrollTrigger sections, context-based teardown
│   │   ├── AboutPage.tsx         # About + Certifications + Contact
│   │   ├── SkillsPage.tsx        # Index + /skills/:slug dynamic detail
│   │   ├── ProjectsPage.tsx      # Index + /projects/:slug dynamic detail
│   │   ├── PrivacyPolicyPage.tsx # SEO meta via react-helmet-async
│   │   ├── TermsPage.tsx         # SEO meta via react-helmet-async
│   │   └── CookiesPage.tsx       # SEO meta via react-helmet-async
│   ├── sections/                 # Section components (all migrated from hardcoded text)
│   │   ├── Hero.tsx              # ✅ reads hero.json
│   │   ├── About.tsx             # ✅ reads about.json
│   │   ├── Skills.tsx            # ✅ reads skills.json + iconMap (safe fallback)
│   │   ├── Experience.tsx        # ✅ reads experience.json
│   │   ├── Certifications.tsx    # ✅ reads certifications.json + iconMap (safe fallback)
│   │   ├── Testimonials.tsx      # ✅ reads testimonials.json
│   │   ├── Contact.tsx           # ✅ reads contact.json (polymorphic union removed)
│   │   ├── Footer.tsx            # ✅ reads site.json
│   │   ├── BottomNav.tsx         # ✅ reads site.json
│   │   ├── Preloader.tsx         # ✅ reads site.json
│   │   └── ScrollReveal.tsx      # Utility (unchanged)
│   ├── types/
│   │   └── content.ts            # 11 Zod schemas (237 lines), ContactMethod.value = LocalizedString
│   ├── App.tsx                   # ← REWRITTEN: BrowserRouter + Routes + Layout parent (9 routes)
│   ├── main.tsx                  # Entry point (unchanged)
│   └── styles/                   # Global CSS
├── package.json                  # three/@types/three removed, react-helmet-async added
├── tsconfig.json
└── PROJECT_MAP.md                # ← THIS FILE
```

---

## Phase 0 — Foundation (100% COMPLETED)

### Commit: `refactor(foundation): add JSON data layer, Zod schemas, data loader`
**Files Created (13):** 9 JSON data files, `content.ts` (11 Zod schemas), `data.ts` (loader + iconMap), `package.json` script.

| File | Lines | Purpose |
|------|-------|---------|
| `src/data/site.json` | 76 | Site metadata, nav, social, quickLinks, tagline |
| `src/data/hero.json` | 48 | Hero status, name, title, CTA, backgroundGradient |
| `src/data/about.json` | 42 | About label, heading, highlight, paragraphs, imageAlt |
| `src/data/skills.json` | 112 | Skills items with icon strings, titles, descriptions, tags |
| `src/data/experience.json` | 115 | Experience items with bilingual dates, titles, companies, responsibilities |
| `src/data/certifications.json` | 75 | Cert items with icon strings, platform, year, description |
| `src/data/testimonials.json` | 62 | Testimonials + companies array |
| `src/data/contact.json` | 76 | Form fields, methods, success/submit/info labels |
| `src/data/projects.json` | 12 | Empty items array placeholder |
| `src/types/content.ts` | 237 | 11 Zod schemas + inferred types + PortfolioDataSchema aggregate |
| `src/lib/data.ts` | 94 | `loadData()`, `iconMap` (16 lucide-react components), export validated data |
| `package.json` | +1 line | Added `"type-check": "tsc -b"` script |

**Verification**: `npm run type-check` ✅, `npm run build` ✅ (0 errors)

---

## Phase 1 — Section Migration & Data Integrity Remediation (100% COMPLETED)

### Architectural Changes Applied & Verified:

#### Layer 1 — Data Encoding & Repository Hygiene
- **What**: Verified all `src/data/*.json` files for UTF-8 encoding purity
- **Why**: Prevent ANSI high-ascii corruption on Unix/Windows runtimes
- **Verification**: `xxd` hex dump inspection confirmed zero encoding drift across all 9 JSON source files
- **Result**: All Persian/Arabic text segments render as pristine standard UTF-8 glyphs

#### Layer 2 — Bundle Bloat Purge (Three.js Removal)
- **What**: `npm uninstall three @types/three` — removed 8 transitive packages
- **Why**: Three.js explicitly forbidden by optimization constraints (mobile performance budget)
- **Verification**: Zero imports of `three` or `@types/three` in any file; `package.json` clean
- **Commit**: `bbe19ac` — `chore(deps): remove three and @types/three per Phase 1 optimization constraints`

#### Layer 3 — Safe Component Icon Lookup (WSOD Prevention)
- **What**: Applied `iconMap[skill.icon] || iconMap['Award']` fallback guard in `Skills.tsx` and `Certifications.tsx`
- **Why**: Future JSON mutation with unregistered icon identifier would cause React 19 unhandled runtime error (White Screen of Death) from evaluating undefined component object
- **Verification**: Safe rendering guaranteed for any unknown icon string
- **Commit**: `0c59fe2` — `refactor(ui): add safe fallback icon lookup for Skills and Certifications`

#### Layer 4 — Polymorphic Schema Elimination (ContactMethod.Value Normalization)
- **What**:
  - Restructured `ContactMethod.value` in `content.ts` from `z.union([z.string(), LocalizedString])` to strictly `LocalizedString`
  - Updated `contact.json` — all 4 method values (phone, email, website, location) now `{ ar, en }` structure
  - Refactored `Contact.tsx` render from ternary type-guard (`typeof item.value === 'string'`) to direct `{item.value.ar}`
- **Why**: Polymorphic schemas force presentation layer to evaluate runtime type-guards, violating type safety at root layer
- **Verification**: Zero type errors on contact rendering, no runtime guards required
- **Commit**: `543d1c5` — `refactor(data): normalize ContactMethod.value to LocalizedString and remove polymorphic type guard`

### Phase 1 Merge
- **Branch**: `phase-1-data-layer` merged → `main` via `a3aadb7` (no-ff)
- **PR**: #2 (12 commits, 6521+/498-) — CodeRabbit approved

---

## Phase 2 — App Shell, Routing & Layout (100% COMPLETED)

### Architectural Changes Applied & Verified:

#### Resolved: React Refresh Violation (God Context Decoupling)
- **Problem**: `LanguageContext` exported both context and provider from a single file, triggering `react-refresh/only-export-components` lint error
- **Remediation**: Split into two files:
  - `src/contexts/LanguageContext.tsx` — Context creation + `useLanguage` hook (with eslint-disable comment for Fast Refresh)
  - `src/contexts/LanguageProvider.tsx` — Provider component (standalone export, Fast Refresh compliant)
- **Result**: Live-reloading works correctly without module boundary violations

#### Resolved: Infinite Render Loop Guard (useDirection Stabilization)
- **Problem**: `MutationObserver` watching `document.documentElement.dir` could trigger `setState` → React re-render → `dir` attribute mutation → observer fires → `setState` again → **catastrophic infinite loop**
- **Remediation**: `useDirection.ts` uses functional state update with identity check:
  ```typescript
  setDir((prev) => (prev !== newDir ? newDir : prev));
  ```
- **Result**: State update only propagates when direction actually changes; observer fires safely on all attribute writes

#### Resolved: Resilience Infrastructure (SectionErrorBoundary)
- **Problem**: Unhandled errors in any section component could crash the entire page (White Screen of Death)
- **Remediation**: Class-based `SectionErrorBoundary` at `src/components/layout/SectionErrorBoundary.tsx`:
  - Catches rendering errors in child section components
  - Displays skeleton fallback with reset capability
  - Integrated into `Layout.tsx` wrapping each section slot
- **Result**: Fault isolation per section — one broken section never collapses the entire page

#### Resolved: GSAP Memory Sanitation (Context Lifecycle Management)
- **Problem**: `gsap.context()` scopes were created but could leak on unmount if not properly reverted
- **Remediation**: `LandingPage.tsx` collects all GSAP context scopes into a unified array:
  ```typescript
  const contexts: gsap.Context[] = [];
  // ... push each ctx ...
  return () => contexts.forEach(ctx => ctx.revert());
  ```
- **Result**: All GSAP animations properly torn down on component unmount — zero memory leaks, zero orphaned DOM mutations

### Phase 2 Structural Changes

#### Routes (React Router v6 — 9 public routes)
| Route | Page Component | Dynamic | SEO Meta |
|-------|---------------|---------|----------|
| `/` | `LandingPage.tsx` | — | ✅ Helmet |
| `/about` | `AboutPage.tsx` | — | ✅ Helmet |
| `/skills` | `SkillsPage.tsx` | — | ✅ Helmet |
| `/skills/:slug` | `SkillsPage.tsx` | ✅ skill detail | ✅ Helmet |
| `/projects` | `ProjectsPage.tsx` | — | ✅ Helmet |
| `/projects/:slug` | `ProjectsPage.tsx` | ✅ project detail | ✅ Helmet |
| `/privacy-policy` | `PrivacyPolicyPage.tsx` | — | ✅ Helmet |
| `/terms` | `TermsPage.tsx` | — | ✅ Helmet |
| `/cookies` | `CookiesPage.tsx` | — | ✅ Helmet |

#### Key Module Changes
- **`src/App.tsx`**: Rewritten to `<BrowserRouter>` + `<Routes>` with `<Route element={<Layout />}>` parent wrapping all 9 child routes via `<Outlet>`
- **`src/components/layout/Layout.tsx`**: `<LanguageProvider>` wrapper, syncs `document.documentElement.dir` and `docEl.lang` on language change, mounts Preloader once (subsequent navigations skip it), renders `<Outlet>`, `<BottomNav>`, `<Footer>`
- **`package.json`**: Added `react-helmet-async` + `@types/react-helmet-async` for SEO meta injection
- **`Home.tsx`**: Legacy page retained (not yet deleted; safe to remove post-Phase 2)

### Verification Gates (Phase 2)
| Check | Status | Details |
|-------|--------|---------|
| `npm run type-check` | ✅ Exit 0 | Zero TypeScript errors across all 9 pages + layouts + contexts |
| `npm run lint` | ✅ Exit 0 | Zero ESLint errors (react-refresh resolved via separate Provider file) |
| `npm run build` | ✅ Exit 0 | 510.22 kB JS, 88.72 kB CSS (gzip: 164 kB JS, 14.76 kB CSS) |

---

## Phase 2 Completion Checklist
- [x] LanguageContext + LanguageProvider split (React Refresh compliance)
- [x] useDirection hook with infinite render loop guard
- [x] SectionErrorBoundary class component (fault isolation)
- [x] Layout wrapper with `<Outlet>`, dir/lang sync, Preloader
- [x] React Router v6 — 9 route entries (6 static + 2 dynamic :slug + catch-all)
- [x] LandingPage — GSAP context array teardown (`contexts.forEach(ctx => ctx.revert())`)
- [x] AboutPage, SkillsPage (index + :slug), ProjectsPage (index + :slug)
- [x] PrivacyPolicyPage, TermsPage, CookiesPage (SEO meta via Helmet)
- [x] Type-check ✅, lint ✅, build ✅ (all Exit 0)
- [x] Branch pushed to `origin/phase-2-app-shell-routing`

---

## Phase A — Phase 2 Data Integrity Fixes (100% COMPLETED — 2026-06-28)

### Context
Phase 2 branch was based on an older `main` tip, missing 13 Phase 1 commits. Data integrity regressions from Phase 1 fixes were silently reintroduced. Phase A = surgical data-layer repairs only (zero UI changes, zero feature additions, zero refactoring).

### Regressions Identified & Fixed

| File | Regression | Fix Applied | Commit |
|------|------------|-------------|--------|
| `src/data/contact.json` | Missing 4 state fields: `submittingTitle`, `submittingMessage`, `errorTitle`, `errorMessage` | Added all 4 fields with honest bilingual copy | `688d8fe` |
| `src/data/contact.json` | `successTitle` / `successMessage` misleading ("sent successfully") | Changed to honest copy: "Logged locally, not emailed" / "Your message has been logged locally in the browser only — it is not emailed yet." | `688d8fe` |
| `src/data/contact.json` | Phone `href` masked (`tel:+201****9776`) | Unmasked to real value (`tel:+201118839776`) | `688d8fe` |
| `src/data/site.json` | Missing `quickLinksLabel`, `socialLabel` (Footer.tsx required them) | Added both with bilingual labels | `6568a22` |
| `src/types/content.ts` | ContactSchema missing 4 new fields | Added `submittingTitle`, `submittingMessage`, `errorTitle`, `errorMessage` (all **required** LocalizedString, no `?`) | `bbebc2f` |
| `src/types/content.ts` | SiteSchema missing `quickLinksLabel`, `socialLabel` | Added both as required LocalizedString fields | `bbebc2f` |

### Commits (Atomic, Strict Order)
1. `688d8fe` — `fix(data): restore contact state fields, honest success copy, unmask phone href`
2. `6568a22` — `fix(data): add quickLinksLabel and socialLabel to site.json`
3. `bbebc2f` — `fix(schema): align ContactSchema and SiteSchema with data`

### Verification Gates (All Passed)
| Check | Status | Details |
|-------|--------|---------|
| `npm run type-check` | ✅ Exit 0 | Zero TypeScript errors |
| `npm run lint` | ✅ Exit 0 | Zero ESLint errors |
| `npm run build` | ✅ Exit 0 | Production build successful (510 kB JS, 88 kB CSS) |

### Scope Boundaries Enforced
- ✅ **Data only** — JSON + Zod schemas only
- ✅ **Zero UI changes** — no component modifications
- ✅ **Zero feature additions** — no new functionality
- ✅ **Zero refactoring** — no code restructuring outside schema alignment
- ✅ **Schema-first** — JSON edits before Schema edits, validated by `npm run type-check` after each

### Phase A Hardening Audit (2026-06-28)
Full re-audit of all Phase A files against production-grade spec. Findings:

**Code files (contact.json, site.json, content.ts)**: ✅ ZERO DEVIATIONS
- `successTitle` = "Message Logged" (NOT "Sent") ✅
- `successMessage` = honest ("logged locally, not emailed") ✅
- All 4 state fields present and populated ✅
- Phone href = real number `tel:+201118839776` (no masking) ✅
- `quickLinksLabel` / `socialLabel` present in site.json ✅
- ContactSchema: 4 fields are **REQUIRED** (no `?`, no `.optional()`) ✅
- SiteSchema: 2 fields are **REQUIRED** (no `?`, no `.optional()`) ✅

**Documentation (PROJECT_MAP.md)**: 2 deviations found & corrected:
1. Commit SHAs were placeholders → corrected to actual (`688d8fe`, `6568a22`, `bbebc2f`)
2. ContactSchema fields described as optional (`?`) → corrected to **required** (matching actual code)

---

## Dependencies
```json
{
  "three": "REMOVED ✅",
  "@types/three": "REMOVED ✅",
  "react-helmet-async": "ADDED ✅"
}
```

---

## Commands Reference
```bash
# Type-check
npm run type-check

# Build
npm run build

# Lint
npm run lint

# Dev server
npm run dev

# Git workflow (per repo rules)
git add <file>
git commit -m "scope(message): description"
git push origin phase-2-app-shell-routing
```

---

## Notes for Future Phases
- Phase 3 (Global UX Layer) is the next scope: advanced animations, scroll-linked interactions, micro-interactions, mobile-first polish, and accessibility audit per the PLAN.md roadmap
- `Home.tsx` is legacy — safe to delete when ready
- `projects.json` items array is empty — content seeds needed for Phase 3 portfolio features
- All text content is externalized to `src/data/*.json` — content edits = JSON edits only (no code changes)
- Icon system centralized in `iconMap` — add new icons to `data.ts` + JSON `icon` field
- Bilingual support: all strings are `{ ar: "...", en: "..." }` — locale switching managed by LanguageContext
- Build chunk is 510 kB JS — consider dynamic `import()` code-splitting before production deploy