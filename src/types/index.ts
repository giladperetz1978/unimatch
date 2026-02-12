export interface StudentProfile {
  // Personal
  firstName: string
  lastName: string
  email: string
  phone: string

  // Location
  residenceArea: string

  // Academic
  bagrutAverage: number | null
  psychometricScore: number | null
  hasMechina: boolean
  mechinaDetails: string

  // Current education
  currentEducation: EducationLevel

  // Preferences
  desiredField: string[]
  hobbies: string[]
  studyTime: StudyTime
  budget: BudgetRange
  studyFormat: StudyFormat
}

export type EducationLevel =
  | ''
  | 'highschool'
  | 'mechina'
  | 'first-degree'
  | 'second-degree'
  | 'other'

export type StudyTime = '' | 'morning' | 'evening' | 'flexible'

export type BudgetRange =
  | ''
  | 'low'      // עד 10,000 ₪
  | 'medium'   // 10,000-20,000 ₪
  | 'high'     // 20,000-35,000 ₪
  | 'premium'  // 35,000+ ₪

export type StudyFormat = '' | 'frontal' | 'online' | 'hybrid'

export interface University {
  id: string
  name: string
  logo: string
  type: 'university' | 'college' | 'mechina'
  location: string
  area: string
  description: string
  fields: string[]
  studyFormats: StudyFormat[]
  studyTimes: StudyTime[]
  tuitionRange: BudgetRange
  minBagrut: number
  minPsychometric: number
  acceptsMechina: boolean
  rating: number
  studentsCount: number
  matchScore?: number
  matchReasons?: string[]
}

export interface Lead {
  studentId: string
  universityId: string
  timestamp: Date
  profile: StudentProfile
}
