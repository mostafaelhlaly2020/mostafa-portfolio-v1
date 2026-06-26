# PROJECT_MAP.md
## Mostafa Portfolio v1 — Crystal Glass CRM
**Project Root**: `E:/web site + n8n/بورتفليو ويب/mostafa-portfolio-v1`
**Branch**: `phase-1-data-layer` → `origin/phase-1-data-layer`
**PR**: #2 (open)
**Last Updated**: 2026-06-23
**Status**: Phase 1 Data Layer Migration — 99% complete (1 type-check error remaining)

---

## Directory Structure (Post-Phase 1)
```
mostafa-portfolio-v1/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   ├── components/             # Shared UI components
│   ├── data/                   # ← NEW: JSON data layer (10 files)
│   │   ├── site.json
│   │   ├── hero.json
│   │   ├── about.json
│   │   ├── skills.json
│   │   ├── experience.json
│   │   ├── certifications.json
│   │   ├── testimonials.json
│   │   ├── contact.json
│   │   ├── projects.json
│   │   └── seo.json
│   ├── lib/
│   │   └── data.ts             # ← NEW: Zod validation + iconMap + loader
│   ├── sections/               # Section components (all migrated)
│   │   ├── Hero.tsx            # ✅ reads hero.json
│   │   ├── About.tsx           # ✅ reads about.json
│   │   ├── Skills.tsx          # ✅ reads skills.json + iconMap
│   │   ├── Experience.tsx      # ✅ reads experience.json
│   │   ├── Certifications.tsx  # ✅ reads certifications.json + iconMap
│   │   ├── Testimonials.tsx    # ✅ reads testimonials.json
│   │   ├── Contact.tsx         # ⚠️ reads contact.json (1 TS error)
│   │   ├── Footer.tsx          # ✅ reads site.json
│   │   ├── BottomNav.tsx       # ✅ reads site.json
│   │   ├── Preloader.tsx       # ✅ reads site.json
│   │   └── Home.tsx            # ← pending deletion
│   ├── types/
│   │   └── content.ts          # ← NEW: 11 Zod schemas (237 lines)
│   └── styles/
├── package.json                # ✅ added "type-check": "tsc -b"
├── tsconfig.json
└── PROJECT_MAP.md              # ← THIS FILE
```

---

## Phase 0 — Foundation (Completed & Committed)

### Commit: `refactor(foundation): add JSON data layer, Zod schemas, data loader`
**Files Created (13):**
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
| `src/data/seo.json` | 28 | Meta tags, OG, Twitter |
| `src/types/content.ts` | 237 | 11 Zod schemas + inferred types + PortfolioDataSchema aggregate |
| `src/lib/data.ts` | 94 | `loadData()`, `iconMap` (16 lucide-react components), export validated data |
| `package.json` | +1 line | Added `"type-check": "tsc -b"` script |

**Verification**: `npm run type-check` ✅, `npm run build` ✅, `npm run lint` ✅ (0 errors)

---

## Phase 1 — Section Migration (Completed & Committed)

### Migration Pattern (Applied to All Sections)
1. Replace hardcoded text with imports from `@/lib/data`
2. Map JSON fields to JSX using `.ar` for Arabic (primary locale)
3. For icon fields: use `iconMap[item.icon]` instead of direct imports
4. For arrays: `.map()` over JSON items with keyed renders
5. Keep all animations, styling, RTL/LTR logic unchanged

### Commits (Pushed to origin)

