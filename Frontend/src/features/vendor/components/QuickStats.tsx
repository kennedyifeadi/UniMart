
type Props = {
  stats: {
    contactsThisWeek: number
    profileViews: number
    totalContacts: number
    responseRate: number
    trend?: { [k: string]: string }
  }
}

export default function QuickStats({ stats }: Props) {
  const items = [
    { id: 'c', title: 'Contacts This Week', value: stats.contactsThisWeek, trend: stats.trend?.contacts || '+0%' },
    { id: 'v', title: 'Total Profile Views', value: stats.profileViews, trend: stats.trend?.views || '+0%' },
    { id: 't', title: 'Total Contacts', value: stats.totalContacts, trend: stats.trend?.totalContacts || '+0%' },
    { id: 'r', title: 'Response Rate', value: `${stats.responseRate}%`, trend: stats.trend?.response || '+0%' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.id} className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{it.title}</div>
                <div className="text-2xl font-semibold mt-1">{it.value}</div>
              </div>
              <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">{it.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">This Week's Activity</div>
        <div className="w-full h-36 bg-gray-100 rounded flex items-end px-2 py-3">
          {/* simple placeholder chart */}
          <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
            <polyline fill="none" stroke="#2563eb" strokeWidth="3" points="0,60 30,50 60,30 90,40 120,20 150,25 180,15 200,30" />
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  )
}
