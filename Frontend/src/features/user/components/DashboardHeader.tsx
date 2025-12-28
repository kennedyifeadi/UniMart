import { Search, Heart, Edit2 } from 'lucide-react'
import SmartAvatar from '../../../components/common/SmartAvatar'

export default function DashboardHeader({ user, onEdit }: { user: { name?: string; faculty?: string; joined?: string; avatarUrl?: string }, onEdit?: () => void }) {
  const firstName = (user?.name && typeof user.name === 'string') ? user.name.split(' ')[0] : 'Friend'

  return (
    <div className="w-full bg-[#2563eb] text-white p-6 rounded mb-6 mt-14">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Good afternoon, {firstName}!</div>
          <div className="text-sm text-white/80">Welcome back — here's what's happening on campus.</div>
          <div className="text-xs text-white/80 mt-2 flex items-center gap-3">
            <div className="flex items-center gap-3">
              <SmartAvatar src={user?.avatarUrl ?? null} name={user?.name ?? 'Student'} size="md" />
              <div className="flex flex-col">
                <span className="font-medium">{user?.faculty ?? 'Nil'}</span>
                <span className="text-[12px]">Joined {user?.joined ?? 'Recently'}</span>
              </div>
            </div>
              <div>
                <button onClick={onEdit} className="ml-3 bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-2">
                <Edit2 size={16} /> Edit
                </button>
              </div>
          </div>
        </div>

        <div className="flex gap-3">
            <button className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded flex items-center gap-2"><Search size={16} /> Find Vendors</button>
            <button className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded flex items-center gap-2"><Heart size={16} /> My Favorites</button>
        </div>
      </div>
    </div>
  )
}
