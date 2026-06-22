import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    text: 'مصطفى من أفضل الناس اللي اشتغلت معاها في التسويق العقاري. شغله احترافي والنتائج بتتكلم عن نفسها. الحملات الإعلانية اللي عملها جابت نتائج ممتازة وبيعت وحدات في وقت قياسي.',
    name: 'علي عمران',
    role: 'الرئيس التنفيذي - شركة العمران للاستثمار العقاري',
    initial: 'ع',
  },
  {
    text: 'الشغل مع مصطفى كان تجربة ممتازة. فاهم جداً في التسويق الرقمي وبيعرف يوصل للجمهور المستهدف بكفاءة. الحملات على TikTok وInstagram كانت ناجحة جداً لمقهى كفة.',
    name: 'محمد أحمد',
    role: 'صاحب كفة كافيه - أسيوط',
    initial: 'م',
  },
  {
    text: 'مصطفى ساعدنا في إعادة بناء علامتنا التجارية في السوق السعودي. الاستراتيجية التسويقية كانت ممتازة والنتائج فاقت التوقعات. بنصح أي حد يشتغل معاه.',
    name: 'فهد السبيعي',
    role: 'مدير التسويق - بهجة الدار - الرياض',
    initial: 'ف',
  },
]

const companies = [
  'RE/MAX',
  'Chubb',
  'WE',
  'VIVO',
  'Kayan',
  'Coursera',
  'Udemy',
  'Almentor',
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal')
            elements.forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 150)
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

  const goTo = (index: number) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const next = () => goTo((current + 1) % testimonials.length)
  const prev = () =>
    goTo((current - 1 + testimonials.length) % testimonials.length)

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-beige py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal inline-block text-sm text-[#6B6B6B] mb-4 font-medium">
            آراء العملاء
          </span>
          <h2
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ transitionDelay: '0.15s' }}
          >
            ماذا يقول <span className="text-[#C4A265]">عملائي</span>
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto"
            style={{ transitionDelay: '0.3s' }}
          >
            شهادات من شركاء وعملاء عملت معهم على مدار السنوات
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="reveal relative" style={{ transitionDelay: '0.45s' }}>
          <div className="bg-white rounded-2xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <span
              className="text-5xl md:text-6xl font-serif leading-none block mb-6"
              style={{ color: '#C4A265' }}
            >
              &#10077;
            </span>

            {/* Testimonial Content */}
            <div className="min-h-[120px]">
              <p
                key={current}
                className="text-base md:text-lg text-[#1A1A1A] leading-relaxed mb-8"
                style={{
                  animation: 'fadeIn 0.5s ease-in-out',
                }}
              >
                {testimonials[current].text}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#C4A265' }}
              >
                {testimonials[current].initial}
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A]">
                  {testimonials[current].name}
                </h4>
                <p className="text-sm text-[#6B6B6B]">
                  {testimonials[current].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#2D2D2D' }}
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 mx-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '24px' : '8px',
                    backgroundColor: i === current ? '#C4A265' : '#D1D1D1',
                  }}
                  aria-label={`شهادة ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#2D2D2D' }}
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Company Marquee */}
      <div className="mt-20 overflow-hidden">
        <div className="marquee-track">
          {[...companies, ...companies].map((company, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-8 md:mx-12"
            >
              <span
                className="text-xl md:text-2xl font-bold whitespace-nowrap"
                style={{ color: 'rgba(26, 26, 26, 0.2)' }}
              >
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
