import { getInitials } from '../../utils/userUtils'

type Size = 'sm' | 'md' | 'lg'

const sizeMap: Record<Size, { w: string; text: string }> = {
  sm: { w: 'w-8 h-8', text: 'text-sm' },
  md: { w: 'w-12 h-12', text: 'text-base' },
  lg: { w: 'w-16 h-16', text: 'text-lg' },
}

export default function SmartAvatar({ src, name, size = 'md' }: { src?: string | null; name: string; size?: Size }) {
  const s = sizeMap[size]

  if (src) {
    return <img src={src} alt={name} className={`${s.w} rounded-full object-cover`} />
  }

  const initials = getInitials(name || '') || '--'

  return (
    <div className={`flex items-center justify-center ${s.w} rounded-full bg-blue-100 text-blue-700 ${s.text} font-semibold`}> {initials} </div>
  )
}
