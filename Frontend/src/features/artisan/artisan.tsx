import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { MOCK_VENDORS } from '../../dummydata'
import type { IVendorProfile } from '../../types'
import { ShieldCheck, Star, ArrowRight, MapPin } from 'lucide-react'
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { HiShieldCheck } from 'react-icons/hi'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const Artisan: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [vendor, setVendor] = useState<IVendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const stateVendor = (location.state as { vendor?: IVendorProfile } | undefined)?.vendor
    if (stateVendor) {
      setVendor(stateVendor)
      setLoading(false)
      import('../../lib/analytics').then(({ trackEvent }) => {
        trackEvent('vendor_profile_page_view', { vendorId: stateVendor.id, businessName: stateVendor.businessName })
      })
      return
    }

    const load = async () => {
      const vFromMock = MOCK_VENDORS.find((x) => x.id === id) ?? null
      if (vFromMock) {
        setVendor(vFromMock)
        setLoading(false)
        import('../../lib/analytics').then(({ trackEvent }) => {
          trackEvent('vendor_profile_page_view', { vendorId: vFromMock.id, businessName: vFromMock.businessName })
        })
        return
      }

      if (!id) {
        setVendor(null)
        setLoading(false)
        return
      }

      try {
        const docRef = doc(db, 'vendors', id)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data() as Record<string, unknown>

          const getString = (obj: Record<string, unknown> | undefined, keys: string[], fallback = ''): string => {
            if (!obj) return fallback
            for (const k of keys) {
              const v = obj[k]
              if (typeof v === 'string' && v.length) return v
            }
            return fallback
          }

          const getArrayStrings = (obj: Record<string, unknown> | undefined, keys: string[]): string[] => {
            if (!obj) return []
            for (const k of keys) {
              const v = obj[k]
              if (Array.isArray(v)) return v.filter((i): i is string => typeof i === 'string')
            }
            return []
          }

          // images may be nested: images.profile, images.backdrop, images.gallery (array)
          const imagesObj = (data['images'] && typeof data['images'] === 'object') ? (data['images'] as Record<string, unknown>) : undefined
          const profileFromImages = imagesObj ? getString(imagesObj, ['profile']) : ''
          const backdropFromImages = imagesObj ? getString(imagesObj, ['backdrop']) : ''
          const galleryFromImages = imagesObj ? getArrayStrings(imagesObj, ['gallery', 'images', 'list']) : []

          // business hours could be an object or array
          const businessHoursRaw = data['businessHours'] ?? data['hours'] ?? null

          const v: Partial<IVendorProfile> & Record<string, unknown> = {
            id: snap.id,
            fullName: getString(data, ['fullName', 'ownerName', 'contactName'], ''),
            businessName: getString(data, ['businessName', 'businessTitle'], 'Vendor'),
            email: getString(data, ['email', 'contactEmail'], ''),
            whatsappNumber: getString(data, ['whatsappNumber', 'phoneNumber', 'phone'], ''),
            category: getString(data, ['category', 'categoryName'], 'Others'),
            subcategory: getString(data, ['subcategory'], ''),
            description: getString(data, ['businessDescription', 'description', 'bio'], ''),
            faculty: getString(data, ['faculty'], ''),
            location: getString(data, ['location', 'address'], ''),
            offerings: getArrayStrings(data, ['offerings', 'services', 'products']),
            profilePictureUrl: profileFromImages || getString(data, ['profilePictureUrl'], ''),
            backdropPictureUrl: backdropFromImages || getString(data, ['backdropPictureUrl'], ''),
            gallery: galleryFromImages,
            isVerified: !!data['isVerified'],
            rating: typeof data['rating'] === 'number' ? data['rating'] : (typeof data['rating'] === 'string' ? Number(data['rating']) || 0 : 0),
            reviewCount: typeof data['reviewCount'] === 'number' ? data['reviewCount'] : (typeof data['reviewCount'] === 'string' ? Number(data['reviewCount']) || 0 : 0),
            responseTime: getString(data, ['responseTime'], ''),
            reviews: Array.isArray(data['reviews']) ? (data['reviews'] as unknown[]).map((r, i) => (typeof r === 'object' && r ? (r as Record<string, unknown>) : { id: `r${i}`, customerName: 'Anon', rating: 0, date: '', comment: '' })) : [],
            businessHours: businessHoursRaw,
            website: getString(data, ['website', 'site', 'url'], ''),
          }

          // cast to IVendorProfile if you rely on that type elsewhere
          setVendor(v as IVendorProfile)
          import('../../lib/analytics').then(({ trackEvent }) => {
            trackEvent('vendor_profile_page_view', { vendorId: v.id, businessName: v.businessName })
          })
        } else {
          setVendor(null)
        }
      } catch {
        setVendor(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, location])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!vendor) return <div className="p-8 text-center">Vendor not found</div>

  const gallery: string[] = vendor?.gallery ?? []
  const offerings = (vendor?.services ?? []) as string[]
  const reviews = (vendor?.reviews ?? []) as Array<Record<string, unknown>>

  const renderBusinessHours = (bh: unknown) => {
    if (!bh) return <div className="text-sm text-gray-600">Not provided</div>
    // object: { monday: '9am - 5pm', ... } or array [{day, open, close}]
    if (Array.isArray(bh)) {
      return (
        <div className="text-sm text-gray-700 space-y-1">
          {bh.map((d: Record<string, unknown>, i: number) => {
            const day = (d['day'] ?? d['name']) as string | undefined
            const open = d['open'] as string | undefined
            const close = d['close'] as string | undefined
            const hours = d['hours'] as string | undefined
            return (
              <div key={i} className="flex justify-between">
                <div>{day ?? `Day ${i + 1}`}</div>
                <div className="text-gray-600">{open ? `${open} — ${close ?? ''}` : hours ?? ''}</div>
              </div>
            )
          })}
        </div>
      )
    }
    if (typeof bh === 'object') {
      return (
        <div className="text-sm text-gray-700 space-y-1">
          {Object.entries(bh as Record<string, unknown>).map(([day, val]) => (
            <div key={day} className="flex justify-between">
              <div className="capitalize">{day.replace(/_/g, ' ')}</div>
              <div className="text-gray-600">{typeof val === 'string' ? val : JSON.stringify(val)}</div>
            </div>
          ))}
        </div>
      )
    }
    return <div className="text-sm text-gray-600">{String(bh)}</div>
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
        {vendor.backdropPictureUrl ? (
          <img loading="lazy" src={vendor.backdropPictureUrl as string} alt={vendor.businessName} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute left-4 md:left-12 bottom-4 md:bottom-8 text-white flex items-end gap-4">
            <div className="relative -mt-16 md:-mt-24">
            {vendor.profilePictureUrl ? (
              <img loading="lazy" src={vendor.profilePictureUrl as string} alt={vendor.businessName} className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover" />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-gray-700 font-medium">{(vendor?.fullName ?? 'V').charAt(0)}</div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-blue-50 text-[#2563eb] px-2 py-0.5 rounded-md text-sm">{vendor.category} → {vendor.subcategory}</span>
              {vendor.isVerified && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-sm">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> UI Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{vendor.businessName}</h1>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-200">
              <Star className="text-yellow-400" />
              <span className="font-medium">{(vendor.rating ?? 0).toFixed(1)}</span>
              <span className="text-gray-300">from {(vendor.reviewCount ?? 0)} reviews</span>
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
              <MapPin />
              <div>{vendor.faculty} — {vendor.location}</div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div><strong>Owner:</strong> {vendor?.fullName ?? '—'}</div>
              <div><strong>Email:</strong> {vendor?.email ?? '—'}</div>
              <div><strong>Phone:</strong> {vendor?.whatsappNumber ?? vendor?.phoneNumber ?? '—'}</div>
              {vendor?.website && <div><strong>Website:</strong> <a href={vendor.website} target="_blank" rel="noreferrer" className="text-blue-600">{vendor.website}</a></div>}
            </div>
          </div>

          {/* Visuals / Gallery */}
          {gallery.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Visuals</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {gallery.map((src, i) => (
                  <img key={i} loading="lazy" src={src} alt={`${vendor.businessName}-${i}`} className="w-full h-24 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">What We Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {offerings.length ? offerings.map((it) => (
                <div key={it} className="flex items-center gap-2 text-sm text-gray-700">
                  <ArrowRight className="text-[#2563eb]" />
                  <span>{it}</span>
                </div>
              )) : <div className="text-sm text-gray-500">No offerings listed.</div>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
            {reviews.length ? (
              <div className="space-y-4">
                {(() => {
                  const r = reviews[0]
                  return (
                    <div key={r.id ?? 'r0'} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center text-gray-700 font-medium">{((r.customerName ?? '') as string).charAt(0)}</div>
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
                  <div className="text-sm text-gray-500">Showing 1 of {reviews.length}</div>
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
              href={`https://wa.me/${vendor?.whatsappNumber ?? ''}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-3 rounded-md bg-[#2563eb] text-white font-medium"
            >
              Contact {vendor.businessName}
            </a>
            <div className="mt-3 text-xs text-gray-600">Quick response • Verified contact</div>
            {vendor.email && <div className="mt-3 text-sm"><strong>Email:</strong> {vendor.email}</div>}
            {vendor?.phoneNumber && <div className="text-sm"><strong>Phone:</strong> {vendor.phoneNumber}</div>}
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <HiShieldCheck className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-700">UI Verified Vendor</div>
                <div className="text-sm text-green-700">{vendor.isVerified ? 'Confirmed University of Ibadan student' : 'Not verified'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Business Hours</h4>
            {renderBusinessHours(vendor?.businessHours)}
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