import { Star } from 'lucide-react'

type Voice = {
  id: string
  name: string
  faculty: string
  rating: number
  text: string
}

function Avatar({ name }: { name: string }) {
  const parts = name.split(/\s+/)
  const initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
  return <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-medium">{initials}</div>
}

export default function CommunityVoices({ items }: { items: Voice[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Community Voices</h3>
        <a className="text-sm text-[#2563eb] hover:underline">View All</a>
      </div>

      <ul className="space-y-3 mb-3">
        {items.map((v) => (
          <li key={v.id} className="flex gap-3">
            <Avatar name={v.name} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-xs text-gray-500">{v.faculty}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star size={14} /> {v.rating}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{v.text}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto bg-[#2563eb] text-white p-3 rounded-md flex items-center justify-between">
        <div>
          <div className="font-semibold">Share Your Experience</div>
          <div className="text-xs">Help others by writing a short review</div>
        </div>
        <button className="bg-white text-[#2563eb] px-3 py-1 rounded">Write Review</button>
      </div>
    </div>
  )
}
