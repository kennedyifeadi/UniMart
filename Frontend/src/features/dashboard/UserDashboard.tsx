import DashboardHeader from '../user/components/DashboardHeader'
import RecentActivity from '../user/components/RecentActivity'
import SuggestedVendors from '../user/components/SuggestedVendors'
import Announcements from './components/Announcements'
import CommunityVoices from './components/CommunityVoices'
import CommunityStats from './components/CommunityStats'
import ProfileCompletionWidget from '../user/components/ProfileCompletionWidget'
import EditProfileModal from '../user/components/EditProfileModal'
import FavoritesModal from '../user/components/FavoritesModal'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { db } from '../../firebase/config'

const UserDashboard = () => {
  type Profile = {
    fullName?: string
    faculty?: string
    createdAt?: { seconds: number } | null
    avatarUrl?: string | null
    photoURL?: string | null
  }

  // explicit type for auth.profile when it contains favorites to avoid `any`
  type AuthProfile = Profile & {
    favorites?: string[]
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
    avatarUrl:
      profile.avatarUrl === null
        ? undefined
        : profile.avatarUrl ?? profile.photoURL ?? auth.currentUser?.photoURL ?? undefined,
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const navigate = useNavigate()

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

  type ActivityType = 'contact' | 'favorite' | 'search' | 'view'
  const [activity, setActivity] = useState<{ id: string; type: ActivityType; text: string; time: string }[]>([])
  const [suggested, setSuggested] = useState<{ id: string; name: string; category: string; rating: number }[]>([])

  const announcements: { id: string; title: string; description: string; date: string; icon?: 'megaphone' | 'chart' }[] = [
    { id: 'n1', title: 'Holiday Sale', description: 'Get up to 40% off on select vendors.', date: '2 days ago', icon: 'megaphone' },
    { id: 'n2', title: 'New Vendors', description: 'We onboarded 20 new vendors this week.', date: '5 days ago', icon: 'chart' },
  ]

  const voices = [
    { id: 'v1', name: 'Adaobi Okoro', faculty: 'Faculty of Education', rating: 5, text: 'Great service and fast delivery.' },
    { id: 'v2', name: 'Kunle Adebayo', faculty: 'Faculty of Science', rating: 4.5, text: 'Affordable and reliable.' },
  ]

  useEffect(() => {
    let mounted = true
    const uid = auth.currentUser?.uid

    const loadSuggested = async () => {
      try {
        const q = query(collection(db, 'vendors'), orderBy('rating', 'desc'), limit(3))
        const snap = await getDocs(q)
        if (!mounted) return
        const items = snap.docs.map((d) => {
          const data = d.data() as DocumentData
          return {
            id: d.id,
            name: (data.businessName ?? data.businessTitle ?? data.vendorName ?? 'Vendor') as string,
            category: (data.category ?? '') as string,
            rating: typeof data.rating === 'number' ? data.rating : Number(data.rating) || 0,
          }
        })
        setSuggested(items)
      } catch (err) {
        console.error('Failed to load suggested vendors', err)
      }
    }

    const loadActivity = async () => {
      try {
        if (!uid) return
        // try reading a user-scoped activity subcollection: users/{uid}/activity
        const actCol = collection(db, 'users', uid, 'activity')
        const snap = await getDocs(query(actCol, orderBy('createdAt', 'desc'), limit(10)))
        if (!mounted) return
        if (!snap.empty) {
          const items = snap.docs.map((d) => {
            const data = d.data() as DocumentData
            const createdAt = data.createdAt as { seconds?: number } | string | undefined
            const time =
              createdAt && typeof createdAt === 'object' && typeof createdAt.seconds === 'number'
                ? new Date(createdAt.seconds * 1000).toLocaleString()
                : createdAt
                ? String(createdAt)
                : ''
            const typeVal: ActivityType =
              data.type === 'contact' || data.type === 'favorite' || data.type === 'search' || data.type === 'view'
                ? (data.type as ActivityType)
                : 'view'
            return { id: d.id, type: typeVal, text: String(data.text ?? ''), time }
          })
          setActivity(items)
          return
        }

        // fallback: derive from favorites info if present
        const favs = (auth.profile as AuthProfile | null | undefined)?.favorites ?? undefined
        if (favs && favs.length) {
          setActivity([{ id: 'fav', type: 'favorite', text: `You have ${favs.length} favorite vendors`, time: 'Recently' }])
          return
        }

        // final fallback: empty
        setActivity([])
      } catch (err) {
        console.error('Failed to load activity', err)
      }
    }

    void loadSuggested()
    void loadActivity()

    return () => { mounted = false }
  }, [auth.currentUser, auth.profile])

  return (
    <div >
      <DashboardHeader user={mockUser} onEdit={() => setIsEditModalOpen(true)} onSearch={() => navigate('/vendors')} onOpenFavorites={() => setIsFavoritesOpen(true)} />
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <ProfileCompletionWidget onEdit={() => setIsEditModalOpen(true)} />
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentUser={currentUserForModal} />
      <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} favorites={(auth.profile as AuthProfile)?.favorites ?? []} />

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
