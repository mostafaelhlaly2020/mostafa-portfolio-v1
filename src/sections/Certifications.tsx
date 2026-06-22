import { useEffect, useRef } from 'react'
import {
  Home,
  TrendingUp,
  BookOpen,
  BarChart3,
  Share2,
  PieChart,
  Globe,
  Award,
} from 'lucide-react'

const certifications = [
  {
    icon: Home,
    title: 'التسويق العقاري',
    platform: 'أكاديمية إعمل بيزنس',
    year: '2024',
    description: '6 ساعات تدريبية متخصصة في التسويق العقاري الحديث',
  },
  {
    icon: TrendingUp,
    title: 'الاستثمار العقاري',
    platform: 'أكاديمية إعمل بيزنس',
    year: '2024',
    description: 'أساسيات الاستثمار العقاري وتحليل الفرص الاستثمارية',
  },
  {
    icon: BookOpen,
    title: 'مقدمة في علم العقارات',
    platform: 'أكاديمية إعمل بيزنس',
    year: '2024',
    description: '3 ساعات تدريبية في أساسيات علم العقارات',
  },
  {
    icon: BarChart3,
    title: 'التسويق الأدائي',
    platform: 'EYouth Learning',
    year: '2023',
    description: '16 ساعة تدريبية في التسويق الأدائي والحملات المدفوعة',
  },
  {
    icon: Share2,
    title: 'التواصل الاجتماعي للأعمال',
    platform: 'Almentor',
    year: '2023',
    description: '40 ساعة تدريبية في إدارة وسائل التواصل الاجتماعي للشركات',
  },
  {
    icon: PieChart,
    title: 'تحليل الأعمال',
    platform: 'Coursera - Wharton/UPenn',
    year: '2020',
    description: 'تخصص كامل في تحليل الأعمال من جامعة بنسلفانيا',
  },
  {
    icon: Globe,
    title: 'التسويق الرقمي الشامل',
    platform: 'Udemy',
    year: '2018',
    description: '20 ساعة تدريبية شاملة في التسويق الرقمي',
  },
  {
    icon: Award,
    title: 'التسويق الرقمي في العالم الحديث',
    platform: 'Coursera - Univ. of Illinois',
    year: '2017',
    description: 'فهم عميق للتسويق الرقمي في البيئة الحديثة',
  },
]

export default function Certifications() {
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
            const cards = entry.target.querySelectorAll('.cert-card')
            cards.forEach((card, i) => {
              setTimeout(() => {
                const el = card as HTMLElement
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, 400 + i * 80)
            })

            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="section-light py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="reveal inline-block text-sm text-[#6B6B6B] mb-4 font-medium">
            الشهادات
          </span>
          <h2
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ transitionDelay: '0.15s' }}
          >
            شهاداتي <span className="text-[#C4A265]">المعتمدة</span>
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto"
            style={{ transitionDelay: '0.3s' }}
          >
            تعلم مستمر وشهادات معتمدة من أفضل المنصات العالمية
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((cert, index) => {
            const Icon = cert.icon
            return (
              <div
                key={index}
                className="cert-card group relative rounded-xl p-6 transition-all duration-400"
                style={{
                  backgroundColor: '#F5F0EB',
                  border: '1px solid rgba(26, 26, 26, 0.08)',
                  opacity: 0,
                  transform: 'translateY(40px)',
                  transition:
                    'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s, box-shadow 0.4s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(196, 162, 101, 0.4)'
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(26, 26, 26, 0.08)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Year Badge */}
                <span
                  className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: '#C4A265',
                    color: '#FFFFFF',
                  }}
                >
                  {cert.year}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#2D2D2D' }}
                >
                  <Icon className="w-5 h-5 text-[#C4A265]" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
                  {cert.title}
                </h3>

                {/* Platform */}
                <p className="text-xs text-[#6B6B6B] mb-3">{cert.platform}</p>

                {/* Description */}
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  {cert.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
