import { Search, Heart, Edit2 } from 'lucide-react'
import SmartAvatar from '../../../components/common/SmartAvatar'

export default function DashboardHeader({ user, onEdit, onSearch, onOpenFavorites }: { user: { name?: string; faculty?: string; joined?: string; avatarUrl?: string }, onEdit?: () => void, onSearch?: () => void, onOpenFavorites?: () => void }) {
  const firstName = (user?.name && typeof user.name === 'string') ? user.name.split(' ')[0] : 'Friend'

  return (
    <div className="w-full bg-[#2563eb] text-white p-4 md:p-6 rounded mb-6 mt-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <div className="text-lg md:text-xl font-semibold font-heading">Good afternoon, {firstName}!</div>
          <div className="text-sm text-white/80">Welcome back — here's what's happening on campus.</div>

          <div className="mt-3 flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
            <div className="flex items-center gap-3">
              <span className="block md:hidden">
                <SmartAvatar src={user?.avatarUrl ?? null} name={user?.name ?? 'Student'} size="sm" />
              </span>
              <span className="hidden md:block">
                <SmartAvatar src={user?.avatarUrl ?? null} name={user?.name ?? 'Student'} size="md" />
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.faculty ?? 'Nil'}</span>
                <span className="text-[12px]">Joined {user?.joined ?? 'Recently'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:ml-2">
              <button onClick={onEdit} className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-2">
                <Edit2 size={16} />
                <span className="hidden md:inline">Edit</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <button onClick={onSearch} className="w-full md:w-auto flex items-center justify-center bg-white/10 hover:bg-white/20 px-3 py-2 rounded gap-2">
            <Search size={16} />
            <span className="hidden md:inline">Find Vendors</span>
          </button>
          <button onClick={onOpenFavorites} className="w-full md:w-auto flex items-center justify-center bg-white/10 hover:bg-white/20 px-3 py-2 rounded gap-2">
            <Heart size={16} />
            <span className="hidden md:inline">My Favorites</span>
          </button>
        </div>
      </div>
    </div>
  )
}
