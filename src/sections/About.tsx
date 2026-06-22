import { useEffect, useRef } from 'react'
import { ArrowUpLeft } from 'lucide-react'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right')
            elements.forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('active')
              }, i * 150)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-light py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <span className="reveal-right inline-block text-sm text-[#6B6B6B] mb-4">
              من أنا
            </span>
            <h2
              className="reveal-right text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-8"
              style={{ transitionDelay: '0.15s' }}
            >
              خبير تسويق رقمي
              <br />
              <span className="text-[#C4A265]">بشغف لا ينتهي</span>
            </h2>

            <div className="space-y-5 text-[#6B6B6B] text-base md:text-lg leading-relaxed">
              <p className="reveal-right" style={{ transitionDelay: '0.3s' }}>
                أنا مصطفى السيد (محمد سيد هاشم)، خبير تسويق رقمي واستشاري عقارات بخبرة
                تتجاوز 9 سنوات في مصر والعالم العربي. بدأت رحلتي منذ عام 2015، واكتسبت
                خبرة واسعة في بناء العلامات التجارية من الصفر، وإدارة الحملات الإعلانية
                المدفوعة على منصات Meta وTikTok وGoogle.
              </p>
              <p className="reveal-right" style={{ transitionDelay: '0.45s' }}>
                عملت مع شركات كبرى مثل RE/MAX Barah وChubb Insurance وWE Telecommunications،
                بالإضافة إلى إدارة مشاريع مستقلة ناجحة في مصر والسعودية. أتميز بقدرتي على
                تطوير استراتيجيات تسويقية شاملة، وتدريب فرق المبيعات، وتحقيق نمو ملموس للأعمال.
              </p>
              <p className="reveal-right" style={{ transitionDelay: '0.6s' }}>
                أسعى دائماً لتحقيق نتائج استثنائية من خلال الجمع بين الإبداع والتحليل
                البيانات، مع التركيز على فهم احتياجات العميل وتقديم حلول تسويقية مبتكرة
                تتجاوز التوقعات.
              </p>
            </div>

            <a
              href="#contact"
              onClick={scrollToContact}
              className="reveal-right inline-flex items-center gap-2 mt-8 text-[#1A1A1A] hover:text-[#C4A265] transition-colors duration-300 group font-semibold"
              style={{ transitionDelay: '0.75s' }}
            >
              <span>تواصل معي</span>
              <ArrowUpLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1" />
            </a>
          </div>

          {/* Image */}
          <div
            className="lg:col-span-2 order-1 lg:order-2 reveal-left flex justify-center"
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="relative">
              <div className="w-72 h-80 md:w-80 md:h-96 lg:w-full lg:h-[28rem] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/about-portrait.png"
                  alt="مصطفى السيد في مكتبه"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-5 -left-5 w-full h-full border-2 border-[#C4A265]/20 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#C4A265]/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