| Commit | Section | JSON Source | Key Changes |
|--------|---------|-------------|-------------|
| `refactor(hero): migrate hardcoded text to JSON data layer` | Hero.tsx | `hero.json` | Status, name, title, CTA, gradient from data |
| `refactor(about): migrate hardcoded text to JSON data layer` | About.tsx | `about.json` | Label, heading, highlight, paragraphs, imageAlt |
| `refactor(skills): migrate hardcoded text and icon imports to JSON data layer` | Skills.tsx | `skills.json` | Items array + `iconMap[skill.icon]` for dynamic lucide icons |
| *(batched in working tree, not yet committed)* | Experience.tsx | `experience.json` | Items array with bilingual date/title/responsibilities; fixed `exp.date.ar` |
| *(batched in working tree, not yet committed)* | Certifications.tsx | `certifications.json` | Items array + `iconMap`; fixed `cert.platform.ar` + `cert.description.ar` |
| *(batched in working tree, not yet committed)* | Testimonials.tsx | `testimonials.json` | Items array + companies; computes initials from `name.ar` |
| *(batched in working tree, not yet committed)* | Contact.tsx | `contact.json` | FormFields array + methods array; uses schema fields (label, heading, highlight, subtitle, infoLabel, successTitle, successMessage, submitButton) |
| *(batched in working tree, not yet committed)* | Footer.tsx | `site.json` | name, tagline, quickLinks[], socialLinks[], madeWith |
| *(batched in working tree, not yet committed)* | BottomNav.tsx | `site.json` | navItems[] for section navigation |
| *(batched in working tree, not yet committed)* | Preloader.tsx | `site.json` | name.ar display |

**Note**: Experience, Certifications, Testimonials, Contact, Footer, BottomNav, Preloader patches are applied in working tree but not yet staged/committed. They all compile except one type error in Contact.tsx.

---

## Current State (As of 2026-06-23)

### Git Status
```
branch: phase-1-data-layer (pushed to origin through Skills commit)
PR: #2 open with full description (branch, scope, verification, known issues)
uncommitted changes: Experience.tsx, Certifications.tsx, Testimonials.tsx, Contact.tsx, Footer.tsx, BottomNav.tsx, Preloader.tsx
untracked: PROJECT.md (this file (now created)
```

### Verification Results
| Check | Status | Details |
|-------|--------|---------|
| `npm run type-check` | ⚠️ 1 error | `Contact.tsx:291` — `item.value` is `string \| LocalizedString` |
| `npm run build` | ✅ pass | Next.js production build succeeds |
| `npm run lint` | ✅ pass | ESLint 0 errors |

### Remaining Type Error
**File**: `src/sections/Contact.tsx:291`
**Error**: `Type 'string | { ar: string; en: string; }' is not assignable to type 'ReactNode'`
**Fix**: Replace `{item.value}` with:
```tsx
{typeof item.value === 'string' ? item.value : item.value.ar}
```
(Contact.json has `value` as string for phone/email/website, but LocalizedString for location)

---

## Phase 1 Completion Checklist
- [x] Foundation: JSON data files (10)
- [x] Foundation: Zod schemas (11)
- [x] Foundation: Data loader + iconMap
- [x] package.json type-check script
- [x] Hero.tsx migration
- [x] About.tsx migration
- [x] Skills.tsx migration (+ iconMap)
- [x] Experience.tsx migration (patched)
- [x] Certifications.tsx migration (+ iconMap, patched)
- [x] Testimonials.tsx migration (patched)
- [x] Contact.tsx migration (patched, 1 TS error)
- [x] Footer.tsx migration
- [x] BottomNav.tsx migration
- [x] Preloader.tsx migration
- [ ] Fix Contact.tsx type error
- [ ] Stage & commit remaining 7 files
- [ ] Final `npm run type-check && npm run build && npm run lint`
- [ ] Update PR #2 description with final verification
- [ ] Delete `Home.tsx` (unused)
- [ ] Create final report

---

## Commands Reference
```bash
# Type-check
npm run type-check

# Build
npm run build

# Lint
npm run lint

# Git workflow (per repo rules)
git add <file>
git commit -m "refactor(<section>): migrate hardcoded text to JSON data layer"
git push origin phase-1-data-layer
# PR #2 auto-updates
```

---

## Notes for Future Phases
- All text content is now externalized — content edits = JSON edits only
- Icon system centralized in `iconMap` — add new icons to `data.ts` + JSON `icon` field
- Bilingual support: all strings are `{ ar: "...", en: "..." }` — use `.ar` for primary
- `Home.tsx` is legacy — safe to delete after Phase 1 merge
- `projects.json` items array empty — ready for Phase 2 portfolio content
- SEO data in `seo.json` — ready for `<Head>` injection in layout