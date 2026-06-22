# PLAN.md — Master Execution Plan

# Portfolio.mostafa-elsayed.site — Cinematic Redesign v3.0.0

> CRITICAL DIRECTIVE FOR AI AGENTS (Claude Code / Cursor / Codex):
>
> 1. هذا الملف هو Single Source of Truth المطلق. لا تختصر، لا تفترض، لا تتجاوز أي بند.
> 2. المشروع الحالي هو Public Frontend فقط باستخدام React + TypeScript + Vite.
> 3. الـ Admin Panel / CMS هو مرحلة لاحقة منفصلة على Next.js.
> 4. اتبع معمارية Data-Driven بصرامة — كل المحتوى من src/data/ كملفات JSON منفصلة.
> 5. كل أنيميشن GSAP/ScrollTrigger يجب أن يُلفّ داخل gsap.context() ويُنظّف بـ ctx.revert().
> 6. قبل أي commit: شغّل npx impeccable detect src/ ولازم Exit Code = 0.
> 7. كل قسم له Acceptance Criteria — لا يُعتبر منجزاً إلا بعد استيفائها.
> 8. ممنوع أي نص hardcoded داخل JSX النهائي.
> 9. الـ repo الخاص بـ Cinematic Components هو Reference فقط — يُعاد بناؤه في React.
> 10. Framer Motion محصور — UI state animations بس (nav, buttons, page transitions). GSAP لكل حاجة تانية.
> 11. كل صفحة public قابلة للفهرسة يجب أن تكون SEO-rendered at build time عبر react-snap.
> 12. لا يجوز أن تتحكم مكتبتان مختلفتان في نفس خاصية الـ animation على نفس العنصر.

---

## Table of Contents

1. Project Identity & Scope
2. Architecture Decision
3. Tech Stack & Tooling
4. Hosting & Deployment
5. Repositories Integration
6. Brand Tokens & Typography
7. Assets Freeze
8. Core Architecture Rules
9. Data Layer Specification
10. SEO Rendering Strategy
11. Information Architecture & Routes
12. Folder Structure
13. Landing Page Layout
14. Component Specifications
15. Inner Page Specifications
16. Admin Panel Future Scope
17. Animation Ownership Rules
18. Animation Engineering Standards
19. Content Resilience Rules
20. Responsive, Accessibility & SEO
21. Testing Strategy
22. Performance Budget
23. Security Baseline
24. Quality Gates
25. Execution Roadmap (Priority-Ordered Master Playbook)
    - 25.1 Current Baseline From Project Analysis
    - 25.2 Priority Map
    - 25.3 Agent Execution Rules
    - 25.4 Phase 0: Baseline, Branch, Tooling, and Current Lint Gate
    - 25.5 Phase 1: Data Layer, Types, and Content Contracts
    - 25.6 Phase 2: App Shell, Routing, and Layout
    - 25.7 Phase 3: Global UX Layer
    - 25.8 Phase 4: Animation Infrastructure
    - 25.9 Phase 5: Landing Page Core Sections
    - 25.10 Phase 6: Content Sections
    - 25.11 Phase 7: Contact UI + PocketBase Integration
    - 25.12 Phase 8: Inner Pages
    - 25.13 Phase 9: SEO + Prerender
    - 25.14 Phase 10: Security + Performance
    - 25.15 Phase 11: Final QA + Deploy
    - 25.16 Phase 12: Admin Panel / CMS Future Scope
    - 25.17 Original Day-by-Day Roadmap Retained for Traceability
26. Definition of Done
27. Glossary & References
28. Anti-Patterns (الممنوعات)
29. Critical Fixes Summary (الـ 5 ثغرات)
30. Final Notes

---

## 1. Project Identity & Scope

| الحقل            | القيمة                                        |
| :--------------- | :-------------------------------------------- |
| اسم المشروع      | Portfolio.mostafa-elsayed.site                |
| العميل           | مصطفى السيد محمد سيد هاشم                     |
| التخصص           | خبير تسويق رقمي · مستشار عقاري                |
| اللغات           | العربية (أساسية، RTL) · English (ثانوية، LTR) |
| النسخة المستهدفة | v3.0.0 — Cinematic Redesign                   |
| Branch           | redesign-cinematic                            |
| النطاق الحالي    | Public Portfolio Frontend                     |
| النطاق اللاحق    | Admin Panel / CMS منفصل (Next.js)             |
| الموقع الجغرافي  | Egypt — يخدم العالم العربي                    |

### Scope Clarification

- هذا الملف يصف الواجهة العامة الحالية فقط.
- يجمّد متطلبات الـ schema اللازمة لدعم CMS/Admin Panel لاحقاً.
- لا يتم تنفيذ الـ Admin Panel الآن داخل نفس مشروع Vite.
- كل entities قابلة للتحول لاحقاً إلى DB-backed content.

---

## 2. Architecture Decision

### 2.1 Current App

- Frontend: React 19 + TypeScript + Vite 7.x + Tailwind + React Router
- Goal: واجهة سينمائية سريعة، ثنائية اللغة، معتمدة على JSON modules

### 2.2 Future Admin App

- Admin Panel: Next.js app منفصل لاحقاً
- Reason: Next.js مناسب أكثر للإدارة، الـ forms، والـ mutations

### 2.3 Key Principle

- الواجهة الحالية تقرأ المحتوى
- الـ Admin Panel لاحقاً يكتب هذا المحتوى

### 2.4 Migration Principle

- المرحلة الحالية تستخدم src/data/\*.json
- لاحقاً يتم استبدال مصدر القراءة بـ API / DB دون كسر مكونات العرض

---

## 3. Tech Stack & Tooling

### 3.1 Core Stack

| التقنية           | الاستخدام                |
| :---------------- | :----------------------- |
| React 19          | UI Framework             |
| TypeScript        | Language (strict: true)  |
| Vite 7.x          | Build Tool               |
| Tailwind CSS      | Styling (Dark Mode only) |
| React Router v6   | Client-side Routing      |
| Zod               | Runtime Validation       |
| ESLint + Prettier | Code Quality             |
| Husky             | Git Hooks                |

### 3.2 Animation Stack (محصور)

| التقنية              | الاستخدام المسموح                                                                                          | الاستخدام الممنوع                                        |
| :------------------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| GSAP + ScrollTrigger | Pin, Scale, Marquee, Text Scramble, Zoom Parallax, Sticky Stack/Cards                                      | Nav show/hide, Button hover, Page transitions            |
| Framer Motion        | BottomNav show/hide, Button hover states, Page transitions (AnimatePresence), Modal/Toast, CountUp stagger | Scroll-triggered animations, Pin effects, Infinite loops |
| CSS Keyframes        | Preloader, MeshGradient, Hover states, Simple fades                                                        | Complex timelines                                        |
| SplitType            | Text splitting for Typewriter, Text Scramble                                                               | —                                                        |

### 3.3 Backend & Data

- PocketBase — Contact Form + Admin UI
  - Instance: self-hosted على pb.mostafa-elsayed.site
  - Collection: messages
  - Fields: name (text) · phone (text) · email (email) · message (text) · created (autodate)
  - CORS: whitelist portfolio.mostafa-elsayed.site فقط
  - Auth: Public create-only rule (لا API key للـ form)

### 3.4 Form Submission (ليس Server Actions)

```ts
// src/lib/pocketbase.ts — fetch() مباشر
const PB_URL = import.meta.env.VITE_PB_URL;

export const submitContact = async (data: ContactForm) => {
  const res = await fetch(`${PB_URL}/api/collections/messages/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit");
  return res.json();
};
```

> ممنوع استخدام use server أو Server Actions — دي ميزة Next.js فقط.

### 3.5 Quality Stack

| التقنية             | الاستخدام                              |
| :------------------ | :------------------------------------- |
| Impeccable          | Design/Quality gate                    |
| UI UX Pro Max Skill | Design intelligence reference          |
| clean-code-guard    | Code quality rules (live + guard-pass) |
| test-guard          | Test coverage review                   |
| docs-guard          | Documentation accuracy                 |

### 3.6 Agent Skills

```
.Skills/
├── clean-code-guard.md      # 22 قاعدة — live + guard-pass
├── test-guard.md            # مراجعة التغطية
├── docs-guard.md            # توثيق data.json
├── guard-pass.md            # توقيع الإنجاز
├── ui-ux-pro-max-skill.md   # Design system reference
└── references/              # ملفات مرجعية
    ├── solid.md
    ├── dry-kiss-yagni.md
    ├── ai-failure-modes.md
    ├── jest.md
    └── verification.md
```

### 3.7 Avoided

- Three.js
- Bounce / Elastic easing
- Purple-to-Blue gradients
- Generic SaaS visuals
- Card-in-card nesting
- Server Actions (Next.js feature)

---

## 4. Hosting & Deployment

### 4.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare (DNS)                     │
│  yourdomain.com → A Record → Hostinger IP               │
│  pb.yourdomain.com → A Record → Hostinger IP (نفسه)    │
│  www.yourdomain.com → CNAME → yourdomain.com            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Hostinger Business Plan                    │
│                                                         │
│  ┌─────────────────┐    ┌─────────────────────────┐   │
│  │  Frontend App   │    │  Backend App (PocketBase)│   │
│  │  (Vite + React) │    │  (Node.js binary)        │   │
│  │  - dist/ folder │    │  - SQLite embedded       │   │
│  │  - Static files │    │  - REST API              │   │
│  │  - React Router │    │  - Admin UI              │   │
│  └─────────────────┘    └─────────────────────────┘   │
│                                                         │
│  Both: hPanel → Websites → Node.js Apps → GitHub       │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Deployment Steps (Hostinger)

1. hPanel → Websites → Node.js Apps
2. Create App → اختر GitHub repo
3. Frontend:
   - Build Command: npm run build
   - Output Directory: dist/
   - Environment: NODE_ENV=production
4. Backend (PocketBase):
   - Upload binary file
   - Start Command: ./pocketbase serve --http=0.0.0.0:8090
   - Environment: PB_ENCRYPTION_KEY=...
5. SSL: تفعيل Let's Encrypt من hPanel
6. CORS: إعداد allowedOrigins في PocketBase Admin UI

### 4.3 DNS Setup (Cloudflare)

| Record             | Type  | Target                               | TTL  |
| :----------------- | :---- | :----------------------------------- | :--- |
| yourdomain.com     | A     | Hostinger IP                         | Auto |
| pb.yourdomain.com  | A     | Hostinger IP                         | Auto |
| www.yourdomain.com | CNAME | yourdomain.com                       | Auto |
| yourdomain.com     | TXT   | v=spf1 include:\_spf.google.com ~all | Auto |

### 4.4 Environment Variables

```env
# .env.production
VITE_PB_URL=https://pb.mostafa-elsayed.site
VITE_SITE_URL=https://mostafa-elsayed.site
VITE_GA_ID=G-XXXXXXXXXX
```

---

## 5. Repositories Integration

### 5.1 Cinematic Components (Reference)

- URL: https://github.com/robonuggets/cinematic-site-components
- Role: ملفات HTML جاهزة للأنيميشن — Reference فقط
- Usage: يُنسخ محتوى src/cinematic/ ويُحوّل إلى React components
- Files:
  - typewriter.html → Hero tagline + Skills title
  - mesh-gradient.html → خلفية Hero + Skills
  - kinetic-marquee.html → شريط الأيقونات المتحرك
  - zoom-parallax.html → قسم المهارات (Skills)
  - sticky-stack.html → قسم المشاريع (Projects)
  - sticky-cards.html → قسم الخبرات (Experience)
  - spotlight-border.html → قسم الشهادات (Certifications)
  - text-scramble.html → فوتر "Let's Connect"

### 5.2 UI UX Pro Max (Design System)

- URL: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Role: Design System Intelligence
- Usage: يُنزل SKILL.md ويُقرأ كـ context للـ AI
- Content: Design tokens, animation principles, anti-patterns

### 5.3 Impeccable (Quality Gate)

- URL: https://github.com/pbakaus/impeccable
- Role: حارس جودة — يُفحص الكود قبل كل commit
- Usage: يُثبّت في المشروع ويُشغّل كـ pre-commit hook
- Config: .impeccable/config.json

```json
{
  "ignores": {
    "values": {
      "overused-font": ["Cairo", "The Year of the Camel"]
    }
  }
}
```

> ممنوع استخدام npx impeccable ignores add-value — الـ syntax ده مش موجود في Impeccable CLI.

---

## 6. Brand Tokens & Typography

### 6.1 Color Palette

| اللون       | الكود                  | الاستخدام               |
| :---------- | :--------------------- | :---------------------- |
| خلفية داكنة | #0A0A0F                | الخلفية الأساسية        |
| بنفسجي      | #7C3AED                | اللون الأساسي (Primary) |
| ذهبي فاتح   | #F59E0B                | بداية التدرج الذهبي     |
| ذهبي غامق   | #D97706                | نهاية التدرج الذهبي     |
| أبيض 95%    | rgba(255,255,255,0.95) | العناوين                |
| أبيض 80%    | rgba(255,255,255,0.80) | النصوص الأساسية         |
| أبيض 50%    | rgba(255,255,255,0.50) | النصوص الثانوية         |
| أبيض 35%    | rgba(255,255,255,0.35) | العناصر الهادئة         |

### 6.2 Typography

| الاستخدام       | الخط                  | الملفات                                                                        |
| :-------------- | :-------------------- | :----------------------------------------------------------------------------- |
| عناوين عربية    | The Year of the Camel | alfont_com_TheYearofTheCamel-Light.otf + alfont_com_TheYearofTheCamel-Bold.otf |
| نصوص عربية      | Cairo                 | Google Fonts                                                                   |
| نصوص إنجليزية   | Cairo                 | نفس الخط                                                                       |
| عناوين إنجليزية | Inter                 | Google Fonts (ممنوع في العربي)                                                 |

> ممنوع استخدام خط Inter في النصوص العربية.

### 6.3 Tailwind Config

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        primary: "#7C3AED",
        "gold-light": "#F59E0B",
        "gold-dark": "#D97706",
      },
      fontFamily: {
        "arabic-heading": ["The Year of the Camel", "serif"],
        "arabic-body": ["Cairo", "sans-serif"],
        "english-heading": ["Inter", "sans-serif"],
      },
    },
  },
};
```

