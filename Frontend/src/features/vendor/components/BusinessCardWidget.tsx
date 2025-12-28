import { Edit } from 'lucide-react'

type BusinessCardData = {
  completion?: number
}

export default function BusinessCardWidget({ data }: { data: BusinessCardData }) {
  const completion = data.completion ?? 85

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Your Business Card</h4>
        <a className="text-sm text-blue-600 flex items-center gap-1"><Edit /> Edit</a>
      </div>

      <div className="mt-4 bg-blue-50 p-4 rounded">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-300 rounded flex items-center justify-center font-bold text-white">CC</div>
          <div>
            <div className="font-semibold">Campus Catering</div>
            <div className="text-xs text-gray-600">Food <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">UI Verified</span></div>
            <div className="text-xs text-gray-600 mt-1">Owner: Adaobi Okoro • Science</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium">Profile Completion</div>
          <div className="w-full bg-gray-100 rounded-full h-3 mt-2 overflow-hidden">
            <div className="bg-[#2563eb] h-3" style={{ width: `${completion}%` }} />
          </div>
          <div className="mt-2 text-sm text-gray-600">{completion}% complete</div>

          <ul className="mt-3 text-sm space-y-1">
            <li>✓ Business description added</li>
            <li>✓ Contact info added</li>
            <li>○ Add business hours</li>
          </ul>
        </div>

        <button className="mt-4 w-full bg-[#2563eb] text-white py-2 rounded">View Full Profile</button>
      </div>
    </div>
  )
}
