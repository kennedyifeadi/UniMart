import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MOCK_VENDORS } from '../../dummydata'
import type { IVendorProfile } from '../../dummydata'
import { HiShieldCheck } from 'react-icons/hi'
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { HiOutlineLocationMarker } from 'react-icons/hi'
// removed unused AiOutlineCheck

const Artisan: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<IVendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const v = MOCK_VENDORS.find((x) => x.id === id) ?? null
    // simulate async load
    const t = setTimeout(() => {
      setVendor(v)
      setLoading(false)
    }, 250)
    // track page view (after vendor loaded)
    if (v) {
      import('../../lib/analytics').then(({ trackEvent }) => {
        trackEvent('vendor_profile_page_view', { vendorId: v.id, businessName: v.businessName })
      })
    }
    return () => clearTimeout(t)
  }, [id])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!vendor) return <div className="p-8 text-center">Vendor not found</div>

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={vendor.backdropPictureUrl} alt={vendor.businessName} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute left-4 md:left-12 bottom-4 md:bottom-8 text-white flex items-end gap-4">
          <div className="relative -mt-16 md:-mt-24">
            <img src={vendor.profilePictureUrl} alt={vendor.businessName} className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-blue-50 text-[#2563eb] px-2 py-0.5 rounded-md text-sm">{vendor.category} → {vendor.subcategory}</span>
              {vendor.isVerified && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-sm">
                  <HiShieldCheck className="w-4 h-4 text-green-600" /> UI Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{vendor.businessName}</h1>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-200">
              <AiFillStar className="text-yellow-400" />
              <span className="font-medium">{vendor.rating.toFixed(1)}</span>
              <span className="text-gray-300">from {vendor.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / main (2 cols) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">About {vendor.businessName}</h2>
            <p className="text-sm text-gray-700">{vendor.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <HiOutlineLocationMarker />
              <div>{vendor.faculty} — {vendor.location}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">What We Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vendor.offerings.map((it) => (
                <div key={it} className="flex items-center gap-2 text-sm text-gray-700">
                  <AiOutlineArrowRight className="text-[#2563eb]" />
                  <span>{it}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
            {vendor.reviews.length ? (
              <div className="space-y-4">
                {/* show first review */}
                {(() => {
                  const r = vendor.reviews[0]
                  return (
                    <div key={r.id} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center text-gray-700 font-medium">{r.customerName.charAt(0)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.customerName}</div>
                            <div className="text-xs text-gray-500">{r.customerFaculty}</div>
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <AiFillStar className="text-yellow-400" />
                            <span className="font-medium">{r.rating}</span>
                            <span className="text-xs text-gray-400">{r.date}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
                      </div>
                    </div>
                  )
                })()}

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-md bg-gray-100"><AiOutlineArrowLeft /></button>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                    <button className="p-2 rounded-md bg-gray-100"><AiOutlineArrowRight /></button>
                  </div>
                  <div className="text-sm text-gray-500">Showing 1 of {vendor.reviews.length}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No reviews yet.</div>
            )}
          </div>
        </section>

        {/* Right / sidebar */}
        <aside className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="text-md font-semibold mb-3">Contact Vendor</h4>
            <a
              href={`https://wa.me/${vendor.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-3 rounded-md bg-[#2563eb] text-white font-medium"
            >
              Contact {vendor.businessName}
            </a>
            <div className="mt-3 text-xs text-gray-600">Quick response • Verified contact</div>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-700">UI Verified Vendor</div>
                <div className="text-sm text-green-700">Confirmed University of Ibadan student</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Quick Stats</h4>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <div>Response Time</div>
              <div className="font-medium">{vendor.responseTime}</div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <div>Total Reviews</div>
              <div className="font-medium">{vendor.reviewCount}</div>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <div>Faculty</div>
              <div className="font-medium">{vendor.faculty}</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default Artisan
