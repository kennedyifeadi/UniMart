import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className={`fixed top-6 right-6 ${bg} text-white px-4 py-2 rounded shadow-lg z-50`}>
      {message}
    </div>
  )
}
