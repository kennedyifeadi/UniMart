import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import VendorCard from './VendorCard'
import { Search, CheckCircle } from 'lucide-react'
import type { IVendor } from '../../types'
import { Star } from 'lucide-react'
import { collection, getDocs, type DocumentData } from 'firebase/firestore'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebase/config'

const CATEGORIES = ['All', 'Food', 'Fashion', 'Services', 'Others']
const RATING_OPTIONS = ['All', '4+']

const fetchVendors = async (): Promise<IVendor[]> => {
  const snap = await getDocs(collection(db, 'vendors'))
  return snap.docs.map((d) => {
    const data = d.data() as DocumentData
    return {
      id: d.id,
      businessName: data.businessName || data.businessTitle || 'Vendor',
      description: data.businessDescription ?? data.description ?? '',
      category: data.category ?? data.categoryName ?? 'Others',
      subcategory: data.subcategory ?? '',
      rating: typeof data.rating === 'number' ? data.rating : 0,
      reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
      imageUrl: data.images?.profile || data.images?.backdrop || data.profilePictureUrl || data.backdropPictureUrl || '',
      isVerified: !!data.isVerified,
      phoneNumber: data.phoneNumber ?? data.whatsappNumber ?? '',
      faculty: data.faculty ?? '',
    } as IVendor
  })
}

const AllVendors: React.FC = () => {
  const { data: vendors = [], isLoading } = useQuery<IVendor[], Error>({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
  })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [ratingFilter, setRatingFilter] = useState<string>('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return vendors.filter((v) => {
      if (category !== 'All' && v.category !== category) return false
      if (verifiedOnly && !v.isVerified) return false
      if (ratingFilter === '4+' && (v.rating ?? 0) < 4) return false
      if (!q) return true
      return (
        (v.businessName ?? '').toLowerCase().includes(q) ||
        (v.description ?? '').toLowerCase().includes(q) ||
        (v.faculty ?? '').toLowerCase().includes(q)
      )
    })
  }, [vendors, search, category, verifiedOnly, ratingFilter])

  const location = useLocation()
  useEffect(() => {
    const p = new URLSearchParams(location.search)
    const q = p.get('q') ?? ''
    setSearch(q)
  }, [location.search])

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-xl border-gray-200 border-[2px] p-4 sticky top-20">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-4">Categories</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((c) => {
                  const active = c === category
                  return (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`text-sm text-start px-3 py-2 rounded-sm ${active ? 'bg-blue-100 text-[#2563eb] font-medium' : 'text-gray-700'}`}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-4">Ratings</h4>
              <div className="flex flex-col gap-2">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatingFilter(r)}
                    className={`text-sm flex items-center py-2 text-left px-2 ${ratingFilter === r ? 'text-[#2563eb] font-medium' : 'text-gray-700'}`}
                  >
                    {r === '4+' && <Star className="inline text-yellow-400 mr-1" />} {r} stars
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-4">Verification</h4>
              <label className="flex items-center gap-2 text-md text-gray-700">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                <span className="flex items-center gap-2"> Show only UI Verified vendors <CheckCircle className="text-green-600" /></span>
              </label>
            </div>

            <div className='w-full h-[1px] mt-6 rounded-full bg-gray-300'></div>
            <div className="mt-8">
              <button
                onClick={() => { setSearch(''); setCategory('All'); setRatingFilter('All'); setVerifiedOnly(false) }}
                className="w-full py-2 rounded-md border border-gray-300 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="w-full md:w-3/4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold font-heading">All Vendors</h2>
            <div className="text-sm text-gray-600">{filtered.length} results</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div>Loading...</div>
            ) : filtered.length ? (
              filtered.map((v) => <VendorCard key={v.id} vendor={v} />)
            ) : (
              <div className="col-span-full text-center text-gray-500">No vendors found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AllVendors