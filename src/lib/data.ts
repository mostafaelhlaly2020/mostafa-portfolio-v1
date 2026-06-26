import type { LucideIcon } from 'lucide-react'
import {
  TrendingUp,
  Target,
  PenTool,
  Building2,
  ShoppingCart,
  Users,
  Home,
  BookOpen,
  BarChart3,
  Share2,
  PieChart,
  Globe,
  Award,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import siteData from '@/data/site.json'
import heroData from '@/data/hero.json'
import aboutData from '@/data/about.json'
import skillsData from '@/data/skills.json'
import experienceData from '@/data/experience.json'
import certificationsData from '@/data/certifications.json'
import testimonialsData from '@/data/testimonials.json'
import projectsData from '@/data/projects.json'
import contactData from '@/data/contact.json'
import seoData from '@/data/seo.json'
import {
  PortfolioDataSchema,
  type PortfolioData,
  type SiteData,
  type HeroData,
  type AboutData,
  type SkillsData,
  type ExperienceData,
  type CertificationsData,
  type TestimonialsData,
  type ProjectsData,
  type ContactData,
  type SeoData,
} from '@/types/content'

// ── Icon map: string name → Lucide component ──

export const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Target,
  PenTool,
  Building2,
  ShoppingCart,
  Users,
  Home,
  BookOpen,
  BarChart3,
  Share2,
  PieChart,
  Globe,
  Award,
  Phone,
  Mail,
  MapPin,
}

// ── Data loader: validate all JSON via Zod and export typed objects ──

const rawData = {
  site: siteData,
  hero: heroData,
  about: aboutData,
  skills: skillsData,
  experience: experienceData,
  certifications: certificationsData,
  testimonials: testimonialsData,
  projects: projectsData,
  contact: contactData,
  seo: seoData,
}

const parsed = PortfolioDataSchema.parse(rawData)

export const portfolioData: PortfolioData = parsed
export const site: SiteData = parsed.site
export const hero: HeroData = parsed.hero
export const about: AboutData = parsed.about
export const skills: SkillsData = parsed.skills
export const experience: ExperienceData = parsed.experience
export const certifications: CertificationsData = parsed.certifications
export const testimonials: TestimonialsData = parsed.testimonials
export const projects: ProjectsData = parsed.projects
export const contact: ContactData = parsed.contact
export const seo: SeoData = parsed.seo
