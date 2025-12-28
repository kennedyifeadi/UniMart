export function getInitials(fullName: string): string {
  if (!fullName) return ''
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + (parts[1][0] ?? '')).toUpperCase()
}

import type { IUser } from '../types'

export function calculateCompletion(user: Partial<IUser & { fullName?: string; faculty?: string; avatarUrl?: string }> | null | undefined): number {
  let score = 0
  // Base: name + email
  if (user?.fullName && user?.email) score += 30
  // Faculty
  if (user?.faculty) score += 35
  // Profile picture
  if (user?.avatarUrl || user?.photoURL) score += 35

  return Math.max(0, Math.min(100, score))
}

export default { getInitials, calculateCompletion }
