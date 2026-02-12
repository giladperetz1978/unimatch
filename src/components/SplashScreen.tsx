import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Book colors for the bookshelf
const BOOK_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#78716c',
  '#0ea5e9', '#10b981', '#eab308', '#e11d48', '#7c3aed',
]

const SHELF_ROWS = 4
const BOOKS_PER_ROW = 8

interface BookData {
  id: number
  row: number
  col: number
  color: string
  width: number
  height: number
  fallDelay: number
  fallDirection: number
  rotation: number
}

function generateBooks(): BookData[] {
  const books: BookData[] = []
  let id = 0
  for (let row = 0; row < SHELF_ROWS; row++) {
    for (let col = 0; col < BOOKS_PER_ROW; col++) {
      books.push({
        id: id++,
        row,
        col,
        color: BOOK_COLORS[id % BOOK_COLORS.length],
        width: 8 + Math.random() * 5,
        height: 80 + Math.random() * 20,
        fallDelay: Math.random() * 0.8,
        fallDirection: (Math.random() - 0.5) * 200,
        rotation: (Math.random() - 0.5) * 90,
      })
    }
  }
  return books
}

const AppIcon = () => (
  <svg viewBox="0 0 512 512" className="w-28 h-28 drop-shadow-2xl">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6366f1' }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
      </linearGradient>
      <linearGradient id="cap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fbbf24' }} />
        <stop offset="100%" style={{ stopColor: '#f59e0b' }} />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)" />
    <path d="M120 80 L120 320 Q120 432 256 432 Q392 432 392 320 L392 80 L332 80 L332 316 Q332 380 256 380 Q180 380 180 316 L180 80 Z" fill="white" />
    <polygon points="256,200 336,240 256,280 176,240" fill="url(#cap)" />
    <rect x="236" y="175" width="40" height="30" rx="4" fill="url(#cap)" />
    <circle cx="256" cy="175" r="8" fill="#f59e0b" />
    <path d="M256 175 Q240 185 230 175" stroke="#f59e0b" strokeWidth="3" fill="none" />
    <path d="M230 175 L220 210" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M216 210 L220 210 L224 210 L222 225 L218 225 Z" fill="#f59e0b" />
    <line x1="216" y1="225" x2="216" y2="235" stroke="#f59e0b" strokeWidth="2" />
    <line x1="218" y1="225" x2="218" y2="238" stroke="#f59e0b" strokeWidth="2" />
    <line x1="220" y1="225" x2="220" y2="236" stroke="#f59e0b" strokeWidth="2" />
    <line x1="222" y1="225" x2="222" y2="233" stroke="#f59e0b" strokeWidth="2" />
    <line x1="224" y1="225" x2="224" y2="230" stroke="#f59e0b" strokeWidth="2" />
  </svg>
)

