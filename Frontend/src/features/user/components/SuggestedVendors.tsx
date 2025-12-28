import { Star } from 'lucide-react'

type Vendor = { id: string; name: string; category: string; rating: number; thumb?: string }

export default function SuggestedVendors({ items }: { items: Vendor[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Suggested Vendors</h3>
        <a className="text-sm text-[#2563eb] hover:underline">View All</a>
      </div>

      <ul className="space-y-3">
        {items.map((v) => (
          <li key={v.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={v.thumb ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(v.name)}&background=random`} alt="thumb" className="w-10 h-10 rounded" />
              <div>
                <div className="font-semibold">{v.name}</div>
                <div className="text-xs text-gray-500">{v.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-yellow-400"><Star size={14} /> <span className="ml-1 text-sm">{v.rating}</span></div>
              <a className="text-sm text-[#2563eb] hover:underline">View Profile</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