---

## 7. Assets Freeze

### 7.1 Required Files

| الملف       | المسار             | الاستخدام      |
| :---------- | :----------------- | :------------- |
| logo.png    | public/logo.png    | الشعار         |
| rD.jpg      | public/rD.jpg      | صورة الـ Hero  |
| profile.jpg | public/profile.jpg | صورة قسم About |
| cv.pdf      | public/cv/         | السيرة الذاتية |

### 7.2 Asset Rules

- كل الصور تُضغط بـ WebP/AVIF مع fallback JPG
- كل الصور تُحمل بـ loading="lazy" ما عدا Hero
- Hero image: priority + fetchpriority="high"
- كل assets تُخزن في public/ — لا تُضمّن في bundle

---

## 8. Core Architecture Rules

### 8.1 Data-Driven Architecture

- ممنوع أي نص hardcoded داخل JSX النهائي
- كل المحتوى من src/data/\*.json
- كل component يستقبل props أو يقرأ من context
- أي تغيير في المحتوى يتم عبر تعديل JSON فقط

### 8.2 Component Structure

```
src/
├── components/
│   ├── ui/           # Atomic components (Button, Card, Input)
│   ├── sections/     # Page sections (Hero, About, Skills)
│   ├── layout/       # Layout components (Nav, Footer, Preloader)
│   └── animations/   # Reusable animation wrappers
├── hooks/            # Custom React hooks
├── lib/              # Utilities, API clients
├── data/             # JSON content files
├── types/            # TypeScript types
├── pages/            # Route components
└── styles/           # Global styles, Tailwind config
```

### 8.3 Error Boundaries

- كل قسم (section) يُلفّ في Error Boundary منفصل
- Fallback UI: skeleton loader مع رسالة خطأ واضحة
- Error logging: console.error + (لاحقاً) Sentry

### 8.4 RTL/LTR Support

```tsx
// src/hooks/useDirection.ts
export const useDirection = () => {
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const newDir = mutations[0].target.dir;
      setDir((prev) => (prev !== newDir ? newDir : prev));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  return dir;
};
```

> ممنوع setDir بدون prev !== newDir check — هيسبب infinite loop.

---

## 9. Data Layer Specification

### 9.1 Data Files Structure

```
src/data/
├── site.json           # Site metadata, navigation, footer
├── hero.json           # Hero section content
├── about.json          # About section content
├── skills.json         # Skills list + categories
├── projects.json       # Projects list + details
├── experience.json     # Experience timeline
├── certifications.json # Certifications list
├── testimonials.json   # Testimonials
├── contact.json        # Contact form config
└── seo.json            # SEO metadata per page
```

### 9.2 ContentBlock Schema

```ts
// src/types/content.ts
type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; level: 1 | 2 | 3; content: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "link"; url: string; text: string };

type LocalizedContent = {
  ar: ContentBlock[];
  en: ContentBlock[];
};
```

### 9.3 Example: skills.json

```json
{
  "categories": [
    {
      "id": "digital-marketing",
      "title": { "ar": "التسويق الرقمي", "en": "Digital Marketing" },
      "skills": [
        {
          "id": "seo",
          "name": { "ar": "SEO", "en": "SEO" },
          "level": 95,
          "icon": "search",
          "description": { "ar": "...", "en": "..." }
        }
      ]
    }
  ]
}
```

### 9.4 Data Validation

- كل JSON file يُvalidate بـ Zod schema عند build time
- TypeScript types تُشتق تلقائياً من Zod schemas
- أي خطأ في data يُوقف build مع رسالة واضحة

---

## 10. SEO Rendering Strategy

### 10.1 Prerender (react-snap — ليس vite-plugin-ssg)

```bash
# Installation
npm install --save-dev react-snap

# package.json
{
  "scripts": {
    "postbuild": "react-snap"
  }
}
```

> ممنوع استخدام vite-plugin-ssg — الـ package ده مش موجود على npm.

### 10.2 Prerender Config

```js
// react-snap.config.js
module.exports = {
  source: "dist",
  destination: "dist",
  include: ["/"],
  crawl: true,
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
};
```

### 10.3 Dynamic Routes

- /skills/:slug و /projects/:slug يُgenerate static pages at build time
- استخدم react-snap مع react-router config
- كل slug يُقرأ من skills.json و projects.json

### 10.4 Meta Tags

```tsx
// src/components/SEO.tsx
export const SEO = ({ title, description, image, path }: SEOProps) => {
  const { lang } = useLanguage();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`https://mostafa-elsayed.site${path}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={`https://mostafa-elsayed.site${path}`} />
    </Helmet>
  );
};
```

### 10.5 CSP Headers (\_headers file — ليس vite config)

```
# _headers (Cloudflare Pages / Netlify)
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://pb.mostafa-elsayed.site;"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

> ممنوع وضع CSP في vite.config.ts — ده بيشتغل بس في development.

---

## 11. Information Architecture & Routes

### 11.1 Route Map

| Route           | الصفحة           | SEO | Prerender |
| :-------------- | :--------------- | :-- | :-------- |
| /               | Landing Page     | ✅  | ✅        |
| /about          | About الكامل     | ✅  | ✅        |
| /skills         | Skills Index     | ✅  | ✅        |
| /skills/:slug   | Skill Detail     | ✅  | ✅        |
| /projects       | Projects Index   | ✅  | ✅        |
| /projects/:slug | Project Detail   | ✅  | ✅        |
| /privacy-policy | Privacy Policy   | ✅  | ✅        |
| /terms          | Terms of Service | ✅  | ✅        |
| /cookies        | Cookies Policy   | ✅  | ✅        |
| /admin/\*       | Admin Panel      | ❌  | ❌        |

### 11.2 Route Config

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/skills" element={<SkillsIndexPage />} />
      <Route path="/skills/:slug" element={<SkillDetailPage />} />
      <Route path="/projects" element={<ProjectsIndexPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
    </Routes>
  </BrowserRouter>
);
```

---

## 12. Folder Structure

```
portfolio.mostafa-elsayed.site/
├── .claude/                    # Agent skills
│   ├── clean-code-guard.md
│   ├── test-guard.md
│   ├── docs-guard.md
│   ├── guard-pass.md
│   ├── ui-ux-pro-max-skill.md
│   └── references/
├── .github/                    # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── public/                     # Static assets
│   ├── logo.png
│   ├── rD.jpg
│   ├── profile.jpg
│   ├── cv/
│   │   └── cv.pdf
│   └── fonts/
│       ├── TheYearofTheCamel-Light.otf
│       └── TheYearofTheCamel-Bold.otf
├── src/
│   ├── components/
│   │   ├── ui/                 # Atomic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Badge.tsx
│   │   ├── sections/           # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Marquee.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Certifications.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Footer.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Preloader.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── animations/         # Animation wrappers
│   │       ├── Typewriter.tsx
│   │       ├── MeshGradient.tsx
│   │       ├── KineticMarquee.tsx
│   │       ├── ZoomParallax.tsx
│   │       ├── StickyStack.tsx
│   │       ├── StickyCards.tsx
│   │       ├── SpotlightBorder.tsx
│   │       └── TextScramble.tsx
│   ├── hooks/
│   │   ├── useDirection.ts
│   │   ├── useLanguage.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useInView.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   ├── pocketbase.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── data/                   # JSON content files
│   │   ├── site.json
│   │   ├── hero.json
│   │   ├── about.json
│   │   ├── skills.json
│   │   ├── projects.json
│   │   ├── experience.json
│   │   ├── certifications.json
│   │   ├── testimonials.json
│   │   ├── contact.json
│   │   └── seo.json
│   ├── types/
│   │   ├── content.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── SkillsIndexPage.tsx
│   │   ├── SkillDetailPage.tsx
│   │   ├── ProjectsIndexPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── PrivacyPolicyPage.tsx
│   │   ├── TermsPage.tsx
│   │   └── CookiesPage.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .env.production
├── .eslintrc.js
├── .prettierrc
├── .impeccable/
│   └── config.json
├── _headers                     # CSP headers for production
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── react-snap.config.js
└── PLAN.md
```

---

## 13. Landing Page Layout

### 13.1 Section Order

| #   | القسم            | Animation                 | Priority |
| :-- | :--------------- | :------------------------ | :------- |
| 1   | Preloader        | CSS Keyframes             | P0       |
| 2   | BottomNav        | Framer Motion             | P0       |
| 3   | Hero             | Typewriter + MeshGradient | P0       |
| 4   | About Preview    | Fade In + Slide           | P0       |
| 5   | Marquee          | KineticMarquee            | P1       |
| 6   | Skills           | ZoomParallax              | P1       |
| 7   | Projects Preview | StickyStack               | P1       |
| 8   | Certifications   | SpotlightBorder           | P2       |
| 9   | Experience       | StickyCards               | P2       |
| 10  | Testimonials     | Carousel + Fade           | P2       |
| 11  | Contact          | Form + Toast              | P2       |
| 12  | Footer           | TextScramble              | P2       |

### 13.2 Section Specifications

#### 1. Preloader

- Duration: 2-3 seconds
- Animation: CSS Keyframes (fade out + scale)
- Content: Logo + Loading bar
- Exit: opacity: 0 + visibility: hidden
- Acceptance Criteria:
  - [ ] يظهر على كل load
  - [ ] يختفي بسلاسة
  - [ ] لا يعيد الظهور على navigation داخلية

#### 2. BottomNav

- Position: Fixed bottom
- Animation: Framer Motion (show/hide on scroll)
- Items: Home, About, Skills, Projects, Contact
- Active State: underline + color change
- Acceptance Criteria:
  - [ ] يختفي على scroll down
  - [ ] يظهر على scroll up
  - [ ] يعمل في RTL و LTR

#### 3. Hero

- Height: 100vh
- Background: MeshGradient (animated)
- Content:
  - Name: Typewriter effect
  - Title: Static
  - Tagline: Typewriter effect
  - CTA: Button (scroll to contact)
- Animation: GSAP (ScrollTrigger for parallax)
- Acceptance Criteria:
  - [ ] Typewriter يشتغل بشكل صحيح
  - [ ] MeshGradient يتحرك بسلاسة
  - [ ] Parallax effect على scroll
  - [ ] CTA button يعمل

#### 4. About Preview

- Layout: 2 columns (image + text)
- Image: profile.jpg (rounded)
- Content: 2-3 paragraphs from about.json
- Animation: Fade in + slide from bottom
- CTA: "Read More" → /about
- Acceptance Criteria:
  - [ ] Image يتحمل بشكل صحيح
  - [ ] Text يظهر بسلاسة
  - [ ] CTA يوجه للـ About page

#### 5. Marquee

- Content: Icons/Logos of skills/tools
- Animation: KineticMarquee (infinite scroll)
- Speed: 50px/s
- Direction: RTL in Arabic, LTR in English
- Acceptance Criteria:
  - [ ] يتحرك بشكل مستمر
  - [ ] يتوقف على hover (optional)
  - [ ] يعمل في الاتجاهين

#### 6. Skills

- Layout: Grid with ZoomParallax
- Content: Categories + Skills from skills.json
- Animation: GSAP ScrollTrigger (zoom on scroll)
- Interaction: Click → /skills/:slug
- Acceptance Criteria:
  - [ ] ZoomParallax يشتغل بشكل صحيح
  - [ ] Skills تظهر بشكل منظم
  - [ ] Click يوجه للـ detail page

#### 7. Projects Preview

- Layout: StickyStack
- Content: 3-4 featured projects from projects.json
- Animation: GSAP ScrollTrigger (sticky + stack)
- Interaction: Click → /projects/:slug
- CTA: "View All Projects" → /projects
- Acceptance Criteria:
  - [ ] StickyStack يشتغل بشكل صحيح
  - [ ] Projects تظهر بشكل منظم
  - [ ] Click يوجه للـ detail page

#### 8. Certifications

- Layout: Grid with SpotlightBorder
- Content: Certificates from certifications.json
- Animation: GSAP (spotlight effect on hover)
- Acceptance Criteria:
  - [ ] SpotlightBorder يشتغل بشكل صحيح
  - [ ] Certificates تظهر بشكل منظم
  - [ ] Hover effect يعمل

#### 9. Experience

- Layout: StickyCards
- Content: Timeline from experience.json
- Animation: GSAP ScrollTrigger (sticky cards)
- Acceptance Criteria:
  - [ ] StickyCards يشتغل بشكل صحيح
  - [ ] Timeline تظهر بشكل منظم
  - [ ] Dates and titles واضحة

#### 10. Testimonials

- Layout: Carousel
- Content: Quotes from testimonials.json
- Animation: Framer Motion (slide + fade)
- Auto-play: 5 seconds
- Navigation: Dots + Arrows
- Acceptance Criteria:
  - [ ] Carousel يشتغل بشكل صحيح
  - [ ] Auto-play يعمل
  - [ ] Navigation يعمل

#### 11. Contact

- Layout: Form + Info
- Fields: Name, Phone, Email, Message
- Validation: Zod schema
- Honeypot: Hidden field website
- Submit: fetch() to PocketBase
- Success: Toast "تم الإرسال بنجاح"
- Error: Toast بالخطأ + الاحتفاظ بالبيانات
- Acceptance Criteria:
  - [ ] Validation يعمل بشكل صحيح
  - [ ] Honeypot يعمل
  - [ ] Submit يوصل للـ PocketBase
  - [ ] Success/Error toast يظهر

#### 12. Footer

- Content:
  - Logo + Tagline
  - Quick Links
  - Social Links
  - Copyright
- Animation: TextScramble on "Let's Connect"
- Acceptance Criteria:
  - [ ] Links تعمل
  - [ ] TextScramble يشتغل
  - [ ] Responsive

---

## 14. Component Specifications

### 14.1 UI Components

#### Button

```tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
}
```

- Primary: Background #7C3AED + White text
- Secondary: Border #7C3AED + #7C3AED text
- Ghost: Transparent + White text
- Hover: Scale 1.05 + brightness increase
- Animation: Framer Motion (whileHover, whileTap)

#### Card

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}
```

- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(255,255,255,0.1)
- Border Radius: 16px
- Hover: Border color change + subtle glow
- Animation: Framer Motion (whileHover)

#### Input / Textarea

```tsx
interface InputProps {
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  error?: string;
}
```

- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(255,255,255,0.1)
- Focus: Border #7C3AED + glow
- Error: Border red + error message

### 14.2 Animation Components

#### Typewriter

```tsx
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}
```

- Library: SplitType + GSAP
- Effect: Character-by-character reveal
- Cursor: Blinking underscore
- Acceptance Criteria:
  - [ ] يكتب النص حرف بحرف
  - [ ] Cursor ي blink
  - [ ] onComplete يشتغل

#### MeshGradient

```tsx
interface MeshGradientProps {
  colors: string[];
  speed?: number;
  className?: string;
}
```

- Effect: Animated gradient mesh
- Colors: Brand colors
- Performance: CSS animation (GPU accelerated)
- Acceptance Criteria:
  - [ ] يتحرك بسلاسة
  - [ ] لا يسبب lag
  - [ ] يعمل على mobile

#### KineticMarquee

```tsx
interface KineticMarqueeProps {
  items: { icon: string; label: string }[];
  speed?: number;
  direction?: "rtl" | "ltr";
}
```

- Effect: Infinite horizontal scroll
- Items: Icons + labels
- Speed: Configurable
- Acceptance Criteria:
  - [ ] يتحرك بشكل مستمر
  - [ ] لا يتوقف unexpectedly
  - [ ] يعمل في الاتجاهين

#### ZoomParallax

```tsx
interface ZoomParallaxProps {
  items: { image: string; title: string; description: string }[];
}
```

- Effect: Zoom on scroll
- Library: GSAP ScrollTrigger
- Acceptance Criteria:
  - [ ] يعمل على scroll
  - [ ] Zoom smooth
  - [ ] لا يسبب jank

#### StickyStack

```tsx
interface StickyStackProps {
  items: { image: string; title: string; description: string; link: string }[];
}
```

- Effect: Sticky + stack on scroll
- Library: GSAP ScrollTrigger
- Acceptance Criteria:
  - [ ] يعمل على scroll
  - [ ] Sticky behavior صحيح
  - [ ] Stack effect واضح

#### StickyCards

```tsx
interface StickyCardsProps {
  items: {
    date: string;
    title: string;
    company: string;
    description: string;
  }[];
}
```

- Effect: Sticky cards on scroll
- Library: GSAP ScrollTrigger
- Acceptance Criteria:
  - [ ] يعمل على scroll
  - [ ] Cards تظهر بشكل منظم
  - [ ] Dates واضحة

#### SpotlightBorder

```tsx
interface SpotlightBorderProps {
  children: React.ReactNode;
  className?: string;
}
```

- Effect: Spotlight on border on hover
- Library: CSS + GSAP
- Acceptance Criteria:
  - [ ] يعمل على hover
  - [ ] Spotlight يتحرك مع الماوس
  - [ ] Border glow واضح

#### TextScramble

```tsx
interface TextScrambleProps {
  text: string;
  trigger?: "hover" | "mount" | "inView";
  className?: string;
}
```

- Effect: Text scramble animation
- Library: GSAP
- Acceptance Criteria:
  - [ ] يعمل على trigger
  - [ ] Scramble effect واضح
  - [ ] يعود للنص الأصلي

---

## 15. Inner Page Specifications

### 15.1 About Page (/about)

- Layout: Full page
- Content:
  - Full bio from about.json
  - Certifications grid
  - Contact form
- Animation: Fade in sections
- SEO: Title + Description from seo.json

### 15.2 Skills Index (/skills)

- Layout: Grid
- Content: All skills from skills.json
- Filter: By category
- Search: By name
- Animation: Staggered fade in
- SEO: Title + Description from seo.json

### 15.3 Skill Detail (/skills/:slug)

- Layout: Full page
- Content:
  - Skill name + description
  - Level (progress bar)
  - Related projects
  - Related skills
- Animation: Fade in + slide
- SEO: Dynamic title + description

### 15.4 Projects Index (/projects)

- Layout: Grid
- Content: All projects from projects.json
- Filter: By category, date
- Search: By name
- Animation: Staggered fade in
- SEO: Title + Description from seo.json

### 15.5 Project Detail (/projects/:slug)

- Layout: Full page
- Content:
  - Project name + description
  - Images gallery
  - Technologies used
  - Links (live, repo)
  - Related projects
- Animation: Fade in + slide
- SEO: Dynamic title + description

### 15.6 Privacy Policy (/privacy-policy)

- Layout: Simple text page
- Content: From site.json
- SEO: Title + Description

### 15.7 Terms (/terms)

- Layout: Simple text page
- Content: From site.json
- SEO: Title + Description

### 15.8 Cookies (/cookies)

- Layout: Simple text page
- Content: From site.json
- SEO: Title + Description

---

## 16. Admin Panel Future Scope

> هذا القسم يصف متطلبات الـ Admin Panel المستقبلية فقط. لا يتم تنفيذه الآن.

### 16.1 Modules

| الموديول         | الوظيفة                                |
| :--------------- | :------------------------------------- |
| Auth             | تسجيل دخول وحماية                      |
| Content Manager  | تعديل كل أقسام الموقع                  |
| Projects Manager | إضافة/تعديل/حذف مشاريع (عدد غير محدود) |
| Skills Manager   | إدارة المهارات (عدد غير محدود)         |
| Media Library    | رفع وإدارة الصور                       |
| Layout Controls  | ترتيب الأقسام وإظهار/إخفاء             |
| Policies Manager | إدارة صفحات السياسات                   |
| Settings         | الإعدادات العامة                       |

### 16.2 Tech Stack (Future)

- Framework: Next.js 14 (App Router)
- Auth: NextAuth.js
- Database: PostgreSQL (or continue PocketBase)
- API: tRPC or REST
- UI: shadcn/ui

### 16.3 Migration Path

1. Phase 1: Admin Panel منفصل على Next.js
2. Phase 2: API layer بين Admin و Frontend
3. Phase 3: Frontend يقرأ من API بدلاً من JSON
4. Phase 4: JSON files تُستخدم كـ fallback فقط

---

## 17. Animation Ownership Rules

### 17.1 Library Assignment

| التأثير                 | المكتبة       | السبب               |
| :---------------------- | :------------ | :------------------ |
| Scroll-triggered        | GSAP          | دقة + performance   |
| Pin effects             | GSAP          | ScrollTrigger.pin   |
| Infinite loops          | GSAP          | timeline.repeat(-1) |
| Complex timelines       | GSAP          | control total       |
| UI state (hover, click) | Framer Motion | simplicity          |
| Page transitions        | Framer Motion | AnimatePresence     |
| Modal/Toast             | Framer Motion | layout animations   |
| CountUp                 | Framer Motion | useSpring           |
| Preloader               | CSS Keyframes | no JS needed        |
| MeshGradient            | CSS Keyframes | GPU accelerated     |
| Simple fades            | CSS Keyframes | performance         |

### 17.2 Forbidden Combinations

- GSAP + Framer Motion على نفس العنصر
- ScrollTrigger + Framer Motion scroll
- GSAP timeline + Framer Motion animate

### 17.3 Cleanup Rule

```tsx
// صحيح
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".element", { x: 100 });
  }, containerRef);

  return () => ctx.revert();
}, []);

// غلط
useEffect(() => {
  gsap.to(".element", { x: 100 });
}, []);
```

---

## 18. Animation Engineering Standards

### 18.1 Performance Rules

- GPU Only: transform + opacity فقط
- Will-Change: يُضاف قبل animation ويُزال بعدها
- Reduced Motion: prefers-reduced-motion: reduce
- Mobile: Simplify animations under 768px
- Debounce: Resize observers debounced

### 18.2 Easing Rules

| الحالة  | Easing        |
| :------ | :------------ |
| Enter   | power2.out    |
| Exit    | power2.in     |
| Hover   | power1.out    |
| Scroll  | none (linear) |
| Elastic | ممنوع         |
| Bounce  | ممنوع         |

### 18.3 Duration Rules

| الحالة             | Duration |
| :----------------- | :------- |
| Micro (hover)      | 0.2-0.3s |
| Small (fade)       | 0.4-0.6s |
| Medium (slide)     | 0.6-0.8s |
| Large (page)       | 0.8-1.2s |
| Complex (timeline) | 1-3s     |

### 18.4 Stagger Rules

- Default: 0.05-0.1s between items
- Grid: 0.03-0.05s
- List: 0.1-0.15s
- Max items: 20 (بعد كده يتجمعوا في batches)

---

## 19. Content Resilience Rules

### 19.1 Empty States

- كل section يظهر placeholder لو البيانات فاضية
- Placeholder: skeleton loader أو "Coming Soon" message
- لا يُترك section فاضي بدون explanation

### 19.2 Error States

- كل API call يُحاط بـ try/catch
- Error UI: toast أو inline message
- Retry button: 3 attempts max
- Fallback: cached data أو default content

### 19.3 Loading States

- كل section يظهر skeleton loader أثناء load
- Skeleton: matches layout structure
- No layout shift on content load

### 19.4 Image Handling

- كل image: onError fallback
- Lazy loading: loading="lazy" (except hero)
- WebP/AVIF: with JPG fallback
- Alt text: required (from data)

---

## 20. Responsive, Accessibility & SEO

### 20.1 Breakpoints

| الاسم   | العرض      | الاستخدام           |
| :------ | :--------- | :------------------ |
| Mobile  | < 640px    | Base styles         |
| Tablet  | 640-1024px | 2 columns           |
| Desktop | > 1024px   | Full layout         |
| Wide    | > 1280px   | Max width container |

### 20.2 Mobile First

- كل styles تبدأ بـ mobile
- min-width media queries
- Complex animations تُبسط على mobile
- Touch targets: min 44px

### 20.3 Accessibility

- ARIA: كل interactive element
- Focus: visible focus states
- Keyboard: كل functionality accessible
- Screen Reader: sr-only classes
- Color Contrast: WCAG AA minimum
- Reduced Motion: prefers-reduced-motion

### 20.4 SEO

- Title: كل page has unique title
- Description: meta description per page
- OG Tags: Open Graph for social sharing
- Canonical: URL canonicalization
- Sitemap: auto-generated at build
- Robots.txt: allow public, disallow admin
- Structured Data: JSON-LD for Person, CreativeWork

### 20.5 Language

- Default: Arabic (RTL)
- Toggle: Language switcher in nav
- URL: / for Arabic, /en for English (optional)
- Content: كل JSON has ar and en keys
- Direction: dir="rtl" أو dir="ltr" on <html>

---

## 21. Testing Strategy

### 21.1 Test Types

| النوع                | الوقت      | الأدوات                      |
| :------------------- | :--------- | :--------------------------- |
| Route Render Test    | من أول يوم | React Testing Library        |
| Language Toggle Test | من أول يوم | React Testing Library        |
| Component Unit Tests | بعد كل قسم | Jest + React Testing Library |
| Integration Tests    | Phase 5    | Jest + MSW                   |
| E2E Tests            | Phase 6    | Playwright                   |
| Lighthouse           | Phase 6    | Lighthouse CI                |
| Accessibility        | Phase 6    | axe-core                     |

