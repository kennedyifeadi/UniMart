import { Send, Heart, Search, Eye } from 'lucide-react'

type Activity = { id: string; type: 'contact' | 'favorite' | 'search' | 'view'; text: string; time: string }

export default function RecentActivity({ items }: { items: Activity[] }) {
  const iconFor = (t: Activity['type']) => {
    switch (t) {
      case 'contact':
        return <Send className="text-blue-500" />
      case 'favorite':
        return <Heart className="text-red-500" />
      case 'search':
        return <Search className="text-purple-500" />
      case 'view':
      default:
        return <Eye className="text-green-500" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <a className="text-sm text-[#2563eb] hover:underline">View All</a>
      </div>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-3">
            <div className="p-2 rounded bg-gray-100">{iconFor(it.type)}</div>
            <div className="flex-1">
              <div className="text-sm">{it.text}</div>
              <div className="text-xs text-gray-400">{it.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
