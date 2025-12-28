import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function VendorRoute({ children }: { children: ReactNode }) {
  const { currentUser, role } = useSelector((state: RootState) => ({
    currentUser: state.auth.currentUser,
    role: state.auth.role,
  }))

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  const isVendor = role === 'vendor'
  if (!isVendor) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}