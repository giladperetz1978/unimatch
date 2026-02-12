import { useNavigate, useLocation } from 'react-router-dom'
import { Home, User, Heart, GraduationCap } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { cn } from '../lib/utils'

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { likedUniversities } = useProfile()

  const navItems = [
    { path: '/', icon: Home, label: 'בית' },
    { path: '/profile', icon: User, label: 'פרופיל' },
    { path: '/matches', icon: GraduationCap, label: 'התאמות' },
    { path: '/liked', icon: Heart, label: 'מועדפים', badge: likedUniversities.length },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary-600" />
            <h1 className="text-xl font-bold text-primary-700">UniMatch</h1>
          </div>
          <span className="text-xs text-gray-400">מצא/י את המוסד המושלם</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <div className="max-w-lg mx-auto flex justify-around">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center py-2 px-4 transition-colors relative',
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                {item.badge ? (
                  <span className="absolute -top-0.5 right-2 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
