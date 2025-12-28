import { Eye, Phone, Star, Clock } from 'lucide-react'

type Metrics = {
  profileViews: number
  contactsThisWeek: number
  averageRating: number
  responseRate: number // percent
}

export default function VendorStats({ metrics }: { metrics: Metrics }) {
  const cards = [
    { id: 'views', label: 'Profile Views', value: metrics.profileViews, icon: <Eye size={20} />, bg: 'bg-blue-100', fg: 'text-blue-700' },
    { id: 'contacts', label: 'Contacts This Week', value: metrics.contactsThisWeek, icon: <Phone size={20} />, bg: 'bg-green-100', fg: 'text-green-700' },
    { id: 'rating', label: 'Average Rating', value: metrics.averageRating.toFixed(1), icon: <Star size={20} />, bg: 'bg-yellow-100', fg: 'text-yellow-700' },
    { id: 'response', label: 'Response Rate', value: `${metrics.responseRate}%`, icon: <Clock size={20} />, bg: 'bg-purple-100', fg: 'text-purple-700' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
          <div className={`p-3 rounded-md ${c.bg} ${c.fg}`}>{c.icon}</div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="text-xl font-semibold mt-1">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
