import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProfileProvider } from './context/ProfileContext'
import HomePage from './pages/HomePage'
import ProfileWizard from './pages/ProfileWizard'
import MatchesPage from './pages/MatchesPage'
import LikedPage from './pages/LikedPage'
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false)
  }, [])

  return (
    <ProfileProvider>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfileWizard />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/liked" element={<LikedPage />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  )
}

export default App
