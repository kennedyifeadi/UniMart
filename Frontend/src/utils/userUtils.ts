export function getInitials(fullName: string): string {
  if (!fullName) return ''
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + (parts[1][0] ?? '')).toUpperCase()
}

import type { IUser } from '../types'

export function calculateCompletion(user: Partial<IUser & { fullName?: string; faculty?: string; avatarUrl?: string }> | null | undefined): number {
  // Start users at 35% by default so the widget shows progress even
  // before faculty/photo are set. Faculty + photo complete the rest.
  let score = 35
  // Faculty (adds 35 -> 70 total if present)
  if (user?.faculty) score += 35
  // Profile picture (adds remaining 30 -> 100 total if present)
  if (user?.avatarUrl || (user as any)?.photoURL) score += 30

  return Math.max(0, Math.min(100, score))
}

export default { getInitials, calculateCompletion }
