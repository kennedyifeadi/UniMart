import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, runTransaction } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { ShieldCheck, MapPin, Star, MessageCircle, Lock } from 'lucide-react'

// Strict interface per spec
export interface IVendorProfile {
  id: string
  // From Users Collection
  ownerName: string
  email: string

  // From Vendors Collection
  businessName: string
  description: string
  category: string
  subcategory: string
  faculty: string
  location: string
  whatsappNumber: string
  services: string[]

  // Images
  profilePicture: string
  backdropPicture: string

  // Metrics & Meta
  isVerified: boolean
  rating: number
  reviewCount: number
  responseTime: string
  businessHours: string

  // Reviews
  reviews: Array<{
    id: string
    customerName: string
    customerPhoto?: string
    rating: number
    comment: string
    date: string
  }>
}

const Spinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
  </div>
)

function cleanWhatsApp(raw?: unknown): string {
  if (!raw) return ''
  let s = String(raw)
  // remove all non-digits
  s = s.replace(/\D+/g, '')
  if (!s) return ''
  // if starts with 0 -> replace with 234
  if (s.startsWith('0')) s = '234' + s.slice(1)
  // if starts with country code like 234 already, keep
  if (s.startsWith('234')) return s
  // if starts with other country code, return as-is
  return s
}

