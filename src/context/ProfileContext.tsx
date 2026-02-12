import { createContext, useContext, useState, ReactNode } from 'react'
import { StudentProfile } from '../types'

const defaultProfile: StudentProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  residenceArea: '',
  bagrutAverage: null,
  psychometricScore: null,
  hasMechina: false,
  mechinaDetails: '',
  currentEducation: '',
  desiredField: [],
  hobbies: [],
  studyTime: '',
  budget: '',
  studyFormat: '',
}

interface ProfileContextType {
  profile: StudentProfile
  updateProfile: (updates: Partial<StudentProfile>) => void
  resetProfile: () => void
  isProfileComplete: boolean
  likedUniversities: string[]
  toggleLike: (universityId: string) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('unimatch-profile')
    return saved ? JSON.parse(saved) : defaultProfile
  })

  const [likedUniversities, setLikedUniversities] = useState<string[]>(() => {
    const saved = localStorage.getItem('unimatch-liked')
    return saved ? JSON.parse(saved) : []
  })

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('unimatch-profile', JSON.stringify(updated))
      return updated
    })
  }

  const resetProfile = () => {
    setProfile(defaultProfile)
    localStorage.removeItem('unimatch-profile')
  }

  const toggleLike = (universityId: string) => {
    setLikedUniversities(prev => {
      const updated = prev.includes(universityId)
        ? prev.filter(id => id !== universityId)
        : [...prev, universityId]
      localStorage.setItem('unimatch-liked', JSON.stringify(updated))
      return updated
    })
  }

  const isProfileComplete =
    profile.firstName !== '' &&
    profile.residenceArea !== '' &&
    profile.desiredField.length > 0 &&
    profile.studyTime !== '' &&
    profile.budget !== '' &&
    profile.studyFormat !== ''

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        isProfileComplete,
        likedUniversities,
        toggleLike,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}
