import { useCallback } from 'react'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { setUser } from '../store/slices/authSlice'
import type { FirestoreProfile } from '../types'

function sanitizeProfile(profile: FirestoreProfile | undefined | null): FirestoreProfile | undefined {
  if (!profile || typeof profile !== 'object') return undefined
  const copy = { ...profile } as FirestoreProfile
  const ca: unknown = copy.createdAt
  if (ca) {
    if (typeof ca === 'object' && 'seconds' in (ca as object) && typeof (ca as { seconds?: number }).seconds === 'number') {
      copy.createdAt = new Date((ca as { seconds: number }).seconds * 1000).toISOString()
    } else if (ca && typeof (ca as { toDate?: () => Date }).toDate === 'function') {
      copy.createdAt = (ca as { toDate: () => Date }).toDate().toISOString()
    }
  }
  return copy
}

export default function useUserInteractions() {
  const dispatch = useDispatch()
  const auth = useSelector((s: RootState) => s.auth)
  const uid = auth.currentUser?.uid

  const toggleFavorite = useCallback(
    async (vendorId: string) => {
      if (!uid) return
      const userRef = doc(db, 'users', uid)
      const snap = await getDoc(userRef)
      const data = snap.data() || {}
      const favorites: string[] = data.favorites || []

      const isFav = favorites.includes(vendorId)
      try {
        if (isFav) {
          await updateDoc(userRef, { favorites: arrayRemove(vendorId) })
          const newProfile = { ...(auth.profile || {}), favorites: favorites.filter((f: string) => f !== vendorId) }
          dispatch(setUser({ user: auth.currentUser!, profile: sanitizeProfile(newProfile) }))
        } else {
          await updateDoc(userRef, { favorites: arrayUnion(vendorId) })
          const newProfile = { ...(auth.profile || {}), favorites: [...favorites, vendorId] }
          dispatch(setUser({ user: auth.currentUser!, profile: sanitizeProfile(newProfile) }))
        }
      } catch (err) {
        console.error('toggleFavorite failed', err)
      }
    },
    [uid, auth, dispatch],
  )

  const trackVendorVisit = useCallback(
    async (vendorId: string, vendorName: string) => {
      if (!uid) return
      const userRef = doc(db, 'users', uid)
      const activity = { action: 'viewed_profile', target: vendorName, timestamp: new Date().toISOString() }
      try {
        await updateDoc(userRef, {
          vendorsVisited: arrayUnion(vendorId),
          recentActivity: arrayUnion(activity),
        })

        const snap = await getDoc(userRef)
        const data = snap.data() || {}
        dispatch(setUser({ user: auth.currentUser!, profile: sanitizeProfile(data) }))
      } catch (err) {
        console.error('trackVendorVisit failed', err)
      }
    },
    [uid, auth, dispatch],
  )

  return { toggleFavorite, trackVendorVisit }
}
