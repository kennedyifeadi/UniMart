import { useSelector } from 'react-redux'
import type { RootState } from '../../../store/store'
import { calculateCompletion } from '../../../utils/userUtils'

type Props = {
  onEdit?: () => void
}

export default function ProfileCompletionWidget({ onEdit }: Props) {
  const profile = useSelector((state: RootState) => state.auth?.profile)
  const completion = calculateCompletion(profile)

  if (completion >= 100) return null

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="font-semibold mb-2">Complete Your Profile</h4>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
        <div className="bg-[#2563eb] h-3" style={{ width: `${completion}%` }} />
      </div>
      <div className="text-sm text-gray-600 mb-3">Your profile is {completion}% complete.</div>
      <button onClick={onEdit} className="px-3 py-2 bg-[#2563eb] text-white rounded">Update Profile</button>
    </div>
  )
}
