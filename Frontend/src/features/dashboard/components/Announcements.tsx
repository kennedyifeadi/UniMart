import { Bell, PieChart } from 'lucide-react'

type Announcement = {
  id: string
  title: string
  description: string
  date: string
  icon?: 'megaphone' | 'chart'
}

export default function Announcements({ items }: { items: Announcement[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Announcements</h3>
        <a className="text-sm text-[#2563eb] hover:underline">View All</a>
      </div>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex gap-3 items-start">
            <div className="p-2 rounded bg-gray-100">
              {it.icon === 'chart' ? <PieChart size={18} /> : <Bell size={18} />}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-gray-500">{it.description}</div>
            </div>
            <div className="text-xs text-gray-400">{it.date}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
