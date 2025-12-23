import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import VendorCard from './VendorCard'
import { HiSearch } from 'react-icons/hi'
import { MdOutlineVerifiedUser } from "react-icons/md";
import type { IVendor } from '../../types/vendor'
import { AiFillStar } from 'react-icons/ai'
import { MOCK_VENDORS as DUMMY_VENDOR_PROFILES } from '../../dummydata'


// map dummy vendor profiles to the listing shape expected by this component
const MOCK_VENDORS: IVendor[] = DUMMY_VENDOR_PROFILES.map((p) => ({
  id: p.id,
  businessName: p.businessName,
  description: p.description,
  category: p.category,
  subcategory: p.subcategory,
  rating: p.rating,
  reviewCount: p.reviewCount,
  imageUrl: p.profilePictureUrl || p.backdropPictureUrl,
  isVerified: p.isVerified,
  phoneNumber: p.whatsappNumber,
  faculty: p.faculty
}))

const fetchVendors = async (): Promise<IVendor[]> => {
  // simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_VENDORS), 400))
}

const CATEGORIES = ['All', 'Food', 'Fashion', 'Services', 'Others']
const RATING_OPTIONS = ['All', '4+']

const AllVendors: React.FC = () => {
  const { data: vendors = [], isLoading } = useQuery<IVendor[], Error>({ queryKey: ['vendors'], queryFn: fetchVendors })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [ratingFilter, setRatingFilter] = useState<string>('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return vendors.filter((v) => {
      if (category !== 'All' && v.category !== category) return false
      if (verifiedOnly && !v.isVerified) return false
      if (ratingFilter === '4+' && v.rating < 4) return false
      if (!q) return true
      return (
        v.businessName.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.faculty.toLowerCase().includes(q)
      )
    })
  }, [vendors, search, category, verifiedOnly, ratingFilter])

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-xl border-gray-200 border-[2px] p-4 sticky top-20">
            <div className="relative mb-4">
              <HiSearch className="absolute left-3 top-3 text-gray-400" />
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
                   {r === '4+' && <AiFillStar className="inline text-yellow-400 mr-1" />} {r} stars
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-4">Verification</h4>
              <label className="flex items-center gap-2 text-md text-gray-700">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)}  />
                <span className="flex items-center gap-2"> Show only UI Verified vendors <MdOutlineVerifiedUser className="text-green-600" /></span>
              </label>
            </div>

            {/* dummy div */}
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
            <h2 className="text-xl font-semibold">All Vendors</h2>
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
