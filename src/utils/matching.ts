import { StudentProfile, University } from '../types'
import { universities } from '../data/universities'

export function getMatches(profile: StudentProfile): University[] {
  return universities
    .map(uni => {
      const { score, reasons } = calculateMatchScore(profile, uni)
      return { ...uni, matchScore: score, matchReasons: reasons }
    })
    .filter(uni => uni.matchScore! > 0)
    .sort((a, b) => b.matchScore! - a.matchScore!)
}

function calculateMatchScore(
  profile: StudentProfile,
  uni: University
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Field match (most important - up to 40 points)
  const fieldMatches = profile.desiredField.filter(f => uni.fields.includes(f))
  if (fieldMatches.length > 0) {
    const fieldScore = Math.min(40, fieldMatches.length * 15)
    score += fieldScore
    reasons.push(`תחומי לימוד מתאימים: ${fieldMatches.join(', ')}`)
  } else {
    return { score: 0, reasons: [] }
  }

  // Academic requirements (up to 20 points)
  const bagrutOk =
    profile.bagrutAverage === null || profile.bagrutAverage >= uni.minBagrut
  const psychOk =
    profile.psychometricScore === null ||
    profile.psychometricScore >= uni.minPsychometric

  if (bagrutOk && psychOk) {
    score += 20
    reasons.push('עומד בדרישות הקבלה')
  } else if (bagrutOk || psychOk) {
    score += 10
    reasons.push('עומד בחלק מדרישות הקבלה')
  } else {
    score -= 10
    reasons.push('ייתכן שלא עומד בדרישות הקבלה')
  }

  // Mechina
  if (profile.hasMechina && uni.acceptsMechina) {
    score += 10
    reasons.push('מקבל בוגרי מכינה')
  }

  // Location match (up to 15 points)
  const areaMap: Record<string, string[]> = {
    'north': ['north'],
    'haifa': ['north'],
    'center': ['center'],
    'tel-aviv': ['center'],
    'jerusalem': ['jerusalem'],
    'south': ['south'],
    'sharon': ['center'],
    'shfela': ['center', 'south'],
  }
  const studentAreas = areaMap[profile.residenceArea] || []
  if (studentAreas.includes(uni.area)) {
    score += 15
    reasons.push('קרוב לאזור מגוריך')
  }

  // Study time match (up to 10 points)
  if (profile.studyTime && uni.studyTimes.includes(profile.studyTime)) {
    score += 10
    reasons.push(
      profile.studyTime === 'morning'
        ? 'לימודי בוקר זמינים'
        : profile.studyTime === 'evening'
          ? 'לימודי ערב זמינים'
          : 'שעות גמישות'
    )
  }

  // Study format match (up to 10 points)
  if (profile.studyFormat && uni.studyFormats.includes(profile.studyFormat)) {
    score += 10
    reasons.push(
      profile.studyFormat === 'frontal'
        ? 'לימודים פרונטליים'
        : profile.studyFormat === 'online'
          ? 'לימודים אונליין'
          : 'לימודים היברידיים'
    )
  }

  // Budget match (up to 10 points)
  if (profile.budget) {
    const budgetOrder = ['low', 'medium', 'high', 'premium']
    const studentBudgetIdx = budgetOrder.indexOf(profile.budget)
    const uniBudgetIdx = budgetOrder.indexOf(uni.tuitionRange)
    if (uniBudgetIdx <= studentBudgetIdx) {
      score += 10
      reasons.push('בטווח התקציב שלך')
    }
  }

  // Normalize to 0-100
  const normalizedScore = Math.min(100, Math.max(0, Math.round((score / 115) * 100)))

  return { score: normalizedScore, reasons }
}