### 21.2 Required Tests (2 إجباريين)

```tsx
// 1. Route Render Test
// src/__tests__/routes.test.tsx
import { render, screen } from "@testing-library/react";
import { App } from "../App";

describe("Routes", () => {
  it("renders landing page at /", () => {
    render(<App />);
    expect(screen.getByText(/مصطفى السيد/i)).toBeInTheDocument();
  });

  it("renders about page at /about", () => {
    window.history.pushState({}, "", "/about");
    render(<App />);
    expect(screen.getByText(/نبذة/i)).toBeInTheDocument();
  });
});

// 2. Language Toggle Test
// src/__tests__/language.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../contexts/LanguageContext";

describe("Language Toggle", () => {
  it("toggles between Arabic and English", () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>,
    );
    const toggle = screen.getByRole("button", { name: /English/i });
    fireEvent.click(toggle);
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");
  });
});
```

### 21.3 Test Coverage

- Minimum: 70% coverage
- Target: 80% coverage
- Focus: Components + Hooks + Utils
- Exclude: Animation libraries (GSAP), Types

### 21.4 CI/CD Testing

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - run: npm run build
      - run: npx impeccable detect src/
```

---

## 22. Performance Budget

### 22.1 Budgets

| Metric                         | Budget        | Tool                    |
| :----------------------------- | :------------ | :---------------------- |
| First Contentful Paint (FCP)   | < 1.5s        | Lighthouse              |
| Largest Contentful Paint (LCP) | < 2.5s        | Lighthouse              |
| Time to Interactive (TTI)      | < 3.5s        | Lighthouse              |
| Total Blocking Time (TBT)      | < 200ms       | Lighthouse              |
| Cumulative Layout Shift (CLS)  | < 0.1         | Lighthouse              |
| Speed Index                    | < 2.5s        | Lighthouse              |
| Bundle Size (JS)               | < 200KB       | webpack-bundle-analyzer |
| Bundle Size (CSS)              | < 50KB        | webpack-bundle-analyzer |
| Images Size                    | < 500KB total | Lighthouse              |
| Fonts Size                     | < 100KB       | Lighthouse              |

### 22.2 Optimization Strategies

- Code Splitting: Route-based + Component-based
- Lazy Loading: Images, heavy components
- Tree Shaking: Remove unused code
- Compression: Brotli + Gzip
- Caching: Service Worker for assets
- CDN: Cloudflare for static assets

---

## 23. Security Baseline

### 23.1 CSP (Content Security Policy)

```
# _headers
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://pb.mostafa-elsayed.site; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
```

### 23.2 Headers

| Header                 | Value                                    |
| :--------------------- | :--------------------------------------- |
| X-Frame-Options        | DENY                                     |
| X-Content-Type-Options | nosniff                                  |
| Referrer-Policy        | strict-origin-when-cross-origin          |
| Permissions-Policy     | geolocation=(), microphone=(), camera=() |

### 23.3 Form Security

- Honeypot: Hidden field website
- Rate Limiting: 5 submissions per IP per hour
- Validation: Zod schema on client + server
- Sanitization: DOMPurify for any HTML input

### 23.4 PocketBase Security

- CORS: Whitelist portfolio.mostafa-elsayed.site فقط
- Auth: Public create-only for messages collection
- Admin: Strong password + 2FA
- Backup: Daily automated backups

---

## 24. Quality Gates

### 24.1 Pre-Commit Checks

```bash
#!/bin/sh
# .husky/pre-commit

