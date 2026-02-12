import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Heart,
  X,
  MapPin,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import Layout from '../components/Layout'
import { useProfile } from '../context/ProfileContext'
import { getMatches } from '../utils/matching'
import { University } from '../types'
import { cn } from '../lib/utils'

export default function MatchesPage() {
  const navigate = useNavigate()
  const { profile, isProfileComplete, likedUniversities, toggleLike } = useProfile()
  const [matches, setMatches] = useState<University[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (!isProfileComplete) return
    const results = getMatches(profile)
    setMatches(results)
  }, [profile, isProfileComplete])

  if (!isProfileComplete) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              השלם/י את הפרופיל שלך
            </h2>
            <p className="text-gray-500">
              כדי לקבל התאמות, יש קודם למלא את הפרופיל
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 px-8 font-bold transition-colors"
          >
            מלא/י פרופיל
          </button>
        </div>
      </Layout>
    )
  }

  if (matches.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              לא נמצאו התאמות
            </h2>
            <p className="text-gray-500">
              נסה/י לעדכן את הפרופיל שלך או לשנות את תחומי הלימודים
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 px-8 font-bold transition-colors"
          >
            עדכן/י פרופיל
          </button>
        </div>
      </Layout>
    )
  }

  const currentMatch = matches[currentIndex]

  if (!currentMatch) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="text-6xl">🎉</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              סיימת לצפות בהתאמות!
            </h2>
            <p className="text-gray-500">
              {likedUniversities.length > 0
                ? `עשית לייק ל-${likedUniversities.length} מוסדות`
                : 'לא סימנת אף מוסד. רוצה לראות שוב?'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex(0)}
              className="border-2 border-primary-200 text-primary-600 rounded-xl py-3 px-6 font-bold hover:bg-primary-50 transition-colors"
            >
              צפה/י שוב
            </button>
            {likedUniversities.length > 0 && (
              <button
                onClick={() => navigate('/liked')}
                className="bg-primary-600 text-white rounded-xl py-3 px-6 font-bold hover:bg-primary-700 transition-colors"
              >
                צפה/י במועדפים
              </button>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    if (direction === 'right') {
      toggleLike(currentMatch.id)
    }
    setTimeout(() => {
      setSwipeDirection(null)
      setShowDetails(false)
      setCurrentIndex(prev => prev + 1)
    }, 400)
  }

  const isLiked = likedUniversities.includes(currentMatch.id)

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {/* Counter */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {matches.length} התאמות
          </span>
          <span className="text-sm font-bold text-primary-600">
            {currentMatch.matchScore}% התאמה
          </span>
        </div>

        {/* Card */}
        <div
          className={cn(
            'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-transform',
            swipeDirection === 'right' && 'animate-swipe-right',
            swipeDirection === 'left' && 'animate-swipe-left'
          )}
        >
          {/* Card Header */}
          <div className="bg-gradient-to-l from-primary-500 to-primary-600 p-6 text-white relative">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{currentMatch.logo}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{currentMatch.name}</h2>
                <div className="flex items-center gap-1 mt-1 opacity-90 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentMatch.location}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm opacity-80">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                    <span>{currentMatch.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{currentMatch.studentsCount.toLocaleString()} סטודנטים</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Match badge */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
              {currentMatch.matchScore}%
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {currentMatch.description}
            </p>

            {/* Match Reasons */}
            {currentMatch.matchReasons && currentMatch.matchReasons.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-2">למה זה מתאים לך:</h3>
                <div className="flex flex-col gap-1.5">
                  {currentMatch.matchReasons.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-accent-500 mt-0.5">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expandable Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-primary-600 font-medium mb-3"
            >
              {showDetails ? 'הסתר/י פרטים' : 'הצג/י פרטים נוספים'}
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showDetails && (
              <div className="space-y-3 text-sm pb-2">
                <div>
                  <span className="font-medium text-gray-700">תחומי לימוד: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentMatch.fields.map(f => (
                      <span
                        key={f}
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs',
                          profile.desiredField.includes(f)
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">סוג מוסד: </span>
                  <span className="text-gray-600">
                    {currentMatch.type === 'university' ? 'אוניברסיטה' : 'מכללה'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">דרישות מינימום: </span>
                  <span className="text-gray-600">
                    {currentMatch.minBagrut > 0
                      ? `בגרות ${currentMatch.minBagrut}+`
                      : 'ללא דרישת בגרות'}
                    {currentMatch.minPsychometric > 0
                      ? `, פסיכומטרי ${currentMatch.minPsychometric}+`
                      : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 py-2">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all group shadow-sm"
          >
            <X className="w-7 h-7 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm',
              isLiked
                ? 'bg-red-500 border-2 border-red-500'
                : 'border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 group'
            )}
          >
            <Heart
              className={cn(
                'w-7 h-7 transition-colors',
                isLiked
                  ? 'text-white fill-white'
                  : 'text-gray-400 group-hover:text-red-500'
              )}
            />
          </button>
        </div>
      </div>
    </Layout>
  )
}
