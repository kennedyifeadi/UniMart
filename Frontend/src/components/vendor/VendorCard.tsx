import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Heart, CheckCircle, Lock } from 'lucide-react'
import type { IVendor } from '../../types'
import trackEvent from '../../lib/analytics'
import useUserInteractions from '../../hooks/useUserInteractions'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

interface Props {
  vendor: IVendor
}

const VendorCard: React.FC<Props> = ({ vendor }) => {
  const navigate = useNavigate()
  const { toggleFavorite, trackVendorVisit } = useUserInteractions()
  const profile = useSelector((state: RootState) => state.auth.profile)
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const favorites: string[] = Array.isArray(profile?.favorites) ? (profile!.favorites as string[]) : []
  const isFav = favorites.includes(vendor.id)
  const loggedIn = Boolean(currentUser || profile)

  const [showTooltip, setShowTooltip] = useState(false)
  const hideTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [])
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-0 overflow-hidden flex flex-col group">
      <div className="relative h-48 w-full bg-gray-100">
        <img loading="lazy" src={vendor.imageUrl} alt={vendor.businessName} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out" />
          <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(vendor.id) }}
          className={`absolute top-3 left-3 p-2 rounded-full text-white ${isFav ? 'bg-red-500' : 'bg-white/70 text-gray-800'}`}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart className="w-4 h-4" />
        </button>
        {vendor.isVerified && (
          <div className="absolute top-3 right-3 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            UI Verified
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{vendor.category} → {vendor.subcategory}</span>
        </div>

        <h3 className="font-semibold text-lg text-gray-900">{vendor.businessName}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
          <Star className="text-yellow-400 mr-1" />
          <span className="mr-2">{(vendor.rating ?? 0).toFixed(1)}</span>
          <span className="text-xs">({vendor.reviewCount} reviews)</span>
        </div>

        <p className="text-sm text-gray-700 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{vendor.description}</p>

        <div className="mt-3 text-xs text-gray-500">Faculty: {vendor.faculty}</div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            className="flex-1 text-center py-2 rounded-md bg-[#2563eb] text-white font-medium"
            onClick={() => { trackEvent('vendor_view_profile', { vendorId: vendor.id, businessName: vendor.businessName, category: vendor.category }); trackVendorVisit(vendor.id, vendor.businessName); navigate(`/vendors/${vendor.id}`, { state: { vendor } }) }}
          >
            View Profile
          </button>
          {loggedIn ? (
            <a
              href={`https://wa.me/${vendor.phoneNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center py-2 rounded-md bg-[#22c55e] text-white font-medium"
              onClick={() => trackEvent('vendor_contact_whatsapp', { vendorId: vendor.id, phone: vendor.phoneNumber })}
            >
              Contact via WhatsApp
            </a>
          ) : (
            <div className="relative">
              {/* Green button visible but non-interactive underneath */}
              <div className="flex-1 text-center py-2 rounded-md bg-[#22c55e] text-white font-medium flex items-center justify-center">
                Contact via WhatsApp
              </div>

              {/* Overlay locks interaction and shows lock icon */}
              <button
                type="button"
                aria-disabled="true"
                className="absolute inset-0 rounded-md bg-black/20 flex items-center justify-center cursor-not-allowed"
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

              {/* Tooltip: white background, small black text, shadow, slides in from left, z-50 */}
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
        </div>
      </div>
    </article>
  )
}

export default VendorCard
