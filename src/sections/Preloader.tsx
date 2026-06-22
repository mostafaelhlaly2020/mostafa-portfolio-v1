import { useEffect, useState } from 'react'

export default function Preloader() {
  const [hidden, setHidden] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 1500)

    // Remove from DOM after fade completes
    const hideTimer = setTimeout(() => {
      setHidden(true)
    }, 2000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (hidden) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #E6E2DD 0%, #D8D4CF 100%)',
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? 'hidden' : 'visible',
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
      }}
    >
      <div className="text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{
            color: '#1A1A1A',
            fontFamily: "'Cairo', sans-serif",
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          مصطفى السيد
        </h1>
        {/* Progress bar */}
        <div
          className="w-48 h-0.5 mx-auto rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(26, 26, 26, 0.1)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: '#C4A265',
              animation: 'loadBar 1.5s ease-in-out forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
