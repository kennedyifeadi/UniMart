import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import VendorCard from './VendorCard'
import { HiSearch } from 'react-icons/hi'
import { HiShieldCheck } from 'react-icons/hi'
import type { IVendor } from '../../types/vendor'

// Mock data
const MOCK_VENDORS: IVendor[] = [
  {
    id: 'v1',
    businessName: "Aunty's Kitchen",
    description: 'Homemade Nigerian meals and jollof rice. Fresh and delicious.',
    category: 'Food',
    subcategory: 'Nigerian Cuisine',
    rating: 4.6,
    reviewCount: 124,
    imageUrl: '/images/vendors/food1.jpg',
    isVerified: true,
    phoneNumber: '2348123456789',
    faculty: 'Engineering'
  },
  {
    id: 'v2',
    businessName: 'Campus Threads',
    description: 'Stylish custom tees and hoodies for students.',
    category: 'Fashion',
    subcategory: 'Apparel',
    rating: 4.2,
    reviewCount: 48,
    imageUrl: '/images/vendors/fashion1.jpg',
    isVerified: false,
    phoneNumber: '2347012345678',
    faculty: 'Arts'
  },
  {
    id: 'v3',
    businessName: 'Gadget Fixers',
    description: 'Phone and laptop repairs with quick turnaround.',
    category: 'Services',
    subcategory: 'Repairs',
    rating: 4.8,
    reviewCount: 200,
    imageUrl: '/images/vendors/service1.jpg',
    isVerified: true,
    phoneNumber: '2348035550001',
    faculty: 'Sciences'
  },
  {
    id: 'v4',
    businessName: 'Sweet Bakes',
    description: 'Cakes and pastries made to order for events and parties.',
    category: 'Food',
    subcategory: 'Bakery',
    rating: 3.9,
    reviewCount: 18,
    imageUrl: '/images/vendors/food2.jpg',
    isVerified: false,
    phoneNumber: '2348029991112',
    faculty: 'Management'
  },
  {
    id: 'v5',
    businessName: 'PrintLab',
    description: 'Affordable printing, flyers, and banners for campus events.',
    category: 'Services',
    subcategory: 'Printing',
    rating: 4.1,
    reviewCount: 34,
    imageUrl: '/images/vendors/service2.jpg',
    isVerified: false,
    phoneNumber: '2348091112233',
    faculty: 'Law'
  },
  {
    id: 'v6',
    businessName: 'Spice Route',
    description: 'Authentic street food and spicy delights.',
    category: 'Food',
    subcategory: 'Street Food',
    rating: 4.5,
    reviewCount: 78,
    imageUrl: '/images/vendors/food3.jpg',
    isVerified: true,
    phoneNumber: '2348064443322',
    faculty: 'Science'
  },
  {
    id: 'v7',
    businessName: 'DesignHub',
    description: 'Graphic design and branding for student startups.',
    category: 'Services',
    subcategory: 'Design',
    rating: 4.0,
    reviewCount: 12,
    imageUrl: '/images/vendors/service3.jpg',
    isVerified: false,
    phoneNumber: '2348087774455',
    faculty: 'Engineering'
  },
  {
    id: 'v8',
    businessName: 'Vintage Vibes',
    description: 'Pre-loved vintage clothes and accessories.',
    category: 'Fashion',
    subcategory: 'Vintage',
    rating: 4.7,
    reviewCount: 64,
    imageUrl: '/images/vendors/fashion2.jpg',
    isVerified: true,
    phoneNumber: '2348052227788',
    faculty: 'Arts'
  },
  {
    id: 'v9',
    businessName: 'QuickFix Tutors',
    description: 'Private tutoring for university courses.',
    category: 'Services',
    subcategory: 'Tutoring',
    rating: 3.8,
    reviewCount: 9,
    imageUrl: '/images/vendors/service4.jpg',
    isVerified: false,
    phoneNumber: '2348143332211',
    faculty: 'Education'
  },
  {
    id: 'v10',
    businessName: 'Campus Coffee',
    description: 'Fresh brewed coffee and snacks to keep you going.',
    category: 'Food',
    subcategory: 'Cafe',
    rating: 4.3,
    reviewCount: 90,
    imageUrl: '/images/vendors/food4.jpg',
    isVerified: true,
    phoneNumber: '2348120001110',
    faculty: 'Management'
  }
]

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
          <div className="bg-white rounded-xl border p-4 sticky top-6">
            <div className="relative mb-4">
              <HiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors"
                className="pl-10 pr-3 py-2 w-full border rounded-md"
              />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const active = c === category
                  return (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`text-sm px-3 py-1 rounded-full ${active ? 'bg-blue-100 text-[#2563eb]' : 'text-gray-700'}`}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Ratings</h4>
              <div className="flex flex-col gap-2">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatingFilter(r)}
                    className={`text-sm text-left px-2 ${ratingFilter === r ? 'text-[#2563eb] font-medium' : 'text-gray-700'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                <span className="flex items-center gap-2"><HiShieldCheck className="text-green-600" /> Show only UI Verified vendors</span>
              </label>
            </div>

            <div className="mt-4">
              <button
                onClick={() => { setSearch(''); setCategory('All'); setRatingFilter('All'); setVerifiedOnly(false) }}
                className="w-full py-2 rounded-md border text-sm"
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
