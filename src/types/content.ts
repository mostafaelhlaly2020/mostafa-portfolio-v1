import { z } from 'zod'

// ── Primitives ──

export const LocalizedString = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
})
export type LocalizedString = z.infer<typeof LocalizedString>

// ── ContentBlock (defined per PLAN.md, NOT consumed in Phase 1) ──

export const ContentBlockType = z.enum([
  'paragraph',
  'heading',
  'list',
  'image',
  'link',
])
export type ContentBlockType = z.infer<typeof ContentBlockType>

export const ContentBlock = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: LocalizedString }),
  z.object({
    type: z.literal('heading'),
    text: LocalizedString,
    level: z.number().int().min(1).max(6).default(2),
  }),
  z.object({
    type: z.literal('list'),
    items: z.array(LocalizedString),
    style: z.enum(['bullet', 'numbered']).default('bullet'),
  }),
  z.object({ type: z.literal('image'), src: z.string(), alt: LocalizedString }),
  z.object({ type: z.literal('link'), text: LocalizedString, href: z.string().url() }),
])
export type ContentBlock = z.infer<typeof ContentBlock>

export const LocalizedContent = z.object({
  ar: z.array(ContentBlock).min(1),
  en: z.array(ContentBlock).min(1),
})
export type LocalizedContent = z.infer<typeof LocalizedContent>

// ── Entity schemas ──

export const SiteSchema = z.object({
  name: LocalizedString,
  tagline: LocalizedString,
  url: z.string(),
  locale: z.string(),
  direction: z.enum(['rtl', 'ltr']),
  copyright: LocalizedString,
  madeWith: LocalizedString,
  navItems: z.array(
    z.object({
      id: z.string(),
      label: LocalizedString,
      href: z.string(),
    })
  ),
  quickLinks: z.array(
    z.object({
      label: LocalizedString,
      href: z.string(),
    })
  ),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      label: z.string(),
      url: z.string(),
    })
  ),
})
export type SiteData = z.infer<typeof SiteSchema>

export const HeroSchema = z.object({
  status: LocalizedString,
  name: LocalizedString,
  title: LocalizedString,
  cta: LocalizedString,
  backgroundGradient: z.string(),
  portraitImage: z.string(),
  portraitAlt: LocalizedString,
})
export type HeroData = z.infer<typeof HeroSchema>

export const AboutSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  paragraphs: z.array(LocalizedString),
  cta: LocalizedString,
  image: z.string(),
  imageAlt: LocalizedString,
})
export type AboutData = z.infer<typeof AboutSchema>

const SkillItem = z.object({
  id: z.string(),
  icon: z.string(),
  title: LocalizedString,
  description: LocalizedString,
  tags: z.array(z.string()),
})

export const SkillsSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  subtitle: LocalizedString,
  items: z.array(SkillItem),
})
export type SkillsData = z.infer<typeof SkillsSchema>

const Responsibility = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
})

const ExperienceItem = z.object({
  id: z.string(),
  date: LocalizedString,
  title: LocalizedString,
  company: z.string(),
  responsibilities: z.array(Responsibility),
})

export const ExperienceSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  subtitle: LocalizedString,
  items: z.array(ExperienceItem),
})
export type ExperienceData = z.infer<typeof ExperienceSchema>

const CertificationItem = z.object({
  id: z.string(),
  icon: z.string(),
  title: LocalizedString,
  platform: LocalizedString,
  year: z.string(),
  description: LocalizedString,
})

export const CertificationsSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  subtitle: LocalizedString,
  items: z.array(CertificationItem),
})
export type CertificationsData = z.infer<typeof CertificationsSchema>

const TestimonialItem = z.object({
  id: z.string(),
  text: LocalizedString,
  name: LocalizedString,
  role: LocalizedString,
})

export const TestimonialsSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  subtitle: LocalizedString,
  items: z.array(TestimonialItem),
  companies: z.array(z.string()),
})
export type TestimonialsData = z.infer<typeof TestimonialsSchema>

export const ProjectsSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  subtitle: LocalizedString,
  emptyMessage: LocalizedString,
  items: z.array(z.unknown()),
})
export type ProjectsData = z.infer<typeof ProjectsSchema>

const FormField = z.object({
  id: z.string(),
  label: LocalizedString,
  placeholder: LocalizedString,
  type: z.string(),
  required: z.boolean(),
})

const ContactMethod = z.object({
  id: z.string(),
  icon: z.string(),
  label: LocalizedString,
  value: z.union([LocalizedString, z.string()]),
  href: z.string(),
})

export const ContactSchema = z.object({
  label: LocalizedString,
  heading: LocalizedString,
  highlight: LocalizedString,
  subtitle: LocalizedString,
  infoLabel: LocalizedString,
  successTitle: LocalizedString,
  successMessage: LocalizedString,
  submitButton: LocalizedString,
  formFields: z.array(FormField),
  methods: z.array(ContactMethod),
})
export type ContactData = z.infer<typeof ContactSchema>

export const SeoSchema = z.object({
  metaDescription: LocalizedString,
  ogTitle: LocalizedString,
  ogDescription: LocalizedString,
  ogImage: z.string(),
  twitterHandle: z.string(),
})
export type SeoData = z.infer<typeof SeoSchema>

// ── Aggregate schema ──

export const PortfolioDataSchema = z.object({
  site: SiteSchema,
  hero: HeroSchema,
  about: AboutSchema,
  skills: SkillsSchema,
  experience: ExperienceSchema,
  certifications: CertificationsSchema,
  testimonials: TestimonialsSchema,
  projects: ProjectsSchema,
  contact: ContactSchema,
  seo: SeoSchema,
})
export type PortfolioData = z.infer<typeof PortfolioDataSchema>
