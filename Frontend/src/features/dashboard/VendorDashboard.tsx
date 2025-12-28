import { useEffect, useState } from 'react'
// import DashboardHeader from '../user/components/DashboardHeader'
import RoleSwitcher from './components/RoleSwitcher'
import VendorHeader from '../vendor/components/VendorHeader'
import QuickStats from '../vendor/components/QuickStats'
import BusinessCardWidget from '../vendor/components/BusinessCardWidget'
import BusinessTips from '../vendor/components/BusinessTips'
import RecentActivity from '../user/components/RecentActivity'
import Announcements from './components/Announcements'
import CommunityVoices from './components/CommunityVoices'
// import VendorStats from '../vendor/components/VendorStats'
import OnboardingAlert from '../vendor/components/OnboardingAlert'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useNavigate } from 'react-router-dom'

const VendorDashboard = () => {
  const auth = useSelector((state: RootState) => state.auth)
  const uid = auth.currentUser?.uid
  const navigate = useNavigate()

  type Onboarding = {
    completionPercentage?: number
    missingFields?: string[]
    isVerified?: boolean
  }

  type MetricsTrend = {
    contacts?: string
    views?: string
    totalContacts?: string
    response?: string
  }

  type Metrics = {
    contactsThisWeek?: number
    profileViews?: number
    totalContacts?: number
    responseRate?: number
    trend?: MetricsTrend
  }

  type VendorData = {
    ownerName?: string
    businessName?: string
    createdAt?: number | string
    faculty?: string
    onboarding?: Onboarding
    metrics?: Metrics
    completionPercentage?: number
  }

  const [vendorData, setVendorData] = useState<VendorData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadVendor() {
      if (!uid) {
        setLoading(false)
        return
      }
      try {
        const ref = doc(db, 'vendors', uid)
        const snap = await getDoc(ref)
        if (!mounted) return
        if (!snap.exists()) {
          // redirect to become a vendor if no profile
          setVendorData(null)
          setLoading(false)
          return
        }
        const data = snap.data()
        setVendorData(data)
      } catch (err) {
        console.error('Failed to load vendor data', err)
      } finally {
        setLoading(false)
      }
    }
    loadVendor()
    return () => {
      mounted = false
    }
  }, [uid])

  // use navigate to open the full settings page for editing/onboarding
  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!vendorData) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white p-6 rounded shadow">No vendor profile found. Please create one <button onClick={() => navigate('/becomeavendor')} className="text-blue-600">here</button>.</div>
      </div>
    )
  }

  return (
    <div className="mt-20">
      <RoleSwitcher currentRole="vendor" />
      <VendorHeader owner={vendorData.ownerName ?? 'Owner'} business={vendorData.businessName ?? 'My Business'} joined={vendorData.createdAt ? new Date(vendorData.createdAt).toLocaleDateString() : 'Recently'} faculty={vendorData.faculty ?? ''} onEdit={() => navigate('/vendor/settings')} onAdd={() => {}} />

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-6">
          <OnboardingAlert
            completionPercentage={vendorData.onboarding?.completionPercentage ?? vendorData.completionPercentage ?? 0}
            missingFields={vendorData.onboarding?.missingFields}
            isVerified={vendorData.onboarding?.isVerified}
            onComplete={() => navigate('/vendor/settings')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <QuickStats stats={{ contactsThisWeek: vendorData.metrics?.contactsThisWeek ?? 0, profileViews: vendorData.metrics?.profileViews ?? 0, totalContacts: vendorData.metrics?.totalContacts ?? 0, responseRate: vendorData.metrics?.responseRate ?? 0, trend: vendorData.metrics?.trend ?? { contacts: '+0%', views: '+0%', totalContacts: '+0%', response: '+0%' } }} />
          </div>
          <div>
            <BusinessCardWidget data={{ completion: vendorData.completionPercentage ?? vendorData.onboarding?.completionPercentage ?? 0, businessName: vendorData.businessName, owner: vendorData.ownerName } as { completion: number; businessName?: string; owner?: string } } />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RecentActivity items={[{ id: 'r1', type: 'view', text: 'User Jane viewed your profile', time: '2 days ago' }, { id: 'r2', type: 'view', text: 'New review: Excellent service', time: '3 days ago' }]} />
          <BusinessTips />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Announcements items={[{ id: 'n1', title: 'Vendor Tips', description: 'Boost your profile with photos', date: '1 day ago' }]} />
          <CommunityVoices items={[{ id: 'v1', name: 'Student A', faculty: 'Science', rating: 5, text: 'Great food' }]} />
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard
