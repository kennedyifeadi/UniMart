import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export async function registerUser(email: string, password: string, fullName: string) {
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
    recentActivity: [],
  })
  return { uid: user.uid, email: user.email, displayName: fullName }
}

// email/password login is handled in Redux thunks; keep service focused on register and Google

export async function loginWithGoogleService() {
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
      recentActivity: [],
    })
  }

  return user
}

export async function logout() {
  await signOut(auth)
}