const Artisan: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<IVendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const { currentUser, profile } = useSelector((state: RootState) => state.auth)
  const loggedIn = Boolean(currentUser || profile)
  const [showTooltip, setShowTooltip] = useState(false)
  const hideTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)

    const load = async () => {
      try {
        const vendorRef = doc(db, 'vendors', id)
        const userRef = doc(db, 'users', id)

        const [vSnap, uSnap] = await Promise.all([getDoc(vendorRef), getDoc(userRef)])

        if (!vSnap.exists()) {
          setVendor(null)
          setLoading(false)
          return
        }

        const vData = vSnap.data() as Record<string, unknown>
        const uData = uSnap.exists() ? (uSnap.data() as Record<string, unknown>) : {} as Record<string, unknown>

        const pick = <T,>(source: Record<string, unknown> | undefined, keys: string[], fallback: T) => {
          if (!source) return fallback
          for (const k of keys) {
            const val = source[k]
            if (val !== undefined && val !== null) return val as T
          }
          return fallback
        }

        const images = (vData.images && typeof vData.images === 'object') ? (vData.images as Record<string, unknown>) : {} as Record<string, unknown>

        const profilePicture = pick<string>(images, ['profile', 'profilePicture', 'photo', 'photoURL'], '') || pick(uData, ['photoURL', 'photo'], '')
        const backdropPicture = pick<string>(images, ['backdrop', 'backdropPicture', 'cover'], '') || pick(vData, ['backdropPicture', 'backdrop'], '')

        const services = Array.isArray(vData.services) ? vData.services : (Array.isArray(vData.offerings) ? vData.offerings : [])

        const cleanedWA = cleanWhatsApp(vData.whatsappNumber ?? vData.phoneNumber ?? uData.whatsappNumber ?? uData.phoneNumber)

        const merged: IVendorProfile = {
          id: vSnap.id,
          ownerName: String(pick(uData, ['fullName', 'ownerName', 'vendorName'], '')),
          email: String(pick(uData, ['email'], '')),

          businessName: String(pick(vData, ['businessName', 'title', 'vendorName'], '')),
          description: String(pick(vData, ['businessDescription', 'description', 'bio'], '')),
          category: String(pick(vData, ['category'], '')),
          subcategory: String(pick(vData, ['subcategory'], '')),
          faculty: String(pick(vData, ['faculty'], '')),
          location: String(pick(vData, ['location', 'address'], 'Campus')),
          whatsappNumber: cleanedWA,
          services: services as string[],

          profilePicture: profilePicture || '',
          backdropPicture: backdropPicture || '',

          isVerified: !!vData.isVerified,
          rating: typeof vData.rating === 'number' ? vData.rating : Number(vData.rating) || 0,
          reviewCount: typeof vData.reviewCount === 'number' ? vData.reviewCount : Number(vData.reviewCount) || 0,
          responseTime: String(pick(vData, ['responseTime'], 'Within 24h')),
          businessHours: String(pick(vData, ['businessHours', 'hours'], 'Not provided')),

          reviews: Array.isArray(vData.reviews) ? vData.reviews.map((r: Record<string, unknown>, i: number) => {
            const rr = r as Record<string, unknown>
            const id = String(pick(rr, ['id'], `r${i}`))
            const customerName = String(pick(rr, ['customerName', 'name'], 'Anonymous'))
            const customerPhoto = String(pick(rr, ['customerPhoto', 'photoURL', 'photo'], ''))
            const rawRating = pick<number | string>(rr, ['rating'], 0)
            const rating = typeof rawRating === 'number' ? rawRating : Number(rawRating) || 0
            const comment = String(pick(rr, ['comment', 'text'], ''))
            const date = String(pick(rr, ['date'], ''))
            return { id, customerName, customerPhoto, rating, comment, date }
          }) : []
        }

        setVendor(merged)
      } catch (err) {
        console.error(err)
        setVendor(null)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [id])

  if (loading) return <Spinner />
  if (!vendor) return <div className="min-h-screen flex items-center justify-center">Vendor not found</div>

  const waLink = vendor.whatsappNumber ? `https://wa.me/${vendor.whatsappNumber}` : '#'  

  return (
    <div className="w-full bg-gray-50 min-h-screen mt-12">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-200">
        {vendor.backdropPicture ? (
          <img loading="lazy" src={vendor.backdropPicture} alt={vendor.businessName} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-6 bottom-4 flex items-end gap-4 text-white">
          <div className="-mt-16">
            {vendor.profilePicture ? (
              <img loading="lazy" src={vendor.profilePicture} alt={vendor.ownerName} className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover" />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-2xl font-bold">{(vendor.ownerName || vendor.businessName || 'V').charAt(0)}</div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-white/10 text-white px-2 py-0.5 rounded-md text-sm">{vendor.category}{vendor.subcategory ? ` → ${vendor.subcategory}` : ''}</span>
              {vendor.isVerified && (
                <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-100 px-2 py-0.5 rounded-md text-sm">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> UI Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{vendor.businessName}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-white/90">
              <Star className="text-yellow-400" />
              <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
              <span className="text-white/80">from {vendor.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">About {vendor.businessName}</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{vendor.description || 'No description provided.'}</p>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <MapPin />
              <div>{vendor.faculty} — {vendor.location}</div>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <div><strong>Owner:</strong> {vendor.ownerName || '—'}</div>
              <div><strong>Email:</strong> {vendor.email || '—'}</div>
              <div><strong>Phone:</strong> {vendor.whatsappNumber ? `+${vendor.whatsappNumber}` : '—'}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            {vendor.services && vendor.services.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vendor.services.map((s, i) => (
                  <div key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">{s}</div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">No services listed.</div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <button
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md"
                onClick={() => setShowReviewModal(true)}
              >Write a review</button>
            </div>
            {vendor.reviews && vendor.reviews.length > 0 ? (
              <div className="space-y-4">
                      {vendor.reviews.map((r) => (
                        <div key={r.id} className="border-b border-gray-200 pb-3">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0">
                              {r.customerPhoto ? (
                                <img src={r.customerPhoto} alt={r.customerName} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">{(r.customerName || 'A').charAt(0)}</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <div className="font-semibold">{r.customerName}</div>
                                <div className="flex items-center gap-1 text-yellow-400"><Star /> <span className="font-semibold">{r.rating}</span></div>
                              </div>
                              <div className="text-sm text-gray-700 mt-1">{r.comment}</div>
                              <div className="text-xs text-gray-400 mt-1">{(() => {
                                try {
                                  const d = new Date(r.date)
                                  if (!isNaN(d.getTime())) return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                } catch (e) { void e }
                                return r.date || ''
                              })()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">No reviews yet.</div>
            )}
          </div>
        </section>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => { if (!submittingReview) setShowReviewModal(false) }} />
            <div className="mt-10 bg-white w-[90%] max-w-[400px] rounded-2xl p-6 shadow z-10">
              <h3 className="text-lg font-semibold mb-3">Write a review for {vendor.businessName}</h3>
              <label className="block text-sm mb-2">Rating</label>
              <div
                className="flex items-center gap-2 mb-3 focus:outline-none"
                tabIndex={0}
                role="group"
                aria-label="Rating (use arrow keys to change)"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    e.preventDefault(); setReviewRating((r) => Math.max(1, r - 1))
                  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    e.preventDefault(); setReviewRating((r) => Math.min(5, r + 1))
                  } else if (e.key === 'Home') { e.preventDefault(); setReviewRating(1) }
                  else if (e.key === 'End') { e.preventDefault(); setReviewRating(5) }
                }}
              >
                {[1,2,3,4,5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    aria-label={`Set rating ${s} star${s>1?'s':''}`}
                    aria-pressed={s <= reviewRating}
                    className="p-1 focus:outline-none"
                  >
                    <Star className={`w-6 h-6 transition-transform duration-150 ${s <= reviewRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 hover:scale-110`} />
                  </button>
                ))}
                <span className="text-sm text-gray-600">{reviewRating}.0</span>
              </div>
              <label className="block text-sm mb-2">Comment</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full p-2 border rounded h-28 mb-4" />

              <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 rounded border" onClick={() => { if (!submittingReview) setShowReviewModal(false) }}>Cancel</button>
                  <button
                    disabled={submittingReview}
                    className={`px-3 py-1 rounded text-white inline-flex items-center gap-2 ${submittingReview ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2563eb]'}`}
                  onClick={async () => {
                    if (!currentUser) {
                      // user must be logged in
                      alert('Please sign in to leave a review.')
                      return
                    }
                    if (reviewRating < 1 || reviewRating > 5) {
                      alert('Rating must be between 1 and 5')
                      return
                    }
                    if (reviewComment.trim().length < 3) {
                      alert('Please add a short comment.')
                      return
                    }

                    setSubmittingReview(true)
                    const vendorRef = doc(db, 'vendors', vendor.id)
                    try {
                      await runTransaction(db, async (transaction) => {
                        const vSnap = await transaction.get(vendorRef)
                        const vData = vSnap.exists() ? (vSnap.data() as Record<string, unknown>) : {}
                        const existingReviews = Array.isArray(vData.reviews) ? vData.reviews : []
                        const existingCount = typeof vData.reviewCount === 'number' ? vData.reviewCount : Number(vData.reviewCount) || existingReviews.length || 0
                        const existingRating = typeof vData.rating === 'number' ? vData.rating : Number(vData.rating) || 0

                        const newCount = existingCount + 1
                        const newRating = ((existingRating * existingCount) + reviewRating) / newCount

                        const newReview = {
                          id: `${Date.now()}_${currentUser.uid}`,
                          customerName: (profile && (profile.fullName || profile.displayName)) || currentUser.email || 'Anonymous',
                          customerPhoto: (profile && (profile.photoURL || profile.photo)) || currentUser.photoURL || '',
                          rating: reviewRating,
                          comment: reviewComment.trim(),
                          date: new Date().toISOString()
                        }

                        const updatedReviews = [...existingReviews, newReview]

                        transaction.update(vendorRef, {
                          reviews: updatedReviews,
                          rating: newRating,
                          reviewCount: newCount
                        })
                      })

                      // optimistic UI update
                      setVendor((prev) => {
                        if (!prev) return prev
                        const newRev = {
                          id: `${Date.now()}_${currentUser.uid}`,
                          customerName: String((profile && (profile.fullName || profile.displayName)) || currentUser.email || 'Anonymous'),
                          customerPhoto: String((profile && (profile.photoURL || profile.photo)) || currentUser.photoURL || ''),
                          rating: reviewRating,
                          comment: reviewComment.trim(),
                          date: new Date().toISOString()
                        }
                        const newCount = (prev.reviewCount || 0) + 1
                        const newRating = ((prev.rating || 0) * (prev.reviewCount || 0) + reviewRating) / newCount
                        return { ...prev, reviews: [...prev.reviews, newRev], reviewCount: newCount, rating: newRating }
                      })

                      setShowReviewModal(false)
                      setReviewComment('')
                      setReviewRating(5)
                    } catch (err) {
                      console.error('Failed to submit review', err)
                      alert('Could not submit review. Please try again.')
                    } finally {
                      setSubmittingReview(false)
                    }
                  }}
                >
                  {submittingReview ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Contact Vendor</h4>
              {loggedIn ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-white ${vendor.whatsappNumber ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                  onClick={(e) => { if (!vendor.whatsappNumber) e.preventDefault() }}
                >
                  <MessageCircle />
                  <span>{vendor.whatsappNumber ? 'Chat on WhatsApp' : 'No Phone Provided'}</span>
                </a>
              ) : (
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-white bg-green-600">
                    <MessageCircle />
                    <span>Chat on WhatsApp</span>
                  </div>

                  <button
                    type="button"
                    aria-disabled="true"
                    className="absolute inset-0 rounded-lg bg-black/20 flex items-center justify-center cursor-not-allowed"
                    onMouseEnter={() => {
                      setShowTooltip(true)
                      if (hideTimer.current) window.clearTimeout(hideTimer.current)
                      hideTimer.current = window.setTimeout(() => setShowTooltip(false), 3000)
                    }}
                    onMouseLeave={() => {
                      if (hideTimer.current) window.clearTimeout(hideTimer.current)
                      hideTimer.current = window.setTimeout(() => setShowTooltip(false), 3000)
                    }}
                    onClick={() => {
                      setShowTooltip(true)
                      if (hideTimer.current) window.clearTimeout(hideTimer.current)
                      hideTimer.current = window.setTimeout(() => setShowTooltip(false), 3000)
                    }}
                  >
                    <span className="p-2 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Lock className="w-4 h-4 text-black" />
                    </span>
                  </button>

                  <div
                    aria-hidden={!showTooltip}
                    className={`absolute left-0 -top-12 transform origin-left transition-all duration-300 z-50 ${showTooltip ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
                  >
                    <div className="bg-white text-black text-xs px-3 py-2 rounded shadow-lg">
                      You have to login to access this feature
                    </div>
                  </div>
                </div>
              )}

            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <div><span className="text-gray-500">Owner:</span> <span className="font-medium">{vendor.ownerName || '—'}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{vendor.email || '—'}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{vendor.whatsappNumber ? `+${vendor.whatsappNumber}` : '—'}</span></div>
            </div>
          </div>

          <div className={`rounded-xl p-5 border ${vendor.isVerified ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <ShieldCheck className={`w-6 h-6 shrink-0 ${vendor.isVerified ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <div className={`font-bold ${vendor.isVerified ? 'text-green-800' : 'text-gray-700'}`}>{vendor.isVerified ? 'UI Verified Vendor' : 'Unverified Vendor'}</div>
                <div className={`text-sm mt-1 ${vendor.isVerified ? 'text-green-700' : 'text-gray-500'}`}>{vendor.isVerified ? 'Identity confirmed.' : 'This vendor has not verified their student status yet.'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Business Hours</h4>
            <div className="text-sm text-gray-700">{vendor.businessHours || 'Not provided'}</div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default Artisan
