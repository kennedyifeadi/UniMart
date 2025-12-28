import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return children
}