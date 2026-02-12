import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import Layout from '../components/Layout'
import { useProfile } from '../context/ProfileContext'
import { AREAS, FIELDS_OF_STUDY, HOBBIES } from '../data/universities'
import { cn } from '../lib/utils'

const STEPS = [
  'פרטים אישיים',
  'אזור מגורים',
  'נתונים אקדמיים',
  'תחום לימודים',
  'העדפות לימודים',
  'תחביבים',
]

export default function ProfileWizard() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [step, setStep] = useState(0)

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else navigate('/matches')
  }
  const prevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              שלב {step + 1} מתוך {STEPS.length}
            </span>
            <span className="text-sm font-bold text-primary-600">{STEPS[step]}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-primary-400 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[320px]">
          {step === 0 && StepPersonal()}
          {step === 1 && StepLocation()}
          {step === 2 && StepAcademic()}
          {step === 3 && StepFields()}
          {step === 4 && StepPreferences()}
          {step === 5 && StepHobbies()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              <span>הקודם</span>
            </button>
          )}
          <button
            onClick={nextStep}
            className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors flex items-center justify-center gap-1 shadow-md"
          >
            <span>{step === STEPS.length - 1 ? 'צפה בהתאמות' : 'הבא'}</span>
            {step === STEPS.length - 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </Layout>
  )

  function StepPersonal() {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900">ספר לנו על עצמך</h2>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="שם פרטי"
            value={profile.firstName}
            onChange={v => updateProfile({ firstName: v })}
            placeholder="ישראל"
          />
          <InputField
            label="שם משפחה"
            value={profile.lastName}
            onChange={v => updateProfile({ lastName: v })}
            placeholder="ישראלי"
          />
        </div>
        <InputField
          label="אימייל"
          type="email"
          value={profile.email}
          onChange={v => updateProfile({ email: v })}
          placeholder="email@example.com"
          dir="ltr"
        />
        <InputField
          label="טלפון"
          type="tel"
          value={profile.phone}
          onChange={v => updateProfile({ phone: v })}
          placeholder="050-1234567"
          dir="ltr"
        />
      </div>
    )
  }

  function StepLocation() {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900">איפה אתה גר?</h2>
        <p className="text-sm text-gray-500">בחר את האזור הקרוב למקום מגוריך</p>
        <div className="grid grid-cols-2 gap-3">
          {AREAS.map(area => (
            <button
              key={area.value}
              onClick={() => updateProfile({ residenceArea: area.value })}
              className={cn(
                'p-4 rounded-xl border-2 text-center font-medium transition-all',
                profile.residenceArea === area.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              )}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  function StepAcademic() {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900">נתונים אקדמיים</h2>
        <InputField
          label="ממוצע בגרות"
          type="number"
          value={profile.bagrutAverage?.toString() || ''}
          onChange={v => updateProfile({ bagrutAverage: v ? Number(v) : null })}
          placeholder="85"
        />
        <InputField
          label="ציון פסיכומטרי"
          type="number"
          value={profile.psychometricScore?.toString() || ''}
          onChange={v => updateProfile({ psychometricScore: v ? Number(v) : null })}
          placeholder="650"
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">השכלה נוכחית</label>
          <select
            value={profile.currentEducation}
            onChange={e =>
              updateProfile({
                currentEducation: e.target.value as StudentProfile['currentEducation'],
              })
            }
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none bg-white text-gray-700"
          >
            <option value="">בחר</option>
            <option value="highschool">תיכון</option>
            <option value="mechina">מכינה</option>
            <option value="first-degree">תואר ראשון (בלימודים)</option>
            <option value="second-degree">תואר שני</option>
            <option value="other">אחר</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="mechina"
            checked={profile.hasMechina}
            onChange={e => updateProfile({ hasMechina: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="mechina" className="text-sm font-medium text-gray-700">
            למדתי/לומד במכינה קדם-אקדמית
          </label>
        </div>
      </div>
    )
  }

  function StepFields() {
    const toggleField = (field: string) => {
      const current = profile.desiredField
      updateProfile({
        desiredField: current.includes(field)
          ? current.filter(f => f !== field)
          : [...current, field],
      })
    }

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900">מה תרצה ללמוד?</h2>
        <p className="text-sm text-gray-500">בחר תחום אחד או יותר</p>
        <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-1">
          {FIELDS_OF_STUDY.map(field => (
            <button
              key={field}
              onClick={() => toggleField(field)}
              className={cn(
                'px-3 py-2 rounded-full text-sm font-medium transition-all border',
                profile.desiredField.includes(field)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              )}
            >
              {field}
            </button>
          ))}
        </div>
        {profile.desiredField.length > 0 && (
          <p className="text-xs text-primary-600 font-medium">
            נבחרו: {profile.desiredField.join(', ')}
          </p>
        )}
      </div>
    )
  }

  function StepPreferences() {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-bold text-gray-900">העדפות לימודים</h2>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">לימודי בוקר / ערב</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'morning', label: 'בוקר ☀️' },
              { value: 'evening', label: 'ערב 🌙' },
              { value: 'flexible', label: 'גמיש 🔄' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() =>
                  updateProfile({
                    studyTime: opt.value as StudentProfile['studyTime'],
                  })
                }
                className={cn(
                  'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                  profile.studyTime === opt.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">תקציב שנתי</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'low', label: 'עד ₪10,000' },
              { value: 'medium', label: '₪10-20K' },
              { value: 'high', label: '₪20-35K' },
              { value: 'premium', label: '₪35K+' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() =>
                  updateProfile({
                    budget: opt.value as StudentProfile['budget'],
                  })
                }
                className={cn(
                  'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                  profile.budget === opt.value
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">פורמט לימודים</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'frontal', label: 'פרונטלי 🏫' },
              { value: 'online', label: 'אונליין 💻' },
              { value: 'hybrid', label: 'משולב 🔀' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() =>
                  updateProfile({
                    studyFormat: opt.value as StudentProfile['studyFormat'],
                  })
                }
                className={cn(
                  'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                  profile.studyFormat === opt.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function StepHobbies() {
    const toggleHobby = (hobby: string) => {
      const current = profile.hobbies
      updateProfile({
        hobbies: current.includes(hobby)
          ? current.filter(h => h !== hobby)
          : [...current, hobby],
      })
    }

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900">תחביבים ותחומי עניין</h2>
        <p className="text-sm text-gray-500">מה אתה אוהב לעשות? (אופציונלי)</p>
        <div className="flex flex-wrap gap-2">
          {HOBBIES.map(hobby => (
            <button
              key={hobby}
              onClick={() => toggleHobby(hobby)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                profile.hobbies.includes(hobby)
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-accent-300'
              )}
            >
              {hobby}
            </button>
          ))}
        </div>
      </div>
    )
  }
}

// Reusable input
type StudentProfile = import('../types').StudentProfile

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  dir,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  dir?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-700 placeholder:text-gray-300 transition-colors"
      />
    </div>
  )
}
