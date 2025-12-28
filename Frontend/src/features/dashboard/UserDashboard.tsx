import DashboardHeader from '../user/components/DashboardHeader'
import RecentActivity from '../user/components/RecentActivity'
import SuggestedVendors from '../user/components/SuggestedVendors'
import Announcements from './components/Announcements'
import CommunityVoices from './components/CommunityVoices'
import CommunityStats from './components/CommunityStats'
import ProfileCompletionWidget from '../user/components/ProfileCompletionWidget'
import EditProfileModal from '../user/components/EditProfileModal'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { useState } from 'react'

const UserDashboard = () => {
  type Profile = {
    fullName?: string
    faculty?: string
    createdAt?: { seconds: number } | null
    avatarUrl?: string | null
    photoURL?: string | null
  }

  const auth = useSelector((state: RootState) => state.auth)
  const profile: Profile = (auth.profile ?? {}) as Profile
  const computeJoined = () => {
    type Timestamp = { seconds: number }
    const isTimestamp = (v: unknown): v is Timestamp =>
      typeof v === 'object' && v !== null && 'seconds' in v && typeof (v as Timestamp).seconds === 'number'

    try {
      const createdAt = profile?.createdAt
      if (isTimestamp(createdAt)) {
        return new Date(createdAt.seconds * 1000).toLocaleDateString()
      }
      if (typeof createdAt === 'string') {
        const d = new Date(createdAt)
        if (!isNaN(d.getTime())) return d.toLocaleDateString()
      }
    } catch {
      // ignore and fallback
    }
    return 'Recently'
  }

  const mockUser = {
    name: profile.fullName ?? auth.currentUser?.displayName ?? 'Student',
    faculty: profile.faculty ?? 'Nil',
    joined: computeJoined(),
    avatarUrl: profile.avatarUrl === null ? undefined : (profile.avatarUrl ?? profile.photoURL ?? undefined),
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const currentUserForModal = {
    uid: auth.currentUser?.uid ?? '',
    photoURL:
      typeof profile.photoURL === 'string'
        ? profile.photoURL
        : typeof profile.avatarUrl === 'string'
        ? profile.avatarUrl
        : typeof auth.currentUser?.photoURL === 'string'
        ? auth.currentUser.photoURL
        : null,
    fullName: profile.fullName ?? auth.currentUser?.displayName ?? '',
    faculty: profile.faculty ?? '',
  }

  const activity: { id: string; type: 'contact' | 'favorite' | 'search' | 'view'; text: string; time: string }[] = [
    { id: 'a', type: 'contact', text: 'You sent a message to Campus Catering', time: '2 days ago' },
    { id: 'b', type: 'favorite', text: 'Added 3 vendors to favorites', time: '5 days ago' },
    { id: 'c', type: 'search', text: 'Searched for stationery', time: '6 days ago' },
    { id: 'd', type: 'view', text: 'Viewed Campus Printing profile', time: '1 week ago' },
  ]

  const suggested = [
    { id: '1', name: 'Campus Catering', category: 'Food', rating: 4.7 },
    { id: '2', name: 'UI Prints', category: 'Printing', rating: 4.9 },
    { id: '3', name: 'Style Hub', category: 'Fashion', rating: 4.6 },
  ]

  const announcements: { id: string; title: string; description: string; date: string; icon?: 'megaphone' | 'chart' }[] = [
    { id: 'n1', title: 'Holiday Sale', description: 'Get up to 40% off on select vendors.', date: '2 days ago', icon: 'megaphone' },
    { id: 'n2', title: 'New Vendors', description: 'We onboarded 20 new vendors this week.', date: '5 days ago', icon: 'chart' },
  ]

  const voices = [
    { id: 'v1', name: 'Adaobi Okoro', faculty: 'Faculty of Education', rating: 5, text: 'Great service and fast delivery.' },
    { id: 'v2', name: 'Kunle Adebayo', faculty: 'Faculty of Science', rating: 4.5, text: 'Affordable and reliable.' },
  ]

  return (
    <div >
      <DashboardHeader user={mockUser} onEdit={() => setIsEditModalOpen(true)} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <ProfileCompletionWidget onEdit={() => setIsEditModalOpen(true)} />
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentUser={currentUserForModal} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentActivity items={activity} />
          <SuggestedVendors items={suggested} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Announcements items={announcements} />
          <CommunityVoices items={voices} />
        </div>

        <div className="mb-6">
          <CommunityStats />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
