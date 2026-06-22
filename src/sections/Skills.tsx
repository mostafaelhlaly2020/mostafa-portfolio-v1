import { useEffect, useRef } from 'react'
import {
  TrendingUp,
  Target,
  PenTool,
  Building2,
  ShoppingCart,
  Users,
} from 'lucide-react'

const skills = [
  {
    icon: TrendingUp,
    title: 'التسويق الرقمي',
    description:
      'تطوير استراتيجيات تسويقية شاملة تشمل جميع القنوات الرقمية مع التركيز على تحقيق أعلى عائد استثمار.',
    tags: ['SEO', 'Content Marketing', 'Email Marketing'],
  },
  {
    icon: Target,
    title: 'الإعلانات المدفوعة',
    description:
      'إدارة حملات إعلانية مربحة على Meta Ads وTikTok Ads وGoogle Ads مع تحسين مستمر للأداء.',
    tags: ['Meta Ads', 'TikTok Ads', 'Google Ads'],
  },
  {
    icon: PenTool,
    title: 'إنشاء المحتوى',
    description:
      'كتابة محتوى إبداعي مقنع وإدارة حسابات التواصل الاجتماعي بشكل احترافي وجذاب.',
    tags: ['Copywriting', 'Video Production', 'Photography'],
  },
  {
    icon: Building2,
    title: 'التسويق العقاري',
    description:
      'تسويق وبيع العقارات السكنية والتجارية مع تطوير استراتيجيات مبيعات مستهدفة.',
    tags: ['Real Estate Sales', 'CRM', 'Lead Generation'],
  },
  {
    icon: ShoppingCart,
    title: 'التجارة الإلكترونية',
    description:
      'بناء متاجر Shopify ناجحة وتطوير استراتيجيات Dropshipping مع إدارة الإعلانات والمحتوى.',
    tags: ['Shopify', 'Dropshipping', 'E-Commerce'],
  },
  {
    icon: Users,
    title: 'القيادة والتدريب',
    description:
      'تدريب فرق المبيعات على أحدث التقنيات وإدارة العمليات اليومية بكفاءة عالية.',
    tags: ['Team Leadership', 'Sales Training', 'CRM Training'],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate header
            const headerEls = entry.target.querySelectorAll('.reveal')
            headerEls.forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 150)
            })

            // Animate cards with stagger
            const cards = entry.target.querySelectorAll('.skill-card')
            cards.forEach((card, i) => {
              setTimeout(() => {
                ;(card as HTMLElement).style.opacity = '1'
                ;(card as HTMLElement).style.transform = 'translateY(0)'
              }, 400 + i * 120)
            })

            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-dark py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="reveal inline-block text-sm text-[#C4A265] mb-4 font-medium">
            المهارات
          </span>
          <h2
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: '#F0EDE8', transitionDelay: '0.15s' }}
          >
            ما <span className="text-[#C4A265]">أتقنه</span>
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: 'rgba(240, 237, 232, 0.6)', transitionDelay: '0.3s' }}
          >
            مجموعة متكاملة من المهارات التقنية والتسويقية التي تضمن نجاح أي مشروع
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <div
                key={index}
                className="skill-card group rounded-2xl p-8 transition-all duration-500"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  opacity: 0,
                  transform: 'translateY(60px)',
                  transition:
                    'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s, box-shadow 0.4s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(196, 162, 101, 0.3)'
                  el.style.transform = 'translateY(-8px)'
                  el.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.3)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(196, 162, 101, 0.15)' }}
                >
                  <Icon className="w-6 h-6 text-[#C4A265]" />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: '#F0EDE8' }}
                >
                  {skill.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: 'rgba(240, 237, 232, 0.7)' }}
                >
                  {skill.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'rgba(240, 237, 232, 0.8)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
