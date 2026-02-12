import { useState, useEffect } from 'react'
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
        width: 8 + Math.random() * 5, // percentage width
        height: 80 + Math.random() * 20, // pixel height
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

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'slogan' | 'bookshelf' | 'done'>('slogan')
  const [books] = useState(generateBooks)

  useEffect(() => {
    // Phase 1: Show slogan for 2.5 seconds
    const sloganTimer = setTimeout(() => {
      setPhase('bookshelf')
    }, 2500)

    return () => clearTimeout(sloganTimer)
  }, [])

  useEffect(() => {
    if (phase === 'bookshelf') {
      // Phase 2: Books fall for ~2 seconds, then done
      const fallTimer = setTimeout(() => {
        setPhase('done')
        onFinish()
      }, 2200)
      return () => clearTimeout(fallTimer)
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
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <AppIcon />
                </motion.div>

                {/* Slogan */}
                <motion.h1
                  className="text-white text-2xl sm:text-3xl font-bold mt-8 text-center px-6 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  style={{ fontFamily: 'Heebo, sans-serif' }}
                >
                  העתיד שלך מתחיל ב-
                  <span className="text-amber-400 block text-4xl sm:text-5xl mt-2 tracking-wider">
                    UNIMATCH
                  </span>
                </motion.h1>

                {/* Subtle shimmer line */}
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
          {phase === 'bookshelf' && (
            <div className="absolute inset-0 bg-amber-950">
              {/* Bookshelf background - wooden texture */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-amber-950" />

              {/* Shelf rows */}
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
                    {/* Shelf plank */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-amber-700 to-amber-800 shadow-lg z-10"
                    />

                    {/* Books on this shelf */}
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
                            animate={{
                              y: [0, -10, 800],
                              x: [0, 0, book.fallDirection],
                              rotate: [0, -2, book.rotation],
                              opacity: [1, 1, 0],
                            }}
                            transition={{
                              duration: 1.2,
                              delay: book.fallDelay,
                              ease: [0.55, 0, 1, 0.45],
                            }}
                          >
                            {/* Book spine detail */}
                            <div className="absolute inset-x-0 top-2 bottom-2 mx-auto w-[2px] bg-black/10" />
                            {/* Book title line */}
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

              {/* Shelf side panels */}
              <div className="absolute top-0 bottom-0 left-0 w-2 sm:w-3 bg-gradient-to-r from-amber-800 to-amber-700 z-20" />
              <div className="absolute top-0 bottom-0 right-0 w-2 sm:w-3 bg-gradient-to-l from-amber-800 to-amber-700 z-20" />
              <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-gradient-to-b from-amber-800 to-amber-700 z-20" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
