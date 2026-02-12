import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Star, Users, Trash2, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import { useProfile } from '../context/ProfileContext'
import { universities } from '../data/universities'
import { cn } from '../lib/utils'

export default function LikedPage() {
  const navigate = useNavigate()
  const { likedUniversities, toggleLike } = useProfile()

  const likedItems = universities.filter(u => likedUniversities.includes(u.id))

  if (likedItems.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <Heart className="w-16 h-16 text-gray-300" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              אין מועדפים עדיין
            </h2>
            <p className="text-gray-500">
              עבור/י לדף ההתאמות ועשה/י לייק למוסדות שמעניינים אותך
            </p>
          </div>
          <button
            onClick={() => navigate('/matches')}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 px-8 font-bold transition-colors flex items-center gap-2"
          >
            <span>צפה/י בהתאמות</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            המועדפים שלך
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {likedItems.length} מוסדות
          </span>
        </div>

        <p className="text-sm text-gray-500">
          המוסדות שסימנת יקבלו את פרטיך וייצרו איתך קשר
        </p>

        <div className="flex flex-col gap-3">
          {likedItems.map(uni => (
            <div
              key={uni.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3"
            >
              <div className="text-3xl flex-shrink-0">{uni.logo}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{uni.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{uni.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{uni.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{uni.studentsCount.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                  {uni.description}
                </p>
              </div>
              <button
                onClick={() => toggleLike(uni.id)}
                className={cn(
                  'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all',
                  'hover:bg-red-50 text-gray-400 hover:text-red-500'
                )}
                title="הסר/י מהמועדפים"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Lead CTA */}
        <div className="bg-gradient-to-l from-accent-50 to-accent-100 rounded-2xl p-5 border border-accent-200 mt-4">
          <h3 className="font-bold text-accent-800 mb-1">
            🎓 המוסדות יקבלו את הפניה שלך!
          </h3>
          <p className="text-sm text-accent-700">
            הפרטים שלך יועברו למוסדות שסימנת כמועדפים/ות, והם ייצרו איתך קשר
            עם מידע נוסף על תוכניות הלימודים.
          </p>
        </div>
      </div>
    </Layout>
  )
}
