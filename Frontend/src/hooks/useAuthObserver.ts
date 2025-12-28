import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { auth, db } from '../firebase/config'
import { setUser, logoutUser, setLoading, setError } from '../store/slices/authSlice'
import type { AppDispatch } from '../store/store'
import type { FirestoreProfile } from '../types'

function sanitizeProfile(profile: FirestoreProfile | undefined | null) {
  if (!profile || typeof profile !== 'object') return profile
  const copy = { ...profile }
  const ca = copy.createdAt
  if (ca) {
    if (typeof ca === 'object' && 'seconds' in ca) {
      copy.createdAt = new Date(ca.seconds * 1000).toISOString()
    } else if (ca && typeof ca.toDate === 'function') {
      copy.createdAt = ca.toDate().toISOString()
    }
  }
  return copy
}

export default function useAuthObserver() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      dispatch(setLoading(true))
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid)
          const snap = await getDoc(userRef)
          const profile = snap.exists() ? sanitizeProfile(snap.data()) : undefined

          dispatch(
            setUser({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName ?? undefined,
              },
              profile,
            }),
          )
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : typeof err === 'string' ? err : 'An unknown error occurred'
          dispatch(setError(message))
        }
      } else {
        dispatch(logoutUser())
      }
      dispatch(setLoading(false))
    })

    return () => unsub()
  }, [dispatch])
}
