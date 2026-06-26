# Portfolio — Mostafa El-Sayed

[![TypeScript](https://img.shields.io/badge/lang-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/framework-React_19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/build-Vite_7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind_CSS_3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/animations-GSAP-88CE02?logo=greensock&logoColor=white)](https://gsap.com/)

A cinematic portfolio website for **Mostafa El-Sayed** — digital marketing expert and real estate consultant.

**Target site:** `https://mostafa-elsayed.site` (planned — not yet deployed)  
**Status:** In development — Phase 0 (Baseline & Tooling)

---

## Current Scope

This repository contains the **Public Portfolio Frontend** — a planned bilingual (Arabic/English), dark-mode, cinematic single-page application. Content is designed to be data-driven (loaded from structured JSON files planned for Phase 1), making the frontend purely a presentation layer. Currently (Phase 0), sections use inline sample data.

The **Admin Panel / CMS** is explicitly **future scope**. It will be built as a separate Next.js application and is not implemented in this repository.

---

## Tech Stack

| Category               | Technology                                                                 |
| ---------------------- | -------------------------------------------------------------------------- |
| **Framework**          | React 19 with TypeScript (strict mode)                                     |
| **Build Tool**         | Vite 7.x                                                                   |
| **Styling**            | Tailwind CSS 3.x (dark mode only), shadcn/ui component library             |
| **Animation**          | GSAP + ScrollTrigger (scroll-driven), Framer Motion (UI state), SplitType  |
| **Routing**            | React Router v7 (client-side)                                              |
| **Validation**         | Zod                                                                         |
| **Code Quality**       | ESLint + Prettier + Husky pre-commit hooks                                 |
| **Quality Gate**       | Impeccable                                                                  |
| **Backend**            | PocketBase (future — contact form + admin UI)                              |
| **Hosting**            | Hostinger Business Plan (planned — not yet configured)                     |
| **DNS**                | Cloudflare (planned — not yet configured)                                  |

---

## Architecture Principles (Target — Phase 1+)

These describe the **planned** architecture that Phase 1+ will implement:

1. **Data-Driven** — Zero hardcoded text in JSX. All content lives in `src/data/*.json`.
2. **Separation of Concerns** — Content, presentation, and animation layers are independent.
3. **Future-Proof Schema** — JSON entities are designed to be replaceable by a database-backed API without component changes.
4. **Error Resilience** — Every section wrapped in an independent error boundary.
5. **RTL / LTR** — Full bilingual support with proper direction handling.
6. **Performance Budget** — Lighthouse scores ≥ 90, bundle size monitored, animations capped at 60 fps.

---

## Phase-Based Roadmap

| Phase | Title                                     | Status       |
| ----- | ----------------------------------------- | ------------ |
| 0     | Baseline, Branch, Tooling, Lint Gate      | 🔧 In Progress  |
| 1     | Data Layer, Types, Content Contracts      | ⬜ Pending   |
| 2     | App Shell, Routing, Layout                | ⬜ Pending   |
| 3     | Global UX Layer                           | ⬜ Pending   |
| 4     | Animation Infrastructure                  | ⬜ Pending   |
| 5     | Landing Page Core Sections                | ⬜ Pending   |
| 6     | Content Sections                          | ⬜ Pending   |
| 7     | Contact UI + PocketBase Integration       | ⬜ Pending   |
| 8     | Inner Pages                               | ⬜ Pending   |
| 9     | SEO + Prerender (react-snap)              | ⬜ Pending   |
| 10    | Security + Performance                    | ⬜ Pending   |
| 11    | Final QA + Deploy                         | ⬜ Pending   |
| 12    | **Admin Panel / CMS (separate Next.js)**  | 📅 Future    |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code (Prettier)
npx prettier --write .
```

## Quality Gates

Run these before every commit:

```bash
# TypeScript check + build
npm run build

# Lint
npm run lint

# Impeccable quality gate
npx impeccable detect src/
```

Pre-commit hooks (Husky) automatically run `npx impeccable detect src/` on `git commit`.

---

## Project Structure (Current — Phase 0)

```
mostafa-portfolio-v1/
├── .husky/                 # Git hooks
├── .impeccable/            # Impeccable quality gate config
├── .agents/                # Hermes agent skills
├── public/                 # Static assets
│   └── fonts/              # Custom fonts (The Year of the Camel)
├── references/
│   └── cinematic-components/  # Cinematic HTML modules (reference only)
├── src/
│   ├── components/ui/      # shadcn/ui atomic components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   ├── pages/              # Route-level components
│   ├── sections/           # Page sections (Hero, About, Skills, etc.)
│   ├── App.tsx             # Root component
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles (Tailwind directives)
│   └── main.tsx            # Vite entry point
├── .env.example            # Environment variable template
├── .env.production         # Production environment template
├── .gitignore
├── .prettierrc             # Prettier configuration
├── PLAN.md                 # Master execution plan (single source of truth)
├── components.json         # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

> **Note:** `src/data/`, `src/components/animations/`, `src/types/`, and `src/styles/` are **planned** for Phase 1+ and do not exist yet.

---

## Future Scope (Not Implemented Here)

- **Admin Panel / CMS** — A separate Next.js application for managing portfolio content (projects, testimonials, skills, etc.), backed by the same PocketBase instance.
- **PocketBase Backend** — Self-hosted REST API for contact form submissions and admin CRUD operations.
- **react-snap** — Pre-rendering for SEO of publicly indexable pages at build time.

---

## License

Private — All rights reserved.
