import { useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Sparkles, Users, Heart } from 'lucide-react'
import Layout from '../components/Layout'
import { useProfile } from '../context/ProfileContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { isProfileComplete } = useProfile()

  return (
    <Layout>
      <div className="flex flex-col items-center text-center gap-8 py-8">
        {/* Hero */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-primary-200">
            <img
              src="/unimatch-logo.png"
              alt="UniMatch logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            ברוכים/ות הבאים/ות ל-UniMatch
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
            מצא/י את המוסד האקדמי המושלם עבורך בכמה צעדים פשוטים
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-4 w-full max-w-sm">
          <FeatureCard
            icon={<Users className="w-5 h-5 text-primary-600" />}
            title="מלא/י פרופיל"
            description="ספר/י לנו על עצמך, הציונים והעדפות הלימודים שלך"
          />
          <FeatureCard
            icon={<Sparkles className="w-5 h-5 text-accent-600" />}
            title="קבל/י התאמות"
            description="אלגוריתם חכם ימצא את המוסדות המתאימים ביותר"
          />
          <FeatureCard
            icon={<Heart className="w-5 h-5 text-red-500" />}
            title="סמן/י מועדפים"
            description="עשה/י לייק למוסדות שמעניינים אותך וקבל/י מידע נוסף"
          />
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(isProfileComplete ? '/matches' : '/profile')}
          className="w-full max-w-sm bg-gradient-to-l from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl py-4 px-6 font-bold text-lg shadow-lg shadow-primary-200 transition-all hover:shadow-xl hover:shadow-primary-300 flex items-center justify-center gap-2"
        >
          <span>{isProfileComplete ? 'צפה/י בהתאמות' : 'בואו נתחיל!'}</span>
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isProfileComplete && (
          <button
            onClick={() => navigate('/profile')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium underline underline-offset-4"
          >
            עדכן/י פרופיל
          </button>
        )}
      </div>
    </Layout>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm border border-gray-100">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="text-right">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}
