import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../firebase/config'

import type { FirestoreProfile, IUser } from '../../types'

type AuthPayload = {
  user: IUser
  profile?: FirestoreProfile
}

interface AuthState {
  currentUser: IUser | null
  role: 'user' | 'vendor' | 'admin' | string
  isVendor: boolean
  profile?: FirestoreProfile | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  currentUser: null,
  role: 'user',
  isVendor: false,
  profile: null,
  loading: false,
  error: null,
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { email: string; password: string; fullName: string }) => {
    const { email, password, fullName } = payload
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const user = credential.user
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, {
      uid: user.uid,
      fullName,
      email,
      role: 'user',
      isVendor: false,
      createdAt: serverTimestamp(),
    })

    return {
      user: { uid: user.uid, email: user.email, displayName: fullName },
      profile: { role: 'user', isVendor: false, fullName },
    }
  },
)

export const loginWithGoogle = createAsyncThunk('auth/loginWithGoogle', async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      fullName: user.displayName ?? '',
      email: user.email ?? '',
      role: 'user',
      isVendor: false,
      createdAt: serverTimestamp(),
    })
    return {
      user: { uid: user.uid, email: user.email, displayName: user.displayName },
      profile: { role: 'user', isVendor: false, fullName: user.displayName },
    }
  }

  // convert Firestore Timestamp to ISO string to keep payload serializable
    const data = snap.data()
    const ca0 = (data as unknown as FirestoreProfile | undefined)?.createdAt
    if (ca0) {
      const ca = ca0 as { seconds?: number; toDate?: () => Date } | Date | string
      if (typeof ca === 'object' && ca !== null && 'seconds' in ca && typeof (ca as { seconds?: number }).seconds === 'number') {
        ;(data as unknown as { createdAt?: string }).createdAt = new Date((ca as { seconds: number }).seconds * 1000).toISOString()
      } else if (ca && typeof (ca as { toDate?: () => Date }).toDate === 'function') {
        ;(data as unknown as { createdAt?: string }).createdAt = (ca as { toDate: () => Date }).toDate().toISOString()
      }
    }

  return {
    user: { uid: user.uid, email: user.email, displayName: user.displayName },
    profile: data,
  }
})

export const loginUser = createAsyncThunk('auth/loginUser', async (payload: { email: string; password: string }) => {
  const { email, password } = payload
  const { signInWithEmailAndPassword } = await import('firebase/auth')
  const res = await signInWithEmailAndPassword(auth, email, password)
  const user = res.user
  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)
  const profileData = snap.exists() ? snap.data() : undefined
  const ca1 = (profileData as unknown as FirestoreProfile | undefined)?.createdAt
  if (ca1) {
    const ca = ca1 as { seconds?: number; toDate?: () => Date } | Date | string
    if (typeof ca === 'object' && ca !== null && 'seconds' in ca && typeof (ca as { seconds?: number }).seconds === 'number') {
      ;(profileData as unknown as { createdAt?: string }).createdAt = new Date((ca as { seconds: number }).seconds * 1000).toISOString()
    } else if (ca && typeof (ca as { toDate?: () => Date }).toDate === 'function') {
      ;(profileData as unknown as { createdAt?: string }).createdAt = (ca as { toDate: () => Date }).toDate().toISOString()
    }
  }

  return {
    user: { uid: user.uid, email: user.email, displayName: user.displayName },
    profile: profileData,
  }
})

function sanitizeProfile(profile: FirestoreProfile | undefined | null) {
  if (!profile || typeof profile !== 'object') return profile
  const copy = { ...profile }
  const ca = (copy as unknown as FirestoreProfile).createdAt
  if (ca) {
    const _ca = ca as { seconds?: number; toDate?: () => Date } | Date | string
    if (typeof _ca === 'object' && _ca !== null && 'seconds' in _ca && typeof (_ca as { seconds?: number }).seconds === 'number') {
      ;(copy as { createdAt?: string }).createdAt = new Date(((_ca as { seconds: number }).seconds) * 1000).toISOString()
    } else if (_ca && typeof (_ca as { toDate?: () => Date }).toDate === 'function') {
      ;(copy as { createdAt?: string }).createdAt = (_ca as { toDate: () => Date }).toDate().toISOString()
    }
  }
  return copy
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: IUser; profile?: FirestoreProfile }>) {
      const profile = action.payload.profile
      // sanitize Firestore Timestamp to serializable string
      const safeProfile = profile && typeof profile === 'object' ? { ...profile } : profile
      const ca2 = (safeProfile as unknown as FirestoreProfile | undefined)?.createdAt
      if (ca2) {
        const ca = ca2 as { seconds?: number; toDate?: () => Date } | Date | string
        if (typeof ca === 'object' && ca !== null && 'seconds' in ca && typeof (ca as { seconds?: number }).seconds === 'number') {
          ;(safeProfile as unknown as { createdAt?: string }).createdAt = new Date((ca as { seconds: number }).seconds * 1000).toISOString()
        } else if (ca && typeof (ca as { toDate?: () => Date }).toDate === 'function') {
          ;(safeProfile as unknown as { createdAt?: string }).createdAt = (ca as { toDate: () => Date }).toDate().toISOString()
        }
      }

      state.currentUser = action.payload.user
      state.role = safeProfile?.role ?? 'user'
      state.isVendor = !!safeProfile?.isVendor
      state.profile = safeProfile ?? null
      state.error = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    logoutUser(state) {
      state.currentUser = null
      state.role = 'user'
      state.isVendor = false
      state.loading = false
      state.error = null
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.loading = false
        state.currentUser = action.payload.user
        const safe = sanitizeProfile(action.payload.profile)
        state.role = safe?.role ?? 'user'
        state.isVendor = !!safe?.isVendor
        state.profile = safe ?? null
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Registration failed'
        state.profile = null
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.loading = false
        state.currentUser = action.payload.user
        const safe = sanitizeProfile(action.payload.profile)
        state.role = safe?.role ?? 'user'
        state.isVendor = !!safe?.isVendor
        state.profile = safe ?? null
        state.error = null
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Google sign-in failed'
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.loading = false
        state.currentUser = action.payload.user
        const safe = sanitizeProfile(action.payload.profile)
        state.role = safe?.role ?? 'user'
        state.isVendor = !!safe?.isVendor
        state.profile = safe ?? null
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Login failed'
      })
  },
})

export const { setUser, setLoading, logoutUser, setError } = authSlice.actions

export default authSlice.reducer
