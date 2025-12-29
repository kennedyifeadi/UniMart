import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserInteractions from '../../../hooks/useUserInteractions'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'

interface Props {
  isOpen: boolean
  onClose: () => void
  favorites: string[]
}

type FavItem = {
  id: string
  businessName: string
  image?: string | null
  category?: string
  rating?: number
  ownerUid?: string | null
}

const FavoritesModal: React.FC<Props> = ({ isOpen, onClose, favorites }) => {
  const navigate = useNavigate()
  const { toggleFavorite } = useUserInteractions()
  const [items, setItems] = useState<FavItem[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const ids = Array.isArray(favorites) ? favorites : []
        if (ids.length === 0) {
          if (mounted) setItems([])
          return
        }

        // Fetch all vendor docs in parallel
        const snaps = await Promise.all(ids.map((vid) => getDoc(doc(db, 'vendors', vid))))

        const results: FavItem[] = snaps.map((snap, idx) => {
          const vid = ids[idx]
          if (!snap.exists()) return { id: vid, businessName: `Vendor ${vid}`, image: null }
          const d = snap.data() as Record<string, unknown>
          const images = (d['images'] && typeof d['images'] === 'object') ? (d['images'] as Record<string, unknown>) : undefined
          const img = images ? (images['profile'] as string | undefined) ?? (images['backdrop'] as string | undefined) : (d['profilePictureUrl'] as string | undefined) ?? (d['imageUrl'] as string | undefined) ?? null
          return {
            id: vid,
            businessName: (d['businessName'] as string) ?? `Vendor ${vid}`,
            image: img,
            ownerUid: typeof d['ownerUid'] === 'string' ? (d['ownerUid'] as string) : undefined,
            category: (d['category'] as string) ?? undefined,
            rating: typeof d['rating'] === 'number' ? (d['rating'] as number) : undefined,
          }
        })

        if (mounted) setItems(results)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [isOpen, favorites])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2563eb]">My Favorites</h3>
          <button aria-label="Close favorites" onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {loading && <div className="text-sm text-gray-500">Loading...</div>}

        {!loading && items && items.length > 0 ? (
          <ul className="space-y-3 max-h-[60vh] overflow-auto">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                  {it.image ? <img loading="lazy" src={it.image} alt={it.businessName} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">📷</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{it.businessName}</div>
                  <div className="text-xs text-gray-500">{it.category ?? '—'} {it.rating ? `• ${it.rating.toFixed(1)}` : ''}</div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <button onClick={() => navigate(`/vendors/${it.ownerUid ?? it.id}`)} className="px-3 py-1 bg-[#2563eb] text-white rounded-md text-sm">View</button>
                  <button onClick={() => toggleFavorite(it.id)} className="px-3 py-1 border border-gray-200 rounded-md text-sm">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <div className="text-sm text-gray-500">You have no favorites yet.</div>
        )}
      </div>
    </div>
  )
}

export default FavoritesModal