/* ── DeLorean time machine with Marty, Doc & Einstein ── */
const DeLorean = () => (
  <svg viewBox="0 0 420 180" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.6))' }}>
    <defs>
      <linearGradient id="steel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#e5e7eb' }} />
        <stop offset="50%" style={{ stopColor: '#9ca3af' }} />
        <stop offset="100%" style={{ stopColor: '#6b7280' }} />
      </linearGradient>
      <linearGradient id="windshield" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#93c5fd' }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
      </linearGradient>
      <radialGradient id="flame1">
        <stop offset="0%" style={{ stopColor: '#fff' }} />
        <stop offset="30%" style={{ stopColor: '#60a5fa' }} />
        <stop offset="70%" style={{ stopColor: '#3b82f6' }} />
        <stop offset="100%" style={{ stopColor: 'transparent' }} />
      </radialGradient>
    </defs>

    {/* Fire trails behind the car */}
    <ellipse cx="400" cy="130" rx="35" ry="8" fill="url(#flame1)" opacity="0.9">
      <animate attributeName="rx" values="35;45;35" dur="0.15s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="410" cy="125" rx="25" ry="5" fill="#60a5fa" opacity="0.7">
      <animate attributeName="rx" values="25;35;25" dur="0.12s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="400" cy="135" rx="20" ry="4" fill="#93c5fd" opacity="0.5">
      <animate attributeName="rx" values="20;30;20" dur="0.1s" repeatCount="indefinite" />
    </ellipse>

    {/* ── Car body ── */}
    {/* Main body */}
    <path d="M40,135 L40,105 L80,105 L100,70 L280,65 L310,100 L370,100 L380,115 L380,135 Z"
      fill="url(#steel)" stroke="#4b5563" strokeWidth="1.5" />
    {/* Hood */}
    <path d="M310,100 L370,100 L380,115 L380,135 L340,135 L310,135 Z"
      fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
    {/* Roof line */}
    <path d="M100,70 L120,50 L240,48 L280,65"
      fill="#d1d5db" stroke="#6b7280" strokeWidth="1.5" />

    {/* Windshield */}
    <path d="M240,50 L275,67 L270,95 L220,95 L220,52 Z"
      fill="url(#windshield)" opacity="0.8" stroke="#4b5563" strokeWidth="1" />
    {/* Rear window */}
    <path d="M105,72 L120,52 L155,50 L155,90 L105,90 Z"
      fill="url(#windshield)" opacity="0.7" stroke="#4b5563" strokeWidth="1" />
    {/* Side window */}
    <path d="M155,50 L220,50 L220,92 L155,92 Z"
      fill="url(#windshield)" opacity="0.75" stroke="#4b5563" strokeWidth="1" />

    {/* Door line (gull-wing hint) */}
    <line x1="155" y1="50" x2="155" y2="130" stroke="#6b7280" strokeWidth="1.5" />
    <line x1="220" y1="50" x2="220" y2="130" stroke="#6b7280" strokeWidth="1.5" />

    {/* ── Flux capacitor / time circuits on back ── */}
    <rect x="55" y="90" width="35" height="25" rx="3" fill="#374151" stroke="#4b5563" strokeWidth="1" />
    <circle cx="65" cy="100" r="3" fill="#ef4444">
      <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="75" cy="100" r="3" fill="#22c55e">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="65" cy="108" r="3" fill="#3b82f6">
      <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite" />
    </circle>
    <circle cx="75" cy="108" r="3" fill="#fbbf24">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="0.4s" repeatCount="indefinite" />
    </circle>

    {/* ── Mr. Fusion on top ── */}
    <rect x="95" y="40" width="20" height="14" rx="3" fill="#78716c" stroke="#57534e" strokeWidth="1" />
    <rect x="98" y="34" width="14" height="8" rx="2" fill="#a8a29e" stroke="#78716c" strokeWidth="1" />

    {/* ── Wheels ── */}
    <circle cx="120" cy="140" r="18" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    <circle cx="120" cy="140" r="10" fill="#6b7280" />
    <circle cx="120" cy="140" r="4" fill="#9ca3af" />
    <circle cx="330" cy="140" r="18" fill="#1f2937" stroke="#374151" strokeWidth="2" />
    <circle cx="330" cy="140" r="10" fill="#6b7280" />
    <circle cx="330" cy="140" r="4" fill="#9ca3af" />

    {/* Wheel glow (hovering/flying effect) */}
    <ellipse cx="120" cy="160" rx="16" ry="4" fill="#60a5fa" opacity="0.5">
      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.3s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="330" cy="160" rx="16" ry="4" fill="#60a5fa" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.3;0.5" dur="0.3s" repeatCount="indefinite" />
    </ellipse>

    {/* ── Doc (driver side, left) ── */}
    {/* Head */}
    <circle cx="185" cy="62" r="12" fill="#fde68a" />
    {/* Wild white hair */}
    <path d="M173,58 Q170,45 178,42 Q183,38 188,42 Q193,38 198,42 Q203,45 197,58"
      fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
    <path d="M173,55 Q168,50 172,46" stroke="white" strokeWidth="2" fill="none" />
    <path d="M197,55 Q202,50 198,46" stroke="white" strokeWidth="2" fill="none" />
    {/* Goggles */}
    <rect x="177" y="58" width="8" height="6" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="0.8" />
    <rect x="187" y="58" width="8" height="6" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="0.8" />
    <line x1="185" y1="61" x2="187" y2="61" stroke="#92400e" strokeWidth="0.8" />
    {/* Mouth */}
    <path d="M182,70 Q186,73 190,70" stroke="#92400e" strokeWidth="1" fill="none" />
    {/* Lab coat body */}
    <rect x="177" y="74" width="18" height="18" rx="3" fill="white" stroke="#d1d5db" strokeWidth="0.8" />
    {/* Arms on wheel */}
    <line x1="177" y1="80" x2="170" y2="88" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <line x1="195" y1="80" x2="202" y2="88" stroke="white" strokeWidth="3" strokeLinecap="round" />

    {/* ── Marty (passenger, right) ── */}
    {/* Head */}
    <circle cx="250" cy="66" r="11" fill="#fde68a" />
    {/* Brown hair (80s style) */}
    <path d="M239,62 Q239,52 250,50 Q261,52 261,62"
      fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
    {/* Eyes */}
    <circle cx="246" cy="65" r="1.5" fill="#1f2937" />
    <circle cx="254" cy="65" r="1.5" fill="#1f2937" />
    {/* Mouth */}
    <path d="M246,71 Q250,73 254,71" stroke="#92400e" strokeWidth="0.8" fill="none" />
    {/* Red/orange vest */}
    <rect x="241" y="77" width="18" height="15" rx="2" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" />
    {/* Jean jacket underneath */}
    <rect x="243" y="79" width="14" height="11" rx="1" fill="#3b82f6" stroke="#2563eb" strokeWidth="0.5" />
    {/* Arms */}
    <line x1="241" y1="82" x2="235" y2="88" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    <line x1="259" y1="82" x2="265" y2="88" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

    {/* ── Einstein the dog (back seat between them) ── */}
    {/* Body */}
    <ellipse cx="218" cy="82" rx="10" ry="7" fill="#d4a574" stroke="#b8860b" strokeWidth="0.5" />
    {/* Head */}
    <circle cx="218" cy="68" r="8" fill="#d4a574" stroke="#b8860b" strokeWidth="0.5" />
    {/* Ears */}
    <ellipse cx="212" cy="63" rx="4" ry="6" fill="#c4956a" transform="rotate(-15 212 63)" />
    <ellipse cx="224" cy="63" rx="4" ry="6" fill="#c4956a" transform="rotate(15 224 63)" />
    {/* Eyes */}
    <circle cx="215" cy="67" r="1.8" fill="#1f2937" />
    <circle cx="221" cy="67" r="1.8" fill="#1f2937" />
    <circle cx="215.5" cy="66.5" r="0.6" fill="white" />
    <circle cx="221.5" cy="66.5" r="0.6" fill="white" />
    {/* Nose */}
    <ellipse cx="218" cy="72" rx="2.5" ry="1.8" fill="#1f2937" />
    {/* Tongue */}
    <path d="M217,74 Q218,78 219,74" fill="#ef4444" stroke="#dc2626" strokeWidth="0.3" />

    {/* ── Rope/cable to pull curtain ── */}
    <line x1="38" y1="120" x2="0" y2="120" stroke="#78716c" strokeWidth="3" strokeDasharray="6,3" />

    {/* Time-travel lightning effect around car */}
    <path d="M50,80 L45,95 L55,90 L48,110" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.2;0.9;0.4;0.7" dur="0.3s" repeatCount="indefinite" />
    </path>
    <path d="M360,75 L365,90 L355,85 L362,105" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.7">
      <animate attributeName="opacity" values="0.4;0.9;0.2;0.7;0.4" dur="0.25s" repeatCount="indefinite" />
    </path>
  </svg>
)

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'slogan' | 'bookshelf' | 'delorean' | 'done'>('slogan')
  const [books] = useState(generateBooks)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play Back to the Future theme
  useEffect(() => {
    const audio = new Audio('/bttf-theme.mp3')
    audio.volume = 0.5
    audioRef.current = audio
    const playPromise = audio.play()
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked - try on first interaction
        const handleInteraction = () => {
          audio.play().catch(() => {})
          document.removeEventListener('click', handleInteraction)
          document.removeEventListener('touchstart', handleInteraction)
        }
        document.addEventListener('click', handleInteraction)
        document.addEventListener('touchstart', handleInteraction)
      })
    }
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    // Phase 1: Show slogan for 2.5 seconds
    const sloganTimer = setTimeout(() => {
      setPhase('bookshelf')
    }, 2500)
    return () => clearTimeout(sloganTimer)
  }, [])

  useEffect(() => {
    if (phase === 'bookshelf') {
      // Phase 2: Books fall for ~2s, then DeLorean enters
      const fallTimer = setTimeout(() => {
        setPhase('delorean')
      }, 2200)
      return () => clearTimeout(fallTimer)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'delorean') {
      // Phase 3: DeLorean flies + curtain pull ~2.8s, then done
      const deloreanTimer = setTimeout(() => {
        // Fade out music
        if (audioRef.current) {
          const audio = audioRef.current
          const fadeInterval = setInterval(() => {
            if (audio.volume > 0.05) {
              audio.volume = Math.max(0, audio.volume - 0.05)
            } else {
              clearInterval(fadeInterval)
              audio.pause()
            }
          }, 50)
        }
        setPhase('done')
        onFinish()
      }, 2800)
      return () => clearTimeout(deloreanTimer)
    }
  }, [phase, onFinish])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Phase 1: Slogan */}
          <AnimatePresence>
            {phase === 'slogan' && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <AppIcon />
                </motion.div>

                <motion.h1
                  className="text-white text-2xl sm:text-3xl font-bold mt-8 text-center px-6 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  style={{ fontFamily: 'Heebo, sans-serif' }}
                >
                  העתיד שלך מתחיל/ה ב-
                  <span className="text-amber-400 block text-4xl sm:text-5xl mt-2 tracking-wider">
                    UNIMATCH
                  </span>
                </motion.h1>

                <motion.div
                  className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mt-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Bookshelf with falling books */}
          {(phase === 'bookshelf' || phase === 'delorean') && (
            <motion.div
              className="absolute inset-0 bg-amber-950"
              animate={phase === 'delorean' ? { x: '-100%' } : { x: 0 }}
              transition={phase === 'delorean' ? { duration: 2, ease: [0.4, 0, 0.2, 1], delay: 0.6 } : {}}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-amber-950" />

              {Array.from({ length: SHELF_ROWS }).map((_, rowIdx) => {
                const rowTop = (rowIdx / SHELF_ROWS) * 100
                const rowHeight = 100 / SHELF_ROWS

                return (
                  <div
                    key={rowIdx}
                    className="absolute w-full"
                    style={{
                      top: `${rowTop}%`,
                      height: `${rowHeight}%`,
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-amber-700 to-amber-800 shadow-lg z-10" />

                    <div className="absolute bottom-2 sm:bottom-3 left-2 right-2 flex items-end gap-[2px] h-[calc(100%-12px)]">
                      {books
                        .filter((b) => b.row === rowIdx)
                        .map((book) => (
                          <motion.div
                            key={book.id}
                            className="relative rounded-sm shadow-md flex-shrink-0"
                            style={{
                              width: `${book.width}%`,
                              height: `${Math.min(book.height, 95)}%`,
                              backgroundColor: book.color,
                              borderRight: '1px solid rgba(0,0,0,0.15)',
                              borderLeft: '1px solid rgba(255,255,255,0.1)',
                            }}
                            initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                            animate={phase === 'bookshelf' ? {
                              y: [0, -10, 800],
                              x: [0, 0, book.fallDirection],
                              rotate: [0, -2, book.rotation],
                              opacity: [1, 1, 0],
                            } : {}}
                            transition={{
                              duration: 1.2,
                              delay: book.fallDelay,
                              ease: [0.55, 0, 1, 0.45],
                            }}
                          >
                            <div className="absolute inset-x-0 top-2 bottom-2 mx-auto w-[2px] bg-black/10" />
                            <div
                              className="absolute top-1/3 left-1/4 right-1/4 h-[2px] rounded-full"
                              style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                            />
                            <div
                              className="absolute top-[40%] left-1/3 right-1/3 h-[1px] rounded-full"
                              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            />
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )
              })}

              <div className="absolute top-0 bottom-0 left-0 w-2 sm:w-3 bg-gradient-to-r from-amber-800 to-amber-700 z-20" />
              <div className="absolute top-0 bottom-0 right-0 w-2 sm:w-3 bg-gradient-to-l from-amber-800 to-amber-700 z-20" />
              <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-amber-800 to-amber-700 z-20" />
            </motion.div>
          )}

          {/* Phase 3: DeLorean flies from right to left, pulling the curtain */}
          {phase === 'delorean' && (
            <>
              {/* Speed lines / time-travel streaks in background */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`streak-${i}`}
                  className="absolute h-[2px] bg-gradient-to-l from-cyan-400 to-transparent"
                  style={{
                    top: `${10 + (i * 7)}%`,
                    width: `${30 + Math.random() * 40}%`,
                    right: '0',
                    opacity: 0,
                  }}
                  animate={{
                    x: [200, -window.innerWidth * 1.5],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 + i * 0.08,
                    ease: 'easeIn',
                  }}
                />
              ))}

              {/* DeLorean car */}
              <motion.div
                className="absolute z-[10001]"
                style={{
                  width: '320px',
                  height: '140px',
                  top: '35%',
                }}
                initial={{ x: window.innerWidth + 100 }}
                animate={{ x: -500 }}
                transition={{
                  duration: 2.5,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.1,
                }}
              >
                <DeLorean />
              </motion.div>

              {/* Glowing trail following the car */}
              <motion.div
                className="absolute z-[10000] top-[38%] h-[80px] pointer-events-none"
                style={{
                  background: 'linear-gradient(to left, transparent, rgba(96,165,250,0.3) 20%, rgba(96,165,250,0.1) 80%, transparent)',
                  width: '100%',
                }}
                initial={{ x: window.innerWidth + 200, opacity: 0 }}
                animate={{ x: -window.innerWidth, opacity: [0, 0.8, 0.6, 0] }}
                transition={{
                  duration: 2.5,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.2,
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
