
type Props = {
  completionPercentage: number
  missingFields?: string[]
  isVerified?: boolean
  onComplete?: () => void
}

export default function OnboardingAlert({ completionPercentage, missingFields = [], isVerified = false, onComplete }: Props) {
  if (completionPercentage >= 100 && isVerified) return null

  if (completionPercentage < 100) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-300 p-4 rounded mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Your profile is {completionPercentage}% complete</h4>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="bg-orange-400 h-3" style={{ width: `${completionPercentage}%` }} />
            </div>
            {missingFields.length > 0 && (
              <div className="text-sm text-gray-600 mt-2">You are missing: {missingFields.join(', ')}</div>
            )}
          </div>

          <div className="ml-4">
            <button onClick={onComplete} className="px-4 py-2 bg-[#2563eb] text-white rounded">Complete Onboarding</button>
          </div>
        </div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-300 p-4 rounded mb-4">
        <h4 className="font-semibold">Verification Pending</h4>
        <div className="text-sm text-gray-600 mt-2">Your Student ID is being reviewed by the admins.</div>
      </div>
    )
  }

  return null
}
