import { Star } from 'lucide-react'

export default function CommunityStats() {
  const stats = [
    { id: 'a', label: 'Active Vendors', value: '200+' },
    { id: 'b', label: 'Students Served', value: '1.2K+' },
    { id: 'c', label: 'Average Rating', value: '4.8', icon: <Star size={16} className="text-yellow-400" /> },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between">
        {stats.map((s) => (
          <div key={s.id} className="flex-1 text-center px-4">
            <div className="text-2xl font-bold">{s.value} {s.icon && <span className="inline-block ml-1 align-middle">{s.icon}</span>}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