# 1. Impeccable quality gate
npx impeccable detect src/
```

---

## 25. Execution Roadmap (Priority-Ordered Master Playbook)

> Last updated: 2026-06-21  
> Prepared after project analysis by: عزوز  
> Purpose: تحويل الخطة إلى ترتيب تنفيذي أوضح، Frontend-first، ثم Backend/PocketBase، ثم Admin Panel/CMS لاحقاً في Next.js منفصل.  
> Important: كل المعلومات الأصلية محفوظة، وتمت إضافة تفاصيل تنفيذية وترتيب أولويات حتى يستطيع أي agent تنفيذ الخطة بدون افتراضات.

### 25.1 Current Baseline From Project Analysis

#### 25.1.1 Current Project Facts

| المجال | الحالة الحالية في المشروع |
| :-- | :-- |
| Framework | React 19.2.0 |
| Language | TypeScript strict |
| Build Tool | Vite 7.x — package.json يستخدم `^7.2.4`، و `npm ci` ركّب Vite 7.3.0 |
| Styling | Tailwind CSS 3.4.19 + shadcn/ui style components |
| Routing | React Router موجود في `main.tsx`، لكن التطبيق حالياً صفحة واحدة |
| Animation | GSAP موجود؛ ScrollTrigger مستخدم في `App.tsx` و `Hero.tsx` |
| Form Stack | Contact form حاليًا fake submit فقط |
| Backend | لا يوجد Backend داخل المشروع |
| PocketBase | غير مُطبّق بعد |
| Admin Panel | غير مُطبّق؛ مرحلة مستقبلية منفصلة على Next.js |
| Data Layer | لا توجد `src/data/*.json` بعد |
| Hardcoded Content | موجود داخل JSX الحالي، ويجب نقله لاحقاً إلى JSON files |
| Tests | غير موجودة بعد |
| Prerender | غير موجود بعد؛ مطلوب لاحقاً عبر `react-snap` |

#### 25.1.2 Current Health Gate

| الفحص | النتيجة | الإجراء المطلوب قبل التنفيذ |
| :-- | :-- | :-- |
| `npm run build` | نجح | الاستمرار، مع مراقبة bundle size |
| `npm run lint` | فشل | إصلاح الأخطاء قبل أي commit |
| `npm audit` | 11 vulnerabilities | ترقية/معالجة dependencies، خاصة Vite/PostCSS/Rollup/lodash chain |
| Browser runtime | لا توجد console errors | الاستمرار، لكن بعد إعادة البناء يجب إعادة التحقق |
| Mobile/RTL | يعمل بشكل أساسي | يحتاج تحسين reduced motion و animation cleanup |
| Contact form | يعمل محلياً فقط | ربطه لاحقاً بـ PocketBase |
| Admin Panel | غير موجود | لا يُنفّذ داخل Vite repo |

#### 25.1.3 Current Lint Blockers To Resolve Before Feature Work

- `src/components/ui/badge.tsx:46` — react-refresh export rule.
- `src/components/ui/button-group.tsx:82` — react-refresh export rule.
- `src/components/ui/button.tsx:62` — react-refresh export rule.
- `src/components/ui/form.tsx:159` — react-refresh export rule.
- `src/components/ui/navigation-menu.tsx:167` — react-refresh export rule.
- `src/components/ui/sidebar.tsx:725` — react-refresh export rule.
- `src/components/ui/toggle.tsx:45` — react-refresh export rule.
- `src/components/ui/sidebar.tsx:611` — `Math.random` داخل render.
- `src/sections/Testimonials.tsx:67` — `goTo` تُقرأ قبل تعريفها داخل `useEffect`.
- `src/sections/Testimonials.tsx:72` — تعريف `goTo` بعد الاستخدام؛ يجب نقلها قبل effect أو استخدام `useCallback`.

#### 25.1.4 Current Dependency Risk

- Vite 7.3.0 يظهر في audit report ضمن نطاق vulnerable.
- PostCSS و Rollup و lodash chain و minimatch/picomatch ضمن vulnerabilities.
- لا يتم تنفيذ `npm audit fix` عشوائياً قبل فهم التأثير على lockfile والـ build.
- أي dependency upgrade يجب أن يتبع:
  1. قراءة changelog إن وجد.
  2. `npm install` أو `npm update` محدد.
  3. `npm run build`.
  4. `npm run lint`.
  5. `npm audit`.

### 25.2 Priority Map

| الأولوية | النطاق | الهدف | لا يبدأ قبل |
| :-- | :-- | :-- | :-- |
| P0 | Baseline + Quality Gate | تنظيف الأرضية قبل البناء | لا شيء |
| P1 | Data Layer + Types | منع hardcoded text وبناء contracts | P0 |
| P2 | App Shell + Routing | إعداد الهيكل العام والـ pages | P0/P1 |
| P3 | Global UX Layer | Hooks, Nav, Preloader, Footer, ErrorBoundary | P1/P2 |
| P4 | Animation Infrastructure | GSAP/Framer/CSS ownership + reduced motion | P1/P2 |
| P5 | Landing Core | Hero + About + Marquee | P3/P4 |
| P6 | Content Sections | Skills + Projects + Certifications + Experience + Testimonials | P1/P3/P4 |
| P7 | Contact UI + PocketBase | Form validation + REST submit | P1/P3/P6 |
| P8 | Inner Pages | About/Skills/Projects/Policy pages | P1/P2/P6 |
| P9 | SEO + Prerender | react-snap, meta, sitemap, JSON-LD | P2/P8 |
| P10 | Security + Performance | CSP, headers, compression, caching, rate limiting | P7/P9 |
| P11 | Final QA + Deploy | E2E, Lighthouse, DNS, SSL, monitoring | P10 |
| P12 | Admin Panel Future | Next.js CMS منفصل | بعد استقرار Frontend + PocketBase |

### 25.3 Agent Execution Rules

هذه القواعد تسري على أي AI agent ينفذ الخطة:

1. لا تبدأ تنفيذ section قبل أن تكون data/types جاهزة.
2. لا تكتب نصاً hardcoded داخل JSX النهائي.
3. كل content يأتي من `src/data/*.json`.
4. كل JSON file يجب أن يكون له Zod schema و TypeScript type.
5. كل GSAP animation يجب أن تكون داخل `gsap.context()` وتُحذف بـ `ctx.revert()`.
6. لا تستخدم Framer Motion و GSAP على نفس الخاصية لنفس العنصر.
7. Framer Motion مسموح فقط للـ UI state animations: nav, buttons, page transitions, modal, toast.
8. GSAP + ScrollTrigger مسموح للـ scroll/pin/marquee/text scramble/zoom/sticky effects.
9. CSS Keyframes مسموحة للـ Preloader, MeshGradient, hover, simple fades.
10. Contact Form يستخدم `fetch()` مباشر إلى PocketBase REST API.
11. ممنوع Server Actions أو `use server` داخل Vite project.
12. ممنوع `vite-plugin-ssg`؛ المطلوب `react-snap`.
13. CSP headers تكون في `_headers` file للـ production، وليس داخل `vite.config.ts`.
14. `useDirection` يجب أن يستخدم `prev !== newDir` check.
15. قبل أي commit: `npx impeccable detect src/` ولازم Exit Code = 0.
16. قبل أي commit أيضاً: lint, type-check, tests, build.
17. Admin Panel لا يُبنى داخل هذا repo. هو Next.js app منفصل لاحقاً.
18. PocketBase يعتبر Backend بسيط للـ Contact Form وليس Admin Panel كامل.
19. أي agent يضيف animation يجب أن يكتب Acceptance Criteria واضحة للـ reduced motion.
20. أي agent يضيف route يجب أن يضيف SEO meta + prerender plan.


### 25.3.1 Quick Agent Reference

**Command Cheat Sheet:**

| Command | Purpose | When to Run |
| :-- | :-- | :-- |
| `npm run dev` | Start dev server | Development |
| `npm run build` | Production build | After each phase |
| `npm run lint` | ESLint check | Before every commit |
| `npm run type-check` | TypeScript validation | After type changes |
| `npm test` | Run test suite | After component creation |
| `npx impeccable detect src/` | Design quality gate | Before every commit |
| `npm audit` | Security audit | After dependency changes |
| `npm run preview` | Preview production build | Before QA |

**File Quick Reference:**

| Domain | Key Paths |
| :-- | :-- |
| Data Layer | `src/data/*.json` (10 files) |
| TypeScript Types | `src/types/content.ts`, `src/types/api.ts` |
| Zod Schemas | Co-located with types in `src/types/` |
| UI Components | `src/components/ui/` (Button, Card, Input, Badge) |
| Animation Wrappers | `src/components/animations/` (8 files) |
| Sections | `src/components/sections/` (10 files) |
| Layout | `src/components/layout/` (4 files) |
| Pages | `src/pages/` (9 route files) |
| Hooks | `src/hooks/` (5 custom hooks) |
| Lib | `src/lib/` (pocketbase.ts, utils.ts, constants.ts) |
| Assets | `public/` (logo.png, rD.jpg, profile.jpg, fonts/) |
| Config | `tailwind.config.js`, `vite.config.ts`, `react-snap.config.js` |
| Security | `_headers` (CSP), `.env.production` |
| Quality | `.impeccable/config.json`, `.husky/pre-commit` |

**Execution Flow (AI Agent Protocol):**

```
For EVERY phase:
  1. Read the phase tasks and acceptance criteria
  2. Create/modify files as specified
  3. Run: npm run type-check
  4. Run: npm run lint
  5. Run: npm run build
  6. Run: npx impeccable detect src/
  7. If ANY fails → fix before proceeding to next phase
```

**Required Pre-Commit Sequence:**
```bash
# Before every git commit, in order:
npm run lint && npm run type-check && npm test && npm run build && npx impeccable detect src/
```

### 25.4 Phase 0: Baseline, Branch, Tooling, and Current Lint Gate

**Goal:** تجهيز المشروع قبل أي feature work حتى لا نبني فوق lint errors أو dependencies vulnerable.

**Entry Criteria:**
- قراءة PLAN.md.
- فهم أن النطاق الحالي Public Frontend فقط.
- عدم لمس Admin Panel الآن.

**Tasks:**
- [ ] Create branch `redesign-cinematic`.
- [ ] Clone/reference repos:
  - Cinematic Components: `https://github.com/robonuggets/cinematic-site-components`
  - UI UX Pro Max: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
  - Impeccable: `https://github.com/pbakaus/impeccable`
- [ ] Setup Vite + React + TypeScript إذا لم يكن جاهزاً.
- [ ] Install dependencies المطلوبة تدريجياً:
  - GSAP
  - Framer Motion
  - Tailwind
  - React Router
  - Zod
  - react-snap لاحقاً في Phase 9
  - Testing libs لاحقاً في Phase 11
- [ ] Setup Tailwind config:
  - dark mode
  - brand colors
  - fonts
- [ ] Create folder structure.
- [ ] Create `.env.example`.
- [ ] Create `.env.production` template فقط بدون secrets.
- [ ] Setup ESLint + Prettier + Husky.
- [ ] Setup Impeccable config:
  - `.impeccable/config.json`
  - ignores overused fonts: Cairo, The Year of the Camel.
- [ ] Fix current lint blockers:
  - shadcn/ui export rule errors.
  - `Math.random` في `sidebar.tsx`.
  - `goTo` order في `Testimonials.tsx`.
- [ ] Run `npm run lint` حتى Exit Code = 0.
- [ ] Run `npm run build` حتى Exit Code = 0.
- [ ] Run `npm audit` وتسجيل vulnerabilities قبل الترقية.
- [ ] Plan dependency upgrades بعناية، خصوصاً Vite/PostCSS/Rollup/lodash chain.
- [ ] Remove أو repurpose `src/pages/Home.tsx` كـ Vite template leftover.
- [ ] Create initial tests:
  - Route Render Test.
  - Language Toggle Test.
🤖 Agent Instructions — Phase 0:

1. **Branch first:** `git checkout -b redesign-cinematic`
2. **Install dependencies** (one at a time):
   - `npm install gsap framer-motion zod react-router-dom`
3. **Fix lint blockers in this order:**
   a. `src/components/ui/sidebar.tsx` — replace `Math.random()` with deterministic ID
   b. `src/sections/Testimonials.tsx` — move `goTo` definition before `useEffect`
   c. `src/components/ui/*.tsx` — fix react-refresh export (named exports instead of default)
4. **Verify:** `npm run lint && npm run build` → Exit Code 0
5. **Setup Impeccable:** create `.impeccable/config.json` with ignores for Cairo & The Year of the Camel
6. **Don't skip** — proceed to Phase 1 only when lint + build pass clean

⚠️ **Red Flags:**
- Don't upgrade ALL dependencies at once — handle one by one and verify after each
- Don't use `npm audit fix --force` — it may break lockfile compat
- Don't install react-snap yet — that's Phase 9


**Verification Commands:**
```bash
npm run lint
npm run build
npm audit
npx impeccable detect src/
```

**Exit Criteria:**
- Branch موجود.
- Tooling موجود.
- Lint نظيف.
- Build نظيف.
- Impeccable قابل للتشغيل.
- لا توجد blockers تمنع بناء data layer.

### 25.5 Phase 1: Data Layer, Types, and Content Contracts

**Goal:** بناء Data-Driven Architecture قبل أي UI section نهائي.

**Why this comes early:** بدون data layer، أي component سينتج hardcoded text أو refactoring لاحق مكلف.

**Tasks:**
- [ ] Create `src/data/`.
- [ ] Create data files:
  - `site.json`
  - `hero.json`
  - `about.json`
  - `skills.json`
  - `projects.json`
  - `experience.json`
  - `certifications.json`
  - `testimonials.json`
  - `contact.json`
  - `seo.json`
- [ ] Create `src/types/content.ts`.
- [ ] Define `ContentBlock` schema:
  - paragraph
  - heading
  - list
  - image
  - link
- [ ] Define `LocalizedContent` schema:
  - `ar: ContentBlock[]`
  - `en: ContentBlock[]`
- [ ] Create Zod schemas لكل JSON file.
- [ ] Create TypeScript types مشتقة من schemas.
- [ ] Validate JSON files at build time.
- [ ] Move all current hardcoded content into JSON.
- [ ] Ensure no hardcoded text remains inside final JSX.
- [ ] Add empty state handling per section.
- [ ] Add fallback/default content policy.
- [ ] Add data validation error messages that stop build clearly.

**Example Data Contract:**
```json
{
  "categories": [
    {
      "id": "digital-marketing",
      "title": { "ar": "التسويق الرقمي", "en": "Digital Marketing" },
      "skills": [
        {
          "id": "seo",
          "name": { "ar": "SEO", "en": "SEO" },
          "level": 95,
          "icon": "search",
          "description": { "ar": "...", "en": "..." }
        }
      ]
    }
  ]
}
```
🤖 Agent Instructions — Phase 1:

1. **Create `src/data/` directory** and all 10 JSON files with bilingual (ar/en) structure
2. **Content structure:** every text field uses `{ "ar": "...", "en": "..." }`
3. **Create types:** `src/types/content.ts` — define `ContentBlock`, `LocalizedContent`, per-entity types
4. **Create Zod schemas** for validation at build time, derive TS types from them
5. **Move ALL hardcoded text** from existing JSX into JSON files — zero JSX hardcode
6. **Verify:** `npm run type-check && npm run build`

⚠️ **Red Flags:**
- Every field MUST be bilingual — no single-language fields
- Types MUST be derived from Zod with `z.infer<>`, not written manually


**Verification Commands:**
```bash
npm run type-check
npm run build
```

**Exit Criteria:**
- JSON files موجودة.
- Zod schemas موجودة.
- TypeScript types موجودة.
- Build validation يعمل.
- JSX لا يعتمد على hardcoded content.

### 25.6 Phase 2: App Shell, Routing, and Layout

**Goal:** بناء الهيكل العام قبل بناء الأقسام السينمائية.

**Tasks:**
- [ ] Create `src/pages/LandingPage.tsx`.
- [ ] Create `src/pages/AboutPage.tsx`.
- [ ] Create `src/pages/SkillsIndexPage.tsx`.
- [ ] Create `src/pages/SkillDetailPage.tsx`.
- [ ] Create `src/pages/ProjectsIndexPage.tsx`.
- [ ] Create `src/pages/ProjectDetailPage.tsx`.
- [ ] Create `src/pages/PrivacyPolicyPage.tsx`.
- [ ] Create `src/pages/TermsPage.tsx`.
- [ ] Create `src/pages/CookiesPage.tsx`.
- [ ] Configure React Router:
  - `/`
  - `/about`
  - `/skills`
  - `/skills/:slug`
  - `/projects`
  - `/projects/:slug`
  - `/privacy-policy`
  - `/terms`
  - `/cookies`
- [ ] Create layout wrapper.
- [ ] Create ErrorBoundary component.
- [ ] Wrap each section in ErrorBoundary منفصل.
- [ ] Add fallback skeleton UI.
- [ ] Add route-level SEO component.
- [ ] Ensure public pages are ready for prerender later.
- [ ] Ensure `/admin/*` is not part of this Vite app.

**Route Map:**

| Route | الصفحة | SEO | Prerender |
| :-- | :-- | :-- | :-- |
| `/` | Landing Page | ✅ | ✅ |
| `/about` | About الكامل | ✅ | ✅ |
| `/skills` | Skills Index | ✅ | ✅ |
| `/skills/:slug` | Skill Detail | ✅ | ✅ |
| `/projects` | Projects Index | ✅ | ✅ |
| `/projects/:slug` | Project Detail | ✅ | ✅ |
| `/privacy-policy` | Privacy Policy | ✅ | ✅ |
| `/terms` | Terms of Service | ✅ | ✅ |
| `/cookies` | Cookies Policy | ✅ | ✅ |
| `/admin/*` | Admin Panel | ❌ | ❌ |
🤖 Agent Instructions — Phase 2:

1. **Create page components** under `src/pages/` — each is a simple data-reader wrapper
2. **Configure React Router** in `src/App.tsx` with all 9 routes from Section 11
3. **Create layout wrapper** with `<main>` container and ErrorBoundary per section
4. **Each section** gets its own ErrorBoundary with skeleton fallback UI
5. **Verify:** every route renders without crash → `npm run build`

⚠️ **Red Flags:**
- `/admin/*` NOT part of this Vite app — don't add it
- Use `BrowserRouter` not `HashRouter` for SSR/prerender compat


**Verification Commands:**
```bash
npm run type-check
npm run build
```

**Exit Criteria:**
- Routes موجودة.
- Layout wrapper يعمل.
- ErrorBoundary يعمل.
- No route points to placeholder accidentally.
- Public routes ready for SEO/prerender.

### 25.7 Phase 3: Global UX Layer

**Goal:** بناء الطبقة العامة للتجربة قبل الأقسام الثقيلة.

**Tasks:**
- [ ] Create `useDirection` hook with `prev !== newDir` check.
- [ ] Create `useLanguage` hook.
- [ ] Create `useScrollProgress` hook.
- [ ] Create `useInView` hook.
- [ ] Create `useMediaQuery` hook.
- [ ] Create BottomNav component.
- [ ] BottomNav animation: Framer Motion.
- [ ] BottomNav items:
  - Home
  - About
  - Skills
  - Projects
  - Contact
- [ ] BottomNav active state:
  - underline
  - color change
- [ ] BottomNav RTL/LTR support.
- [ ] Create Preloader component.
- [ ] Preloader animation: CSS Keyframes.
- [ ] Preloader duration: 2-3 seconds.
- [ ] Create Footer component.
- [ ] Footer animation: TextScramble on “Let’s Connect”.
- [ ] Create TopBar if needed.
- [ ] Create layout wrapper.
- [ ] Test all hooks and components.

**Acceptance Criteria:**
- BottomNav يختفي على scroll down.
- BottomNav يظهر على scroll up.
- BottomNav يعمل RTL/LTR.
- Preloader يظهر على load.
- Preloader يختفي بسلاسة.
- Preloader لا يعاود الظهور على internal navigation.
- Footer links تعمل.
- Reduced motion لا يكسر UX.
🤖 Agent Instructions — Phase 3:

1. **Hooks in order:** `useDirection` → `useLanguage` → `useScrollProgress` → `useInView` → `useMediaQuery`
2. **`useDirection`:** MUST use `prev !== newDir` check to prevent infinite loop
3. **BottomNav:** Framer Motion `AnimatePresence` for show/hide on scroll direction change
4. **Preloader:** pure CSS Keyframes — no JS animation library
5. **Footer:** TextScramble on "Let's Connect" via GSAP
6. **Verify:** `npm test && npm run build`

⚠️ **Red Flags:**
- BottomNav → Framer Motion ONLY (not GSAP)
- Preloader → CSS ONLY (no GSAP, no Framer Motion)
- TextScramble → GSAP ONLY (not Framer Motion)


**Verification Commands:**
```bash
npm run test
npm run lint
npm run build
```

**Exit Criteria:**
- Global UX components جاهزة.
- Hooks مستقرة.
- RTL/LTR working.
- No hardcoded text.

### 25.8 Phase 4: Animation Infrastructure

**Goal:** تثبيت قواعد animation قبل بناء الأقسام، حتى لا تحدث conflicts بين GSAP و Framer Motion.

**Tasks:**
- [ ] Create `src/components/animations/`.
- [ ] Create `Typewriter.tsx`.
- [ ] Create `MeshGradient.tsx`.
- [ ] Create `KineticMarquee.tsx`.
- [ ] Create `ZoomParallax.tsx`.
- [ ] Create `StickyStack.tsx`.
- [ ] Create `StickyCards.tsx`.
- [ ] Create `SpotlightBorder.tsx`.
- [ ] Create `TextScramble.tsx`.
- [ ] Wrap every GSAP usage in `gsap.context()`.
- [ ] Use `ctx.revert()` في cleanup.
- [ ] Add reduced motion checks.
- [ ] Add mobile simplification logic.
- [ ] Add animation ownership comments in code.
- [ ] Ensure no element is controlled by two libraries on same property.
- [ ] Add animation performance tests or manual checks.

**Correct Pattern:**
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.element', { x: 100 });
  }, containerRef);

  return () => ctx.revert();
}, []);
```

**Forbidden Pattern:**
```tsx
useEffect(() => {
  gsap.to('.element', { x: 100 });
}, []);
```

**Animation Ownership Rules:**

| التأثير | المكتبة | السبب |
| :-- | :-- | :-- |
| Scroll-triggered | GSAP | دقة + performance |
| Pin effects | GSAP | ScrollTrigger.pin |
| Infinite loops | GSAP | timeline.repeat(-1) |
| Complex timelines | GSAP | control total |
| UI state hover/click | Framer Motion | simplicity |
| Page transitions | Framer Motion | AnimatePresence |
| Modal/Toast | Framer Motion | layout animations |
| CountUp | Framer Motion | useSpring |
| Preloader | CSS Keyframes | no JS needed |
| MeshGradient | CSS Keyframes | GPU accelerated |
| Simple fades | CSS Keyframes | performance |

**Forbidden Combinations:**
- GSAP + Framer Motion على نفس العنصر.
- ScrollTrigger + Framer Motion scroll.
- GSAP timeline + Framer Motion animate.

**Performance Rules:**
- GPU only: transform + opacity.
- Add `will-change` قبل animation وأزله بعدها.
- Respect `prefers-reduced-motion: reduce`.
- Simplify animations under 768px.
- Debounce resize observers.
- No animating width/height.
- No animating top/left.
- No `setInterval` for animations.
🤖 Agent Instructions — Phase 4:

1. **Create `src/components/animations/`** with all 8 animation wrapper components
2. **Every GSAP usage** MUST be wrapped in `gsap.context(() => { ... }, containerRef)` with `ctx.revert()` cleanup
3. **Add `prefers-reduced-motion`** check to every animation component — respect OS setting
4. **Mobile simplification:** disable or simplify complex animations below 768px viewport
5. **No library conflict:** never let GSAP and Framer Motion control the same CSS property on the same element
6. **Reference:** `cinematic-site-components/src/` has HTML templates for reference implementation

⚠️ **Red Flags:**
- No `gsap.to()` outside `gsap.context()` — EVER
- No `setInterval` for animations → use GSAP timeline or Framer Motion variants
- No animating `width`/`height` → use `transform: scale()`
- No animating `top`/`left` → use `transform: translate()`


**Exit Criteria:**
- Animation wrappers جاهزة.
- GSAP cleanup working.
- Reduced motion safe.
- No animation ownership conflicts.

### 25.9 Phase 5: Landing Page Core Sections

**Goal:** بناء أول تجربة سينمائية للمستخدم: Hero + About Preview + Marquee.

**Section Order:**
1. Preloader.
2. BottomNav.
3. Hero.
4. About Preview.
5. Marquee.

#### 25.9.1 Hero

**Source:** `hero.json`.

**Requirements:**
- Height: 100vh.
- Background: MeshGradient.
- Content:
  - Name: Typewriter effect.
  - Title: Static.
  - Tagline: Typewriter effect.
  - CTA: Button scroll to contact.
- Animation:
  - Typewriter: SplitType + GSAP.
  - MeshGradient: CSS Keyframes.
  - Parallax: GSAP ScrollTrigger.
- Acceptance Criteria:
  - [ ] Typewriter يشتغل بشكل صحيح.
  - [ ] MeshGradient يتحرك بسلاسة.
  - [ ] Parallax effect على scroll.
  - [ ] CTA button يعمل.

#### 25.9.2 About Preview

**Source:** `about.json`.

**Requirements:**
- Layout: 2 columns image + text.
- Image: `profile.jpg` rounded.
- Content: 2-3 paragraphs from `about.json`.
- Animation: Fade in + slide from bottom.
- CTA: “Read More” → `/about`.
- Acceptance Criteria:
  - [ ] Image يتحمل بشكل صحيح.
  - [ ] Text يظهر بسلاسة.
  - [ ] CTA يوجه للـ About page.

#### 25.9.3 Marquee

**Source:** `skills.json` أو `site.json` حسب الأدوات/الشعارات.

**Requirements:**
- Content: Icons/Logos of skills/tools.
- Animation: KineticMarquee.
- Speed: 50px/s.
- Direction:
  - RTL in Arabic.
  - LTR in English.
- Acceptance Criteria:
  - [ ] يتحرك بشكل مستمر.
  - [ ] يتوقف على hover optional.
  - [ ] يعمل في الاتجاهين.
🤖 Agent Instructions — Phase 5:

1. **Hero:** `hero.json` → Typewriter (SplitType+GSAP) + MeshGradient (CSS) + Parallax (GSAP ScrollTrigger)
2. **About Preview:** `about.json` → 2 cols (image+text), CTA "Read More" → `/about`
3. **Marquee:** `skills.json` → KineticMarquee (GSAP infinite), direction per language, 50px/s
4. **Verify:** `npm run lint && npm run build && npm run preview`

⚠️ **Red Flags:**
- Hero image: `fetchpriority="high"` + NO lazy loading
- Marquee direction: RTL in Arabic, LTR in English — critical for UX
- All content from JSON — zero hardcoded text in JSX


**Verification Commands:**
```bash
npm run lint
npm run build
npm run preview
```

**Exit Criteria:**
- Landing hero feels cinematic.
- No layout shift.
- Mobile performance acceptable.
- Reduced motion respected.

### 25.10 Phase 6: Content Sections

**Goal:** بناء الأقسام المحتوى الرئيسية من JSON.

**Sections:**
1. Skills.
2. Projects Preview.
3. Certifications.
4. Experience.
5. Testimonials.

#### 25.10.1 Skills

**Source:** `skills.json`.

**Requirements:**
- Layout: Grid with ZoomParallax.
- Animation: GSAP ScrollTrigger zoom on scroll.
- Interaction: Click → `/skills/:slug`.
- Acceptance Criteria:
  - [ ] ZoomParallax يشتغل بشكل صحيح.
  - [ ] Skills تظهر بشكل منظم.
  - [ ] Click يوجه للـ detail page.

#### 25.10.2 Projects Preview

**Source:** `projects.json`.

**Requirements:**
- Layout: StickyStack.
- Content: 3-4 featured projects.
- Animation: GSAP ScrollTrigger sticky + stack.
- Interaction: Click → `/projects/:slug`.
- CTA: “View All Projects” → `/projects`.
- Acceptance Criteria:
  - [ ] StickyStack يشتغل بشكل صحيح.
  - [ ] Projects تظهر بشكل منظم.
  - [ ] Click يوجه للـ detail page.

#### 25.10.3 Certifications

**Source:** `certifications.json`.

**Requirements:**
- Layout: Grid with SpotlightBorder.
- Animation: GSAP spotlight effect on hover.
- Acceptance Criteria:
  - [ ] SpotlightBorder يشتغل بشكل صحيح.
  - [ ] Certificates تظهر بشكل منظم.
  - [ ] Hover effect يعمل.

#### 25.10.4 Experience

**Source:** `experience.json`.

**Requirements:**
- Layout: StickyCards.
- Animation: GSAP ScrollTrigger sticky cards.
- Acceptance Criteria:
  - [ ] StickyCards يشتغل بشكل صحيح.
  - [ ] Timeline تظهر بشكل منظم.
  - [ ] Dates and titles واضحة.

#### 25.10.5 Testimonials

**Source:** `testimonials.json`.

**Requirements:**
- Layout: Carousel.
- Animation: Framer Motion slide + fade.
- Auto-play: 5 seconds.
- Navigation: Dots + Arrows.
- Acceptance Criteria:
  - [ ] Carousel يشتغل بشكل صحيح.
  - [ ] Auto-play يعمل.
  - [ ] Navigation يعمل.
  - [ ] `useEffect` لا يقرأ `goTo` قبل تعريفها.
  - [ ] Reduced motion يوقف autoplay أو يبسطه.
🤖 Agent Instructions — Phase 6:

1. **Skills:** Grid + ZoomParallax (GSAP). Click → `/skills/:slug`
2. **Projects Preview:** StickyStack (GSAP). 3-4 featured, CTA → `/projects`
3. **Certifications:** Grid + SpotlightBorder (GSAP hover). Hover effect must track mouse
4. **Experience:** StickyCards (GSAP ScrollTrigger). Timeline layout with dates
5. **Testimonials:** Carousel (Framer Motion). Auto-play 5s, Dots + Arrows. Fix `goTo` definition order bug
6. **Verify:** `npm test && npm run lint && npm run build`

⚠️ **Red Flags:**
- Testimonials: Framer Motion ONLY — NOT GSAP
- StickyCards/StickyStack: GSAP ONLY — NOT Framer Motion
- Add `will-change: transform` before animation, remove after


**Verification Commands:**
```bash
npm run test
npm run lint
npm run build
```

**Exit Criteria:**
- Content sections تعمل من JSON.
- Animations مستقرة.
- No hardcoded text.
- Detail links جاهزة.

### 25.11 Phase 7: Contact UI + PocketBase Integration

**Goal:** بناء Contact form كواجهة أولاً، ثم ربطه بـ PocketBase REST API بدون Server Actions.

**Why after frontend sections:** الواجهة تحتاج تكون مستقرة قبل إدخال API/error states.

**Frontend Tasks:**
- [ ] Source: `contact.json`.
- [ ] Fields:
  - Name.
  - Phone.
  - Email.
  - Message.
- [ ] Validation: Zod schema.
- [ ] Honeypot: Hidden field `website`.
- [ ] Success toast: “تم الإرسال بنجاح”.
- [ ] Error toast: يظهر الخطأ مع الاحتفاظ بالبيانات.
- [ ] Loading state.
- [ ] Retry UI.
- [ ] Inline errors.
- [ ] Accessible labels.
- [ ] Keyboard friendly.

**Backend Integration Tasks:**
- [ ] Create `src/lib/pocketbase.ts`.
- [ ] Use `fetch()` مباشر.
- [ ] Use `import.meta.env.VITE_PB_URL`.
- [ ] No API key for public form.
- [ ] Public create-only rule in PocketBase.
- [ ] CORS whitelist: `portfolio.mostafa-elsayed.site`.
- [ ] Rate limiting: 5 submissions per IP per hour.
- [ ] Server-side validation لاحقاً داخل PocketBase hooks أو backend wrapper.

**Required Code Pattern:**
```ts
// src/lib/pocketbase.ts — fetch() مباشر
const PB_URL = import.meta.env.VITE_PB_URL;

export const submitContact = async (data: ContactForm) => {
  const res = await fetch(`${PB_URL}/api/collections/messages/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit');
  return res.json();
};
```

**PocketBase Collection:**
- Instance: self-hosted على `pb.mostafa-elsayed.site`.
- Collection: `messages`.
- Fields:
  - `name` text.
  - `phone` text.
  - `email` email.
  - `message` text.
  - `created` autodate.

**Acceptance Criteria:**
- [ ] Validation يعمل بشكل صحيح.
- [ ] Honeypot يعمل.
- [ ] Submit يوصل للـ PocketBase.
- [ ] Success/Error toast يظهر.
- [ ] Error لا يمسح form data.
- [ ] CORS يعمل فقط للنطاق المسموح.
- [ ] لا يوجد Server Actions.
🤖 Agent Instructions — Phase 7:

1. **Build form UI:** fields from `contact.json` (Name, Phone, Email, Message), Zod validation, honeypot
2. **Create `src/lib/pocketbase.ts`:** `fetch()` POST to PocketBase REST API — NO Server Actions
3. **PocketBase collection `messages`:** name/text, phone/text, email/email, message/text, created/autodate
4. **Toast on success:** "تم الإرسال بنجاح". Toast on error: keep form data, show error message
5. **Verify:** `npm run lint && npm run build && npm test`

⚠️ **Red Flags:**
- NO `use server` or Server Actions — Vite doesn't support them
- CORS: whitelist ONLY `portfolio.mostafa-elsayed.site`
- No API key in frontend — use public create-only rule in PocketBase


**Verification Commands:**
```bash
npm run lint
npm run build
npm run test
```

**Exit Criteria:**
- Contact form يعمل.
- PocketBase integration working.
- No secrets in repo.
- Form secure baseline present.

### 25.12 Phase 8: Inner Pages

**Goal:** بناء الصفحات الداخلية بعد استقرار landing page.

**Pages:**
- `/about`
- `/skills`
- `/skills/:slug`
- `/projects`
- `/projects/:slug`
- `/privacy-policy`
- `/terms`
- `/cookies`

#### 25.12.1 About Page `/about`

- Layout: Full page.
- Content:
  - Full bio from `about.json`.
  - Certifications grid.
  - Contact form.
- Animation: Fade in sections.
- SEO: Title + Description from `seo.json`.

#### 25.12.2 Skills Index `/skills`

- Layout: Grid.
- Content: All skills from `skills.json`.
- Filter: By category.
- Search: By name.
- Animation: Staggered fade in.
- SEO: Title + Description from `seo.json`.

#### 25.12.3 Skill Detail `/skills/:slug`

- Layout: Full page.
- Content:
  - Skill name + description.
  - Level progress bar.
  - Related projects.
  - Related skills.
- Animation: Fade in + slide.
- SEO: Dynamic title + description.

#### 25.12.4 Projects Index `/projects`

- Layout: Grid.
- Content: All projects from `projects.json`.
- Filter: By category, date.
- Search: By name.
- Animation: Staggered fade in.
- SEO: Title + Description from `seo.json`.

#### 25.12.5 Project Detail `/projects/:slug`

- Layout: Full page.
- Content:
  - Project name + description.
  - Images gallery.
  - Technologies used.
  - Links: live, repo.
  - Related projects.
- Animation: Fade in + slide.
- SEO: Dynamic title + description.

#### 25.12.6 Policy Pages

- `/privacy-policy`
- `/terms`
- `/cookies`

**Requirements:**
- Layout: Simple text page.
- Content: From `site.json` أو dedicated policy JSON.
- SEO: Title + Description.

**Acceptance Criteria:**
- [ ] كل route تعمل.
- [ ] كل page لها SEO meta.
- [ ] كل page جاهزة للـ prerender.
- [ ] No placeholder routes.
- [ ] No hardcoded text in JSX.
🤖 Agent Instructions — Phase 8:

1. **About (`/about`):** Full bio from `about.json`, certifications grid, contact form reuse
2. **Skills Index (`/skills`):** Grid, filter by category, search by name, staggered fade in
3. **Skill Detail (`/skills/:slug`):** Progress bar, related projects, related skills, dynamic SEO
4. **Projects Index (`/projects`):** Grid, filter by category/date, search by name
5. **Project Detail (`/projects/:slug`):** Gallery, technologies, live/repo links, dynamic SEO
6. **Policy pages:** Privacy, Terms, Cookies — from `site.json`, simple text layout, SEO meta
7. **Verify:** `npm test && npm run build` — all routes work, SEO metadata present

⚠️ **Red Flags:**
- Dynamic slugs (`:slug`) must be prerender-ready for react-snap (Phase 9)
- No placeholder text — every page gets real content from JSON
- SEO meta per page — unique title + description from `seo.json`


**Verification Commands:**
```bash
npm run test
npm run build
```

**Exit Criteria:**
- Inner pages implemented.
- Dynamic slugs working.
- SEO data present.

### 25.13 Phase 9: SEO + Prerender

**Goal:** جعل الصفحات public قابلة للفهرسة و SEO-rendered at build time عبر `react-snap`.

**Important:** ممنوع استخدام `vite-plugin-ssg` — package غير موجود على npm.

**Tasks:**
- [ ] Install `react-snap`.
- [ ] Create `react-snap.config.js`.
- [ ] Add `postbuild` script:
  - `react-snap`
- [ ] Configure source/destination:
  - `source: 'dist'`
  - `destination: 'dist'`
- [ ] Include `/`.
- [ ] Enable crawl.
- [ ] Puppeteer args:
  - `--no-sandbox`
  - `--disable-setuid-sandbox`
- [ ] Add meta tags to all pages.
- [ ] Add OG tags.
- [ ] Create sitemap.
- [ ] Add robots.txt.
- [ ] Add structured data JSON-LD:
  - Person.
  - CreativeWork.
- [ ] Test prerender output.
- [ ] Verify SEO in Google Search Console لاحقاً.

**Config:**
```js
// react-snap.config.js
module.exports = {
  source: 'dist',
  destination: 'dist',
  include: ['/'],
  crawl: true,
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
};
```

**SEO Component Pattern:**
```tsx
// src/components/SEO.tsx
export const SEO = ({ title, description, image, path }: SEOProps) => {
  const { lang } = useLanguage();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`https://mostafa-elsayed.site${path}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={`https://mostafa-elsayed.site${path}`} />
    </Helmet>
  );
};
```

**CSP Headers File:**
```txt
# _headers (Cloudflare Pages / Netlify)
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://pb.mostafa-elsayed.site;"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Acceptance Criteria:**
- [ ] react-snap يعمل.
- [ ] prerender output موجود.
- [ ] meta tags موجودة.
- [ ] OG tags موجودة.
- [ ] sitemap موجود.
- [ ] robots.txt موجود.
- [ ] JSON-LD موجود.
- [ ] No use of vite-plugin-ssg.
🤖 Agent Instructions — Phase 9:

1. **Install:** `npm install --save-dev react-snap`
2. **Create `react-snap.config.js`** at project root — source/destination = `dist`, include `/`
3. **Add `postbuild`** script to package.json: `"postbuild": "react-snap"`
4. **Add meta tags** via `react-helmet-async` — title, description, OG, Twitter card, canonical per page
5. **Create sitemap** and `robots.txt` — allow public pages, disallow admin
6. **JSON-LD structured data:** Person schema + CreativeWork schema
7. **Test:** `npm run build && npm run postbuild` — verify `dist/` has prerendered HTML files

⚠️ **Red Flags:**
- **DO NOT** use `vite-plugin-ssg` — it doesn't exist on npm
- CSP headers in `_headers` file — NOT in `vite.config.ts`
- react-snap Puppeteer: `--no-sandbox --disable-setuid-sandbox` required for CI


**Verification Commands:**
```bash
npm run build
npm run postbuild
```

**Exit Criteria:**
- Public pages SEO-ready.
- Build output contains prerendered HTML.
- SEO metadata present.

### 25.14 Phase 10: Security + Performance

**Goal:** تثبيت security baseline وتحسين performance قبل deploy.

**Security Tasks:**
- [ ] Create `_headers` file.
- [ ] Add CSP.
- [ ] Add X-Frame-Options = DENY.
- [ ] Add X-Content-Type-Options = nosniff.
- [ ] Add Referrer-Policy.
- [ ] Add Permissions-Policy.
- [ ] Configure PocketBase CORS whitelist.
- [ ] Add rate limiting: 5 submissions per IP per hour.
- [ ] Add Honeypot.
- [ ] Add Zod client validation.
- [ ] Plan server-side validation.
- [ ] Add DOMPurify لأي HTML input.
- [ ] Enable PocketBase admin strong password + 2FA.
- [ ] Enable daily backups.

**Performance Tasks:**
- [ ] Code splitting route-based.
- [ ] Code splitting component-based.
- [ ] Lazy load heavy components.
- [ ] Lazy load images.
- [ ] Optimize images to WebP/AVIF with JPG fallback.
- [ ] Hero image:
  - priority.
  - fetchpriority="high".
- [ ] All other images:
  - loading="lazy".
- [ ] Tree shaking.
- [ ] Compression Brotli/Gzip.
- [ ] Caching static assets.
- [ ] CDN via Cloudflare.
- [ ] Lighthouse audit.
- [ ] Bundle analyzer.
- [ ] Fix TBT/FCP/LCP/CLS issues.

**Security Headers:**

| Header | Value |
| :-- | :-- |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | geolocation=(), microphone=(), camera=() |

**CSP:**
```txt
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://pb.mostafa-elsayed.site; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
```

**Performance Budget:**

| Metric | Budget | Tool |
| :-- | :-- | :-- |
| FCP | < 1.5s | Lighthouse |
| LCP | < 2.5s | Lighthouse |
| TTI | < 3.5s | Lighthouse |
| TBT | < 200ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Speed Index | < 2.5s | Lighthouse |
| Bundle JS | < 200KB | webpack-bundle-analyzer |
| Bundle CSS | < 50KB | webpack-bundle-analyzer |
| Images | < 500KB total | Lighthouse |
| Fonts | < 100KB | Lighthouse |
🤖 Agent Instructions — Phase 10:

1. **Security:** Create `_headers` (CSP + X-Frame-Options + X-Content-Type-Options + Referrer-Policy + Permissions-Policy)
2. **PocketBase CORS:** Whitelist only portfolio domain. Add rate limiting (5/hr per IP)
3. **Performance:** Route-based code splitting (`React.lazy()`), lazy load images (except Hero), WebP/AVIF
4. **Lighthouse audit:** Target > 90 in all categories. Fix FCP/LCP/TBT/CLS issues
5. **Bundle optimization:** JS < 200KB, CSS < 50KB. Enable Brotli/Gzip on Hostinger
6. **Verify:** `npm run build && npm audit`

⚠️ **Red Flags:**
- CSP `connect-src` must include `https://pb.mostafa-elsayed.site` for PocketBase API calls
- Don't disable CSP for development — test headers end-to-end


**Verification Commands:**
```bash
npm run build
npm audit
npx lighthouse http://localhost:4173 --output=json --output-path=./reports/lighthouse.json
```

**Exit Criteria:**
- Security headers present.
- PocketBase CORS configured.
- Rate limiting configured.
- Performance budget met or improvement plan documented.
- No critical/high vulnerabilities unresolved without approval.

### 25.15 Phase 11: Final QA + Deploy

**Goal:** QA شامل ثم deploy.

**QA Tasks:**
- [ ] Run E2E tests via Playwright.
- [ ] Run final Lighthouse audit.
- [ ] Run final bug fixes.
- [ ] Run mobile testing.
- [ ] Run cross-browser testing.
- [ ] Run accessibility audit via axe-core.
- [ ] Run Lighthouse CI if available.
- [ ] Run final `npx impeccable detect src/`.
- [ ] Run final lint.
- [ ] Run final type-check.
- [ ] Run final build.
- [ ] Run final audit.
- [ ] Prepare deployment notes.

**Deploy Tasks:**
- [ ] Deploy frontend to Hostinger.
- [ ] Configure DNS via Cloudflare.
- [ ] Setup SSL.
- [ ] Setup monitoring.
- [ ] Final verification.
- [ ] Test live contact form.
- [ ] Test prerendered HTML on live URL.
- [ ] Test mobile.
- [ ] Test RTL/LTR.
- [ ] Test reduced motion.
- [ ] Test 404 route behavior.
- [ ] Test security headers live.

**Hostinger Deployment Architecture:**
- Cloudflare DNS.
- Hostinger Business Plan.
- Frontend App:
  - Vite + React.
  - `dist/` folder.
  - Static files.
  - React Router.
- Backend App:
  - PocketBase Node.js binary.
  - SQLite embedded.
  - REST API.
  - Admin UI.
- Both via hPanel → Websites → Node.js Apps → GitHub.

**Deployment Steps:**
1. hPanel → Websites → Node.js Apps.
2. Create App → اختر GitHub repo.
3. Frontend:
   - Build Command: `npm run build`.
   - Output Directory: `dist/`.
   - Environment: `NODE_ENV=production`.
4. Backend/PocketBase:
   - Upload binary file.
   - Start Command: `./pocketbase serve --http=0.0.0.0:8090`.
   - Environment: `PB_ENCRYPTION_KEY=...`.
5. SSL: تفعيل Let’s Encrypt من hPanel.
6. CORS: إعداد allowedOrigins في PocketBase Admin UI.

**DNS Records:**

| Record | Type | Target | TTL |
| :-- | :-- | :-- | :-- |
| yourdomain.com | A | Hostinger IP | Auto |
| pb.yourdomain.com | A | Hostinger IP | Auto |
| www.yourdomain.com | CNAME | yourdomain.com | Auto |
| yourdomain.com | TXT | `v=spf1 include:_spf.google.com ~all` | Auto |

**Environment Variables:**
```env
# .env.production
VITE_PB_URL=https://pb.mostafa-elsayed.site
VITE_SITE_URL=https://mostafa-elsayed.site
VITE_GA_ID=G-XXXXXXXXXX
```
🤖 Agent Instructions — Phase 11:

1. **Pre-Deploy Gate (all must pass):**
   - `npm test && npm run lint && npm run type-check && npm run build && npx impeccable detect src/`
2. **E2E tests:** Playwright on all routes + contact form submission
3. **Lighthouse:** Final audit — all categories > 90
4. **Mobile testing:** Touch targets (44px min), viewport, RTL/LTR, reduced motion
5. **Deploy to Hostinger:** hPanel → Websites → Node.js Apps → GitHub
   - Frontend: build `npm run build`, output `dist/`
   - Backend: upload PocketBase binary, start `./pocketbase serve --http=0.0.0.0:8090`
6. **DNS (Cloudflare):** A records for domain + pb subdomain, CNAME for www
7. **Verify live:** Contact form, mobile, RTL/LTR, 404 page, security headers, prerendered HTML

⚠️ **Red Flags:**
- Test contact form on LIVE URL before marking complete
- Verify `_headers` CSP is served in production (check response headers in browser DevTools)
- Submit to Google Search Console after deploy


**Exit Criteria:**
- Live site working.
- Contact form working.
- SEO/prerender present.
- Security headers present.
- Lighthouse > 90.
- Monitoring setup.

### 25.16 Phase 12: Admin Panel / CMS Future Scope

> هذا القسم يصف متطلبات الـ Admin Panel المستقبلية فقط. لا يتم تنفيذه الآن داخل مشروع Vite.

**Why separate:**
- الواجهة الحالية تقرأ المحتوى.
- الـ Admin Panel لاحقاً يكتب المحتوى.
- المرحلة الحالية تستخدم `src/data/*.json`.
- لاحقاً يتم استبدال مصدر القراءة بـ API / DB بدون كسر مكونات العرض.

**Future Admin Modules:**

| الموديول | الوظيفة |
| :-- | :-- |
| Auth | تسجيل دخول وحماية |
| Content Manager | تعديل كل أقسام الموقع |
| Projects Manager | إضافة/تعديل/حذف مشاريع عدد غير محدود |
| Skills Manager | إدارة المهارات عدد غير محدود |
| Media Library | رفع وإدارة الصور |
| Layout Controls | ترتيب الأقسام وإظهار/إخفاء |
| Policies Manager | إدارة صفحات السياسات |
| Settings | الإعدادات العامة |

**Future Tech Stack:**
- Framework: Next.js 14 App Router.
- Auth: NextAuth.js.
- Database: PostgreSQL أو الاستمرار على PocketBase.
- API: tRPC or REST.
- UI: shadcn/ui.

**Migration Path:**
1. Phase 1: Admin Panel منفصل على Next.js.
2. Phase 2: API layer بين Admin و Frontend.
3. Phase 3: Frontend يقرأ من API بدلاً من JSON.
4. Phase 4: JSON files تُستخدم كـ fallback فقط.

**Do Not Do Now:**
- Do not build Next.js Admin inside this Vite repo.
- Do not replace JSON with API before frontend sections are stable.
- Do not add mutations to public frontend.
- Do not expose admin credentials in `.env.example`.
🤖 Agent Instructions — Phase 12 (Future Scope):

**This phase is NOT executed now.** It is documented for future traceability.

When the time comes:
1. Create a SEPARATE Next.js 14 App Router repo (do NOT touch this Vite repo)
2. Use NextAuth.js for authentication and session management
3. Read existing data contracts from this project's `src/types/content.ts`
4. Build the API layer: JSON files → REST API → PostgreSQL/PocketBase
5. Keep this Vite frontend unchanged — it reads from data layer, doesn't mutate

⚠️ **Red Flags:**
- Do NOT build Admin inside this Vite repo — separate repo required
- Do NOT replace JSON files with API calls before all frontend sections are stable
- Do NOT expose admin credentials in this project's `.env` files


**Exit Criteria for Future Phase:**
- Frontend stable.
- Data contracts stable.
- PocketBase/contact working.
- Admin requirements signed off.
- Separate Next.js repo/app created.

### 25.17 Original Day-by-Day Roadmap Retained for Traceability

The original roadmap below is preserved so no original execution item is lost. The active ordered sequence is the phased plan above; this subsection keeps the original day-by-day tasks as a reference.

#### Original Timeline

| المرحلة | اليوم | المحتوى | Deliverables |
| :-- | :-- | :-- | :-- |
| Phase 0 | Day 1 | Foundation | Branch, repos, tools, data files, types |
| Phase 1 | Day 2 | Global Layer | Hooks, nav, preloader, footer, layout |
| Phase 2 | Day 3 | Hero + About | Hero section, About preview, animations |
| Phase 3 | Day 4 | Marquee + Projects | Marquee, Projects preview, StickyStack |
| Phase 4 | Day 5 | Skills | Skills grid, ZoomParallax, detail pages |
| Phase 5 | Day 6 | Certifications + Experience + Testimonials + Contact | Spotlight, StickyCards, Testimonials, Contact form |
| Phase 6 | Day 7 | QA + Polish | Lighthouse, tests, bug fixes, optimization |
| Phase 7 | Day 8-10 | Inner Pages | About, Skills Index, Projects Index, Policy pages |
| Phase 8 | Day 11-12 | SEO + Prerender | react-snap, meta tags, sitemap, structured data |
| Phase 9 | Day 13-14 | Security + Performance | CSP, headers, compression, caching |
| Phase 10 | Day 15-18 | Final QA + Deploy | E2E tests, deploy, monitoring |

#### Original Day 1: Foundation

- [ ] Create branch redesign-cinematic
- [ ] Clone repos (Cinematic Components, UI UX Pro Max, Impeccable)
- [ ] Setup Vite + React + TypeScript
- [ ] Install dependencies (GSAP, Framer Motion, Tailwind, React Router, Zod)
- [ ] Setup Tailwind config (dark mode, brand colors, fonts)
- [ ] Create folder structure
- [ ] Create data files (JSON templates)
- [ ] Create TypeScript types
- [ ] Setup ESLint + Prettier + Husky
- [ ] Setup Impeccable config
- [ ] Create .env.example
- [ ] Write initial tests (Route Render + Language Toggle)

#### Original Day 2: Global Layer

- [ ] Create useDirection hook (with prev !== newDir check)
- [ ] Create useLanguage hook
- [ ] Create useScrollProgress hook
- [ ] Create useInView hook
- [ ] Create useMediaQuery hook
- [ ] Create BottomNav component (Framer Motion)
- [ ] Create Preloader component (CSS Keyframes)
- [ ] Create Footer component (TextScramble)
- [ ] Create ErrorBoundary component
- [ ] Create layout wrapper
- [ ] Test all hooks and components

#### Original Day 3: Hero + About

- [ ] Create MeshGradient component (CSS Keyframes)
- [ ] Create Typewriter component (SplitType + GSAP)
- [ ] Create Hero section
- [ ] Create About preview section
- [ ] Add scroll animations (GSAP ScrollTrigger)
- [ ] Test animations performance
- [ ] Mobile optimization

#### Original Day 4: Marquee + Projects

- [ ] Create KineticMarquee component (GSAP)
- [ ] Create Marquee section
- [ ] Create StickyStack component (GSAP ScrollTrigger)
- [ ] Create Projects preview section
- [ ] Add project data to projects.json
- [ ] Test infinite scroll
- [ ] Test sticky behavior

#### Original Day 5: Skills

- [ ] Create ZoomParallax component (GSAP ScrollTrigger)
- [ ] Create Skills section
- [ ] Add skill data to skills.json
- [ ] Create Skills Index page
- [ ] Create Skill Detail page
- [ ] Test zoom effect
- [ ] Test detail pages

#### Original Day 6: Certifications + Experience + Testimonials + Contact

- [ ] Create SpotlightBorder component (GSAP)
- [ ] Create Certifications section
- [ ] Create StickyCards component (GSAP ScrollTrigger)
- [ ] Create Experience section
- [ ] Create Testimonials carousel (Framer Motion)
- [ ] Create Contact form (Zod validation)
- [ ] Integrate PocketBase (fetch())
- [ ] Test all sections

#### Original Day 7: QA + Polish

- [ ] Run Lighthouse audit
- [ ] Fix performance issues
- [ ] Fix accessibility issues
- [ ] Run all tests
- [ ] Fix bugs
- [ ] Optimize images
- [ ] Mobile testing
- [ ] Cross-browser testing

#### Original Day 8-10: Inner Pages

- [ ] Create About page
- [ ] Create Skills Index page
- [ ] Create Skill Detail page
- [ ] Create Projects Index page
- [ ] Create Project Detail page
- [ ] Create Privacy Policy page
- [ ] Create Terms page
- [ ] Create Cookies page
- [ ] Test all pages

#### Original Day 11-12: SEO + Prerender

- [ ] Install react-snap
- [ ] Configure react-snap
- [ ] Add meta tags to all pages
- [ ] Add OG tags
- [ ] Create sitemap
- [ ] Add structured data (JSON-LD)
- [ ] Test prerender output
- [ ] Verify SEO in Google Search Console

#### Original Day 13-14: Security + Performance

- [ ] Create _headers file (CSP)
- [ ] Add security headers
- [ ] Configure CORS in PocketBase
- [ ] Add rate limiting
- [ ] Enable compression (Brotli/Gzip)
- [ ] Configure caching
- [ ] Test security headers
- [ ] Run security audit

#### Original Day 15-18: Final QA + Deploy

- [ ] Run E2E tests (Playwright)
- [ ] Final Lighthouse audit
- [ ] Final bug fixes
- [ ] Deploy to Hostinger
- [ ] Configure DNS (Cloudflare)
- [ ] Setup SSL
- [ ] Setup monitoring
- [ ] Final verification

---

---

## 26. Definition of Done

### 26.1 Per Section

- [ ] Component implemented
- [ ] Animation implemented (per Animation Ownership Rules)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessible (ARIA, keyboard, screen reader)
- [ ] Tested (unit tests pass)
- [ ] Documented (JSDoc comments)
- [ ] No hardcoded text (all from data)
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] Impeccable passes

### 26.2 Per Page

- [ ] All sections implemented
- [ ] Route works
- [ ] SEO meta tags present
- [ ] Prerender output valid
- [ ] Lighthouse score > 90
- [ ] All tests pass

### 26.3 Per Project

- [ ] All pages implemented
- [ ] All animations work
- [ ] All tests pass
- [ ] Lighthouse score > 90 (all categories)
- [ ] Security headers present
- [ ] Deployed and live
- [ ] Monitoring setup
- [ ] Documentation complete

---

## 27. Glossary & References

### 27.1 Terms

| المصطلح       | المعنى                                     |
| :------------ | :----------------------------------------- |
| GSAP          | GreenSock Animation Platform               |
| ScrollTrigger | GSAP plugin for scroll-based animations    |
| Framer Motion | React animation library                    |
| SplitType     | Library for splitting text into characters |
| Lenis         | Smooth scroll library                      |
| Zod           | TypeScript-first validation library        |
| PocketBase    | Open source backend (Go)                   |
| Impeccable    | Design quality gate tool                   |
| CSP           | Content Security Policy                    |
| CORS          | Cross-Origin Resource Sharing              |
| RTL           | Right-to-Left (Arabic)                     |
| LTR           | Left-to-Right (English)                    |
| FCP           | First Contentful Paint                     |
| LCP           | Largest Contentful Paint                   |
| TTI           | Time to Interactive                        |
| TBT           | Total Blocking Time                        |
| CLS           | Cumulative Layout Shift                    |

### 27.2 References

- GSAP Docs: https://gsap.com/docs/
- Framer Motion: https://www.framer.com/motion/
- Tailwind CSS: https://tailwindcss.com/
- React Router: https://reactrouter.com/
- PocketBase: https://pocketbase.io/
- Zod: https://zod.dev/
- Impeccable: https://github.com/pbakaus/impeccable
- Cinematic Components: https://github.com/robonuggets/cinematic-site-components
- UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

---

## 28. Anti-Patterns (الممنوعات)

### 28.1 Design Anti-Patterns

| الممنوع               | البديل             |
| :-------------------- | :----------------- |
| خط Inter في العربي    | Cairo للعربي       |
| Bounce Easing         | power2.out         |
| Elastic Easing        | power2.out         |
| تدرج بنفسجي-أزرق      | بنفسجي-ذهبي        |
| Card داخل Card        | Flat hierarchy     |
| أزرق SaaS التقليدي    | أسود + بنفسجي      |
| حواف ملونة جانبية     | Border subtle      |
| أزرار متدرجة          | Solid colors       |
| توسيط كل حاجة         | Asymmetric layouts |
| أيقونة في دائرة ملونة | Simple icons       |

### 28.2 Code Anti-Patterns

| الممنوع                             | البديل                                   |
| :---------------------------------- | :--------------------------------------- |
| vite-plugin-ssg                     | react-snap                               |
| Server Actions (use server)         | fetch() + PocketBase REST API            |
| CSP في vite.config.ts               | \_headers file للـ production            |
| npx impeccable ignores add-value    | .impeccable/config.json                  |
| setDir بدون check                   | setDir مع prev !== newDir                |
| GSAP بدون context                   | gsap.context() + ctx.revert()            |
| Framer Motion + GSAP على نفس العنصر | Separate elements أو separate animations |
| Hardcoded text                      | JSON data files                          |
| Inline styles                       | Tailwind classes                         |
| !important                          | Specificity management                   |

### 28.3 Animation Anti-Patterns

| الممنوع                    | البديل                  |
| :------------------------- | :---------------------- |
| Bounce easing              | power2.out              |
| Elastic easing             | power2.out              |
| Animating width/height     | transform: scale        |
| Animating top/left         | transform: translate    |
| setInterval for animations | requestAnimationFrame   |
| jQuery animations          | GSAP or CSS transitions |
| Inline animation styles    | CSS classes أو GSAP     |

---

## 29. Critical Fixes Summary (الـ 5 ثغرات)

| #   | الثغرة                     | اللي هيتكتب غلط                  | اللي لازم يتكتب صح            |
| :-- | :------------------------- | :------------------------------- | :---------------------------- |
| 1   | Prerender package مش موجود | vite-plugin-ssg                  | react-snap                    |
| 2   | Server Actions في Vite     | Server Actions                   | fetch() مباشر لـ PocketBase   |
| 3   | CSP headers في Vite config | server.headers                   | \_headers file للـ production |
| 4   | Impeccable command غلط     | npx impeccable ignores add-value | .impeccable/config.json       |
| 5   | useDirection hook          | setDir بدون check                | setDir مع prev !== newDir     |

---

## 30. Final Notes

- هذا الملف هو المرجع النهائي لكل AI agent يشتغل على المشروع.
- أي تعديل على المشروع يجب أن يتماشى مع هذا الملف.
- أي سؤال أو غموض، يرجى الرجوع لهذا الملف أولاً.
- المشروع يستهدف جودة عالية (Impeccable) + أداء ممتاز (Lighthouse > 90) + تجربة مستخدم سينمائية (GSAP + Framer Motion).
- التواصل مع العميل: مصطفى السيد محمد سيد هاشم — خبير تسويق رقمي + مستشار عقاري.
- الموقع: portfolio.mostafa-elsayed.site
- الـ Branch: redesign-cinematic
- النسخة: v3.0.0 — Cinematic Redesign

---

END OF PLAN.md
