import { useEffect, useRef, useState } from 'react'
import { contact, iconMap } from '@/lib/data'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal-left, .reveal-right')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-light py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal-right inline-block text-sm text-[#6B6B6B] mb-4 font-medium">
            {contact.label.ar}
          </span>
          <h2
            className="reveal-right text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ transitionDelay: '0.15s' }}
          >
            {contact.heading.ar} <span className="text-[#C4A265]">{contact.highlight.ar}</span>
          </h2>
          <p
            className="reveal-right mt-4 text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto"
            style={{ transitionDelay: '0.3s' }}
          >
            {contact.subtitle.ar}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <div
            className="reveal-right bg-white rounded-2xl p-8 md:p-10"
            style={{
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(26, 26, 26, 0.08)',
              transitionDelay: '0.45s',
            }}
          >
            {submitted ? (
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(196, 162, 101, 0.15)' }}
                >
                  <svg
                    className="w-8 h-8 text-[#C4A265]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                  {contact.successTitle.ar}
                </h3>
                <p className="text-[#6B6B6B]">
                  {contact.successMessage.ar}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {contact.formFields[0].label.ar}
                  </label>
                  <input
                    type={contact.formFields[0].type}
                    required={contact.formFields[0].required}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={contact.formFields[0].placeholder.ar}
                    className="w-full px-4 py-3.5 rounded-lg text-[#1A1A1A] placeholder-[#6B6B6B] outline-none transition-all duration-300 focus:ring-2"
                    style={{
                      backgroundColor: '#F5F0EB',
                      border: '1px solid rgba(26, 26, 26, 0.12)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C4A265'
                      e.currentTarget.style.boxShadow =
                        '0 0 0 3px rgba(196, 162, 101, 0.15)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(26, 26, 26, 0.12)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {contact.formFields[1].label.ar}
                  </label>
                  <input
                    type={contact.formFields[1].type}
                    required={contact.formFields[1].required}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={contact.formFields[1].placeholder.ar}
                    className="w-full px-4 py-3.5 rounded-lg text-[#1A1A1A] placeholder-[#6B6B6B] outline-none transition-all duration-300 focus:ring-2"
                    style={{
                      backgroundColor: '#F5F0EB',
                      border: '1px solid rgba(26, 26, 26, 0.12)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C4A265'
                      e.currentTarget.style.boxShadow =
                        '0 0 0 3px rgba(196, 162, 101, 0.15)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(26, 26, 26, 0.12)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {contact.formFields[2].label.ar}
                  </label>
                  <input
                    type={contact.formFields[2].type}
                    required={contact.formFields[2].required}
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder={contact.formFields[2].placeholder.ar}
                    className="w-full px-4 py-3.5 rounded-lg text-[#1A1A1A] placeholder-[#6B6B6B] outline-none transition-all duration-300 focus:ring-2"
                    style={{
                      backgroundColor: '#F5F0EB',
                      border: '1px solid rgba(26, 26, 26, 0.12)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C4A265'
                      e.currentTarget.style.boxShadow =
                        '0 0 0 3px rgba(196, 162, 101, 0.15)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(26, 26, 26, 0.12)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    {contact.formFields[3].label.ar}
                  </label>
                  <textarea
                    required={contact.formFields[3].required}
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={contact.formFields[3].placeholder.ar}
                    className="w-full px-4 py-3.5 rounded-lg text-[#1A1A1A] placeholder-[#6B6B6B] outline-none transition-all duration-300 focus:ring-2 resize-none"
                    style={{
                      backgroundColor: '#F5F0EB',
                      border: '1px solid rgba(26, 26, 26, 0.12)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C4A265'
                      e.currentTarget.style.boxShadow =
                        '0 0 0 3px rgba(196, 162, 101, 0.15)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(26, 26, 26, 0.12)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#2D2D2D' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C4A265'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2D2D2D'
                  }}
                >
                  {contact.submitButton.ar}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6" style={{ transitionDelay: '0.6s' }}>
            <h3
              className="reveal-left text-2xl font-bold text-[#1A1A1A] mb-8"
              style={{ transitionDelay: '0.45s' }}
            >
              {contact.infoLabel.ar}
            </h3>

            <div className="space-y-4">
              {contact.methods.map((item, index) => {
                const Icon = iconMap[item.icon]
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="reveal-left flex items-center gap-4 p-5 rounded-xl transition-all duration-300 group"
                    style={{
                      backgroundColor: '#F5F0EB',
                      border: '1px solid rgba(26, 26, 26, 0.06)',
                      transitionDelay: `${0.6 + index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(196, 162, 101, 0.3)'
                      e.currentTarget.style.transform = 'translateX(-4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(26, 26, 26, 0.06)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(196, 162, 101, 0.1)' }}
                    >
                      <Icon className="w-5 h-5 text-[#C4A265]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B6B6B] mb-0.5">
                        {item.label.ar}
                      </p>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {typeof item.value === 'string' ? item.value : item.value.ar}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
