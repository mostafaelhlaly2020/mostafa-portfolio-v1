# PROJECT_MAP.md
## Mostafa El-Sayed Portfolio v1
**Project Root**: `E:/web site + n8n/portfolio web/mostafa-portfolio-v1/portfolio-v1`
**Stack**: Vite + React 19 + TypeScript + Tailwind CSS + React Router v6
**Branch**: `main`
**Remote**: `origin/main`
**Last Updated**: 2026-07-02
**Status**: ✅ Phase 1 — Merged to main · ✅ Phase 2 — Merged to main (PR #3) · ✅ Phase A — Data Integrity Locked · ✅ Phase B — UI + Type Safety + SEO Integrity · ✅ Phase C-C0 — Cinematic Foundation (Merged) · ✅ Phase C1-1 — Hero Section Animation Integration (PR #11 — Merged to main)

---

## Project History

| Date | Audit | Status |
|------|-------|--------|
| 2026-06-23 | Passed | Phase 2 App Shell & Routing stable. Core components decoupled. Language Context safely isolated in separate Provider/Context modules. GSAP contexts sanitized. |
| 2026-06-28 | Passed | Phase A Data Integrity Fixes complete. All Phase 2 regressions from Phase 1 resolved. |
| 2026-06-28 | Merged | Phase 2 App Shell & Routing merged to `main` (PR #3, commit `d571a31`). Post-merge validation: tsc ✅, eslint ✅, build ✅. Branch conflicts resolved (PROJECT_MAP.md, contact.json). |

---

## Directory Structure (Post-Phase C-C0)
```
mostafa-portfolio-v1/
├── src/
│   ├── app/                      # Legacy (Next.js 14 App Router — unused, retained for reference)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx              # Global layout wrapper (<Outlet> + Preloader + BottomNav + Footer + dir/lang sync)
│   │   │   └── SectionErrorBoundary.tsx # Per-section fault isolation with skeleton fallback
│   │   └── animations/                 # ← NEW (Phase C-C0): 8 isolated animation wrapper components
│   │       ├── KineticMarquee.tsx      # Infinite horizontal scroll marquee (GSAP)
│   │       ├── MeshGradient.tsx        # Animated gradient mesh background (CSS keyframes)
│   │       ├── SpotlightBorder.tsx     # Interactive spotlight cursor border (CSS custom props)
│   │       ├── StickyCards.tsx         # Scroll-triggered card reveal (GSAP ScrollTrigger)
│   │       ├── StickyStack.tsx         # Scroll-driven stack/scale/fade (GSAP ScrollTrigger)
│   │       ├── TextScramble.tsx        # Text scramble/decode animation (GSAP ticker)
│   │       ├── Typewriter.tsx          # Character-by-character text reveal (GSAP proxy)
│   │       └── ZoomParallax.tsx        # Parallax zoom on scroll (GSAP ScrollTrigger)
│   ├── contexts/
│   │   ├── LanguageContext.tsx          # Context + useLanguage hook (decoupled for React Refresh)
│   │   └── LanguageProvider.tsx         # Provider component (separate file — Fast Refresh compliant)
│   ├── hooks/
│   │   ├── useDirection.ts             # RTL/LTR MutationObserver with prev !== newDir loop guard
│   │   ├── use-mobile.ts              # Pre-existing mobile detection
│   │   ├── useScrollProgress.ts        # ← NEW (Phase C-C0): useSyncExternalStore scroll progress
│   │   ├── useInView.ts                # ← NEW (Phase C-C0): IntersectionObserver viewport detection
│   │   ├── useMediaQuery.ts            # ← NEW (Phase C-C0): useSyncExternalStore media query
│   │   └── useReducedMotion.ts          # ← NEW (Phase C-C0): delegates to useMediaQuery
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
- [x] **Merged to `main`** via PR #3 (commit `d571a31`) after local merge-conflict resolution

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

### Phase A — Lock Section

| Property | Value |
|----------|-------|
| **Freeze Date** | 2026-06-28 |
| **Merge SHA** | `d571a31` (PR #3) |
| **Scope** | Data-layer integrity contracts only |
| **Boundaries Enforced** | Zero UI changes, zero feature additions, zero refactoring — data only |
| **Change Policy** | No further edits to `src/data/*.json` or `src/types/content.ts` without an approved Phase A+ amendment. Changes must pass review against the 7 audit criteria above. |
| **Validation Lock** | TypeScript (`tsc --noEmit`), ESLint, and Vite build must all pass Exit 0 on any amendment. |

---

## Phase B — UI + Type Safety + SEO Integrity (100% COMPLETED — 2026-06-29)

### Context
Phase A locked data-layer integrity. Phase B ensures the UI layer correctly consumes that data: fixing semantic operator misuse, removing unsafe type casts, and correcting SEO meta field misuse. Zero new features, zero animation/style/layout changes.

### Fixes Applied

| File | Issue | Fix | Commit |
|------|-------|-----|--------|
| `src/types/content.ts` | `ProjectsSchema.items` typed as `z.array(z.unknown())` | Added `ProjectItemSchema` (3 required + 3 optional fields), updated `ProjectsSchema.items` | `ac6f505` |
| `src/pages/ProjectsPage.tsx` | Unsafe `as unknown as ProjectItem[]` cast | Removed cast, imported `ProjectItem` type from `content.ts` | `ac6f505` |
| `src/sections/Skills.tsx` | Icon fallback uses `\|\|` (semantic improvement — functionally equivalent for LucideIcon type) | Changed to `??` (nullish coalescing — semantically correct for map lookup) | `7c0a980` |
| `src/sections/Certifications.tsx` | Icon fallback uses `\|\|` (semantic improvement) | Changed to `??` | `7c0a980` |
| `src/sections/Contact.tsx` | Icon fallback uses `\|\|` (semantic improvement) | Changed to `??` | `7c0a980` |
| `src/pages/PrivacyPolicyPage.tsx` | `<title>` uses `seo.metaDescription.ar` (semantic misuse) | Changed to `site.name.ar` (brand name) | `01656fc` |
| `src/pages/TermsPage.tsx` | Same SEO title misuse | Same fix | `01656fc` |
| `src/pages/CookiesPage.tsx` | Same SEO title misuse | Same fix | `01656fc` |

### ProjectItemSchema Definition
```typescript
const ProjectItemSchema = z.object({
  id: z.string(),              // Required — route param :slug
  title: LocalizedString,      // Required — displayed in UI
  description: LocalizedString, // Required — displayed in UI
  image: z.string().optional(), // Optional — Phase C portfolio thumbnails
  tags: z.array(z.string()).optional(), // Optional — Phase C filtering
  url: z.string().url().optional(),     // Optional — external project links
})
```

### Commits (Atomic, Strict Order)
1. `ac6f505` — `fix(types): add ProjectItemSchema and remove unsafe cast in ProjectsPage`
2. `7c0a980` — `fix(ui): use nullish coalescing for icon fallback lookups`
3. `01656fc` — `fix(seo): use site.name instead of metaDescription in page titles`

### Verification Gates (All Passed)
| Check | Status | Details |
|-------|--------|---------|
| `npx tsc --noEmit` | ✅ Exit 0 | Zero TypeScript errors |
| `npx eslint .` | ✅ Exit 0 | Zero ESLint errors |
| `npx vite build` | ✅ Exit 0 | Production build successful (513.50 kB JS, 23.07 kB CSS) |

### Scope Boundaries Enforced
- ✅ **1 Enhancement** — `ProjectItemSchema` added with future-proof optional fields
- ✅ **1 Refactor** — Unsafe `as unknown as` cast removed, proper typed access
- ✅ **3 Semantic Improvements** — Icon fallbacks `||` → `??` (functionally equivalent for `LucideIcon` type, but `??` is the correct operator for nullish map lookup)
- ✅ **3 Fixes** — SEO titles corrected from `metaDescription` to `site.name`
- ✅ **Zero new features**
- ✅ **Zero UI/style/layout/animation changes**
- ✅ **Cinematic Bridge constraints preserved** — no DOM structure, class name, or inline style modifications

### Phase B → Phase C Bridge (Cinematic Readiness Layer)
Phase B ensures the UI is structurally ready for Phase C cinematic upgrades (GSAP animations, scroll reveals) without breaking DOM or data flow:
1. **No DOM structure changes** — Phase B did NOT add/remove/reorder HTML elements
2. **Stable component hierarchy** — No new wrappers or components introduced
3. **Clean data flow** — All UI text resolves from data layer, zero hardcoded fallback strings
4. **Preserved class names** — No Tailwind class renames or modifications
5. **No inline style injection** — No new `style={{}}` props added

### Deferred to Phase C
- Add `<meta property="og:title">` and `<meta property="og:description">` to legal pages
- i18n language switching for hardcoded `.ar` references in sections

---

## Phase C — Cinematic Foundation (IN PROGRESS — PR #9 Awaiting User Approval)

### Context
Phase A locked data integrity. Phase B ensured UI + type safety + SEO integrity. Phase C introduces the cinematic foundation: **4 custom hooks** and **8 animation wrapper components** that enable scroll-driven and motion-based UI effects across the site. All wrappers are **isolated** (no usage outside `src/components/animations/`) — they will be integrated into sections in later Phase C sub-PRs.

### Branch
`phase-c-cinematic-foundation` → PR #9

### PR URL
https://github.com/mostafaelhlaly2020/mostafa-portfolio-v1/pull/9

---

### Phase C-C0 — Hooks Layer (4 Hooks)

| Hook | File | Purpose | Implementation |
|------|------|---------|----------------|
| `useScrollProgress` | `src/hooks/useScrollProgress.ts` | Tracks page scroll progress (0–1) | `useSyncExternalStore` with passive `scroll` + `resize` listeners, `getServerSnapshot = 0` |
| `useInView` | `src/hooks/useInView.ts` | Detects when element enters viewport | `IntersectionObserver` with `threshold`, `rootMargin`, `triggerOnce` options. Returns `{ ref, inView }` |
| `useMediaQuery` | `src/hooks/useMediaQuery.ts` | Reactive media query matching | `useSyncExternalStore` with `useCallback`-memoized `subscribe`/`getSnapshot` keyed on `query` |
| `useReducedMotion` | `src/hooks/useReducedMotion.ts` | Respects `prefers-reduced-motion` | Delegates to `useMediaQuery('(prefers-reduced-motion: reduce)')` — DRY |

#### Key Design Decisions (Hooks)
1. **`useSyncExternalStore` pattern** — Avoids `set-state-in-effect` anti-pattern flagged by ESLint `react-hooks/set-state-in-effect` rule. All external subscriptions (scroll, resize, matchMedia) use `useSyncExternalStore` with `getServerSnapshot`.
2. **`useCallback` memoization** — `useMediaQuery` wraps `subscribe` and `getSnapshot` in `useCallback` keyed on `query` to prevent unnecessary resubscription on every render (CodeRabbit CR-9).
3. **DRY delegation** — `useReducedMotion` delegates entirely to `useMediaQuery` instead of duplicating `matchMedia` logic (CodeRabbit CR-10).
4. **SSR-safe** — All hooks provide `getServerSnapshot` returning safe defaults (`0`, `false`).

---

### Phase C-C0 — Animation Wrappers Layer (8 Wrappers)

| Component | File | Effect | GSAP? | Reduced Motion |
|-----------|------|--------|-------|----------------|
| `KineticMarquee` | `src/components/animations/KineticMarquee.tsx` | Infinite horizontal scroll marquee | ✅ GSAP `fromTo` + `repeat: -1` | Static layout, `aria-label` preserved |
| `MeshGradient` | `src/components/animations/MeshGradient.tsx` | Animated gradient mesh background | ❌ CSS `@keyframes` only | Static gradient (no animation) |
| `SpotlightBorder` | `src/components/animations/SpotlightBorder.tsx` | Interactive spotlight cursor border | ❌ CSS custom properties | No spotlight, standard layout |
| `StickyCards` | `src/components/animations/StickyCards.tsx` | Scroll-triggered card reveal | ✅ GSAP ScrollTrigger | Normal flow layout |
| `StickyStack` | `src/components/animations/StickyStack.tsx` | Scroll-driven stack/scale/fade | ✅ GSAP ScrollTrigger | Normal flow layout |
| `TextScramble` | `src/components/animations/TextScramble.tsx` | Text scramble/decode animation | ✅ GSAP `ticker` | Shows text instantly |
| `Typewriter` | `src/components/animations/Typewriter.tsx` | Character-by-character text reveal | ✅ GSAP `gsap.to` proxy | Shows text instantly |
| `ZoomParallax` | `src/components/animations/ZoomParallax.tsx` | Parallax zoom on scroll | ✅ GSAP ScrollTrigger | No zoom effect |

#### Key Design Decisions (Animation Wrappers)
1. **Every wrapper checks `useReducedMotion`** — When `prefers-reduced-motion: reduce` is active, animations are disabled and content displays in a static/accessible form.
2. **GSAP context lifecycle** — All GSAP-using wrappers create `gsap.context()` and call `ctx.revert()` on cleanup. Prevents memory leaks and orphaned DOM mutations.
3. **`useLayoutEffect` for GSAP** — StickyCards, StickyStack, and ZoomParallax use `useLayoutEffect` instead of `useEffect` to prevent flash of unanimated content (CodeRabbit CR-8).
4. **CSS custom properties for high-frequency updates** — SpotlightBorder sets `--spotlight-x`/`--spotlight-y` directly on DOM node instead of React state, avoiding re-renders on every `mousemove` (CodeRabbit CR-11).
5. **Global CSS keyframes** — MeshGradient's `@keyframes meshGradient` defined once in `src/index.css` instead of per-instance `<style>` injection (CodeRabbit CR-3, CR-6 duplicate keyframes).
6. **Full isolation** — No animation wrapper is imported or used anywhere outside `src/components/animations/`. They are pure building blocks for future integration.

---

### CodeRabbit Review (GitHub PR #9) — Full Audit Trail

CodeRabbit posted **11 review comments** on PR #9. All were addressed:

| # | Severity | File | Issue | Fix Applied |
|---|----------|------|-------|-------------|
| CR-1 | 🔴 Critical | `KineticMarquee.tsx` | DOM clones accumulate — `appendChild` clones never removed on cleanup | Capture `originalChildren` before cloning; remove clones in cleanup return via `.slice(originalChildren.length)` |
| CR-2 | 🟠 Major | `KineticMarquee.tsx` | `aria-hidden="true"` hides original content from screen readers | Remove `aria-hidden` from container; add `aria-hidden` only on clone nodes; add `aria-label` prop |
| CR-3 | 🟡 Minor | `MeshGradient.tsx` | No validation on `colors` length — `< 2` produces invalid gradient | Validate `colors.length >= 2` with `DEFAULT_COLORS` fallback |
| CR-4 | 🟠 Major | `TextScramble.tsx` | `trigger="inView"` declared in props but never implemented — renders blank | Implement using `useInView` hook with combined ref callback |
| CR-5 | 🟡 Minor | `Typewriter.tsx` | `visibleCount` not reset when `prefersReduced` flips true mid-animation | Derive `visibleCount` from `prefersReduced` instead of setState in effect |
| CR-6 | 🔵 Trivial | `ZoomParallax.tsx` | Scale can visually overflow container | Add `overflow: hidden` on wrapper div |
| CR-7 | 🔵 Trivial | `StickyCards.tsx` | JSDoc promises "sticking"/overlap but implementation only fades/slides | Fix JSDoc: "Sticky positioning must be provided by consumer CSS" |
| CR-8 | 🔵 Trivial | `StickyCards.tsx`, `StickyStack.tsx`, `ZoomParallax.tsx` | `useEffect` runs after paint → flash of unanimated content | Changed to `useLayoutEffect` |
| CR-9 | 🔵 Trivial | `useMediaQuery.ts` | Inline `subscribe`/`getSnapshot` cause resubscription on every render | Wrap in `useCallback` keyed on `query` |
| CR-10 | 🔵 Trivial | `useReducedMotion.ts` | Duplicates `useMediaQuery` matchMedia logic | Refactor to `return useMediaQuery('(prefers-reduced-motion: reduce)')` |
| CR-11 | 🔵 Trivial | `SpotlightBorder.tsx` | Per-mousemove `setState` causes re-render on every pointer move | Replace `useState` position with CSS custom properties set directly on DOM |

### Additional Blocker Fixes (Per Mission Spec)

| Blocker | Fix |
|---------|-----|
| `role="marquee"` — invalid ARIA role | Removed; replaced with `aria-label` prop for accessible labeling |
| Wrapper usage in pages/sections/layout/demo | Verified: zero imports outside `src/components/animations/` (full isolation) |

---

### Directory Structure Additions (Phase C)

```
src/
├── hooks/
│   ├── useDirection.ts                # Pre-existing (Phase 2)
│   ├── use-mobile.ts                  # Pre-existing
│   ├── useScrollProgress.ts           # ← NEW: useSyncExternalStore scroll progress
│   ├── useInView.ts                   # ← NEW: IntersectionObserver viewport detection
│   ├── useMediaQuery.ts               # ← NEW: useSyncExternalStore media query
│   └── useReducedMotion.ts            # ← NEW: delegates to useMediaQuery
├── components/
│   └── animations/                    # ← NEW DIRECTORY: 8 isolated animation wrappers
│       ├── KineticMarquee.tsx         # Infinite scroll marquee (GSAP)
│       ├── MeshGradient.tsx           # Animated gradient mesh (CSS keyframes)
│       ├── SpotlightBorder.tsx        # Interactive spotlight cursor (CSS custom props)
│       ├── StickyCards.tsx            # Scroll-triggered card reveal (GSAP ScrollTrigger)
│       ├── StickyStack.tsx            # Scroll-driven stack/scale/fade (GSAP ScrollTrigger)
│       ├── TextScramble.tsx           # Text scramble/decode (GSAP ticker + useInView)
│       ├── Typewriter.tsx             # Character-by-character reveal (GSAP proxy)
│       └── ZoomParallax.tsx           # Parallax zoom on scroll (GSAP ScrollTrigger)
└── index.css                          # ← MODIFIED: added @keyframes meshGradient (global)
```

---

### Commits (Atomic, Strict Order)

1. `b50bdb3` — `feat(hooks): add useScrollProgress, useInView, useMediaQuery, useReducedMotion`
2. `9484ca0` — `refactor(hooks): use useSyncExternalStore for useMediaQuery and useReducedMotion to avoid set-state-in-effect`
3. `47adf51` — `feat(animations): add 8 cinematic animation wrappers`
4. `6f1ab76` — `fix(C0): address code review findings` (initial manual review fixes: useScrollProgress refactor, TextScramble cleanup, KineticMarquee accessibility, MeshGradient client directive)
5. `9d45050` — `fix(C0): address all CodeRabbit review findings` (CR-1 through CR-11 + blocker fixes)
6. `ac2ebee` — `fix(C0): fix ESLint set-state-in-effect in Typewriter + exclude test dirs + fix broken-image in test`

### tsconfig.app.json Change
```json
{
  "include": ["src"],
  "exclude": ["src/**/__tests__/**", "src/test/**"]  // ← ADDED: exclude test files from build
}
```

---

### Verification Gates (All Passed)

| Check | Status | Details |
|-------|--------|---------|
| `npx tsc --noEmit` | ✅ Exit 0 | Zero TypeScript errors |
| `npx eslint .` | ✅ Exit 0 | Zero ESLint errors |
| `npm run build` | ✅ Exit 0 | Production build successful (513.50 kB JS, 23.94 kB CSS) |
| Browser test | ✅ | `http://localhost:3000` renders correctly, zero console errors |

### Scope Boundaries Enforced
- ✅ **4 Hooks** — `useScrollProgress`, `useInView`, `useMediaQuery`, `useReducedMotion`
- ✅ **8 Animation Wrappers** — All isolated, no usage outside `src/components/animations/`
- ✅ **1 CSS addition** — `@keyframes meshGradient` in `src/index.css`
- ✅ **1 tsconfig change** — Exclude test dirs from build compilation
- ✅ **Zero pages modified** — No page component imports any animation wrapper
- ✅ **Zero sections modified** — No section component imports any animation wrapper
- ✅ **Zero layout changes** — Layout untouched
- ✅ **CodeRabbit reviewed** — All 11 comments addressed
- ✅ **No merge** — PR #9 awaiting user approval

### Phase C-C0 → Next Steps (BLOCKED until PR #9 approved)
- **C1**: Integrate animation wrappers into Landing Page sections (Hero, About, Skills, etc.)
- **C2**: Integrate animation wrappers into remaining pages
- **C3**: Performance optimization (code-splitting GSAP, lazy loading)
- **C4**: Accessibility audit (reduced-motion, keyboard navigation, ARIA)

---

## Dependencies
```json
{
  "three": "REMOVED ✅",
  "@types/three": "REMOVED ✅",
  "react-helmet-async": "ADDED ✅",
  "gsap": "^3.15.0 — USED ✅ (Phase C-C0: KineticMarquee, StickyCards, StickyStack, TextScramble, Typewriter, ZoomParallax)"
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

---

## Phase C-C0 — Fix Log (POST-AUDIT — 2026-07-02)

### Critical Fixes Applied

| # | File | Bug | Fix | CodeRabbit Issue |
|---|------|-----|-----|-------------------|
| F1 | `useScrollProgress.ts` | `subscribe`/`getSnapshot` recreated every render → unnecessary resubscription | Move both to module scope (outside hook body) | Related to CR-9 (useCallback), taken further for full stability |
| F2 | `index.css` + `MeshGradient.tsx` | `@keyframes meshGradient` violates lint rule (camelCase) | Rename to `mesh-gradient`, update all references | N/A — lint compliance |
| F3A | `TextScramble.tsx` | GSAP ticker leak on unmount — orphan callbacks fire after teardown | Cleanup via `tickerRef` in dedicated unmount effect | CR-F (ticker leak) — extended fix |
| F3B | `TextScramble.tsx` | `trigger="inView"` observer doesn't re-attach when trigger changes | `useInView` manages its own lifecycle; ref combining fixed via callback ref | CR-4 (inView not implemented) — lifecycle edge case |
| F3C | `TextScramble.tsx` | `text` prop freeze — animation doesn't re-run when text changes | Reset `hasTriggered` when `prevTextRef.current !== text` | N/A — discovered in audit |
| F4 | `KineticMarquee.tsx` | `children` not in dependency array — content changes don't regenerate clones | Add `children` to useEffect deps | CR-p2 (same pattern as StickyCards) |
| F5 | `StickyCards.tsx` | Animation doesn't update when children change | Add `children` to useLayoutEffect deps | CR-p2 (resolved) |
| F6 | `StickyStack.tsx` | Same as StickyCards | Add `children` to useLayoutEffect deps | CR-p2 (resolved) |

### Test Architecture Improvements

| File | Purpose |
|------|---------|
| `src/test/mocks/gsap.ts` | Centralized GSAP mock factory (`gsapMockFactory`), shared `mockGsapContext`, `mockGsapFromTo`, `mockGsapTo`, `mockTickerAdd`, `mockTickerRemove`, `resetGsapMocks()` |
| `src/test/mocks/useReducedMotion.ts` | Centralized `mockUseReducedMotion`, `setReducedMotion(value)`, `resetReducedMotionMock()` |
| `TextScramble.test.tsx` | Refactored to use centralized mocks; added tests for ticker cleanup, text prop re-run, inView trigger wait |

### Validation Results (Post-Fix)

| Check | Status | Details |
|-------|--------|---------|
| `npx tsc --noEmit` | ✅ Exit 0 | Zero TypeScript errors |
| `npx eslint .` | ✅ Exit 0 | Zero ESLint errors |
| `npm run build` | ✅ Exit 0 | 513.50 kB JS, 23.94 kB CSS |
| CodeRabbit threads | ✅ 0 open | All 11 original + any new resolved |
| Browser test | ✅ | `http://localhost:3000` — zero console errors |

### Guarantees

- ✅ **Isolated animation layer** — no wrapper imported outside `src/components/animations/`
- ✅ **Zero DOM mutation outside wrappers** — all GSAP contexts scoped + reverted
- ✅ **No SSR conflicts** — Vite-safe, `getServerSnapshot` on all hooks
- ✅ **No memory leaks** — ticker cleanup, GSAP context revert, clone removal
- ✅ **No resubscription** — module-scoped `subscribe`/`getSnapshot` in `useScrollProgress`
- ✅ **Animation safety** — `useReducedMotion` checked in every wrapper
- ✅ **Test architecture** — centralized mocks, no duplication

### Remaining Risks

- ⚠️ **Build chunk size** — 513 kB JS (GSAP heavy); dynamic `import()` recommended before production
- ⚠️ **Docstring coverage** — 69.23% per CodeRabbit pre-merge check (threshold: 80%)
- ℹ️ **useScrollProgress module scope** — `getSnapshot` reads `window.scrollY` on every call (cheap but not memoized; acceptable for sync external store pattern)

---

## Phase C1-1 — Hero Section Animation Integration (100% COMPLETED — 2026-07-02)

### Architectural Changes Applied & Verified:

#### Layer 1 — Semantic Outline Restoration & SEO Compliance
- **What**: Wrapped `Typewriter` inside the original `<h1>` heading element with Cairo font-family in `Hero.tsx`.
- **Why**: Keeps the document outline fully semantic, guaranteeing correct outline level indexing for SEO crawlers and screen reader accessibility tools.
- **Verification**: `Hero.test.tsx` asserts that the typewriter component is nested directly inside `<h1>` and the Cairo font style matches the mockup.

#### Layer 2 — Non-blocking Accessible Typing Fallback
- **What**: Added `aria-label={hero.name.ar}` to `<h1>` and wrapped `<Typewriter />` in `span aria-hidden="true"` inside `Hero.tsx`.
- **Why**: Typewriter reveals characters progressively, which confuses screen readers at initial mount and indexers. Providing a static `aria-label` guarantees immediate availability of the full name, while `aria-hidden` hides the progressive visual ticks from assistive tech.
- **Verification**: Unit tests verify presence of both accessibility attributes on their respective DOM nodes.

#### Layer 3 — JSDOM Leak Remediation & Setup Standardization
- **What**: Centralized `cleanup()` in `afterEach` inside `src/test/setup.ts` and removed manual DOM teardowns from `Hero.test.tsx`. Centralized rendering inside `beforeEach`.
- **Why**: Manual `document.body.innerHTML = ''` resets bypass React unmount hook lifecycles, polluting DOM tests. Standardizing JSDOM teardown guarantees clean React fiber tree unmounts.
- **Verification**: `npm run test` executes 13 test files and 107 test cases with 100% success rate.

### Verification Gates (PR #11)
| Check | Status | Details |
|-------|--------|---------|
| `npx tsc --noEmit` | ✅ Exit 0 | Zero TypeScript compiler errors |
| `npx eslint .` | ✅ Exit 0 | Zero ESLint issues |
| `npm run build` | ✅ Exit 0 | Clean production build compiled successfully |
| `npm run test` | ✅ Pass | 107 tests passed (0 failures) |

### Phase C1-1 Lock Section
| Property | Value |
|----------|-------|
| **Freeze Date** | 2026-07-02 |
| **Merge SHA** | `ef720cd2e7236e1d6441c7ecde3509e5afbfc295` (PR #11) |
| **Scope** | Hero section animation integration only (Typewriter + SpotlightBorder) |
| **Boundaries Enforced** | Original white background and Cairo heading layout restored; MeshGradient background override completely removed; zero brand/UI modifications. |
| **LOCK** | **Strict Lock**: No refactoring, styling adjustments, or background overrides allowed in the Hero section in future phases. Only wrapper integrations are permitted. |