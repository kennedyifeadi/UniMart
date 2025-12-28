import { useNavigate } from 'react-router-dom'

export default function RoleSwitcher({ currentRole }: { currentRole: 'vendor' | 'customer' }) {
  const nav = useNavigate()

  return (
    <div className="w-full bg-transparent py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => nav('/vendor/dashboard')}
            className={`px-4 py-1 rounded-full font-medium ${currentRole === 'vendor' ? 'bg-[#2563eb] text-white' : 'bg-transparent text-black'}`}
          >
            Vendor Dashboard
          </button>
          <button
            onClick={() => nav('/dashboard')}
            className={`px-4 py-1 rounded-full font-medium ${currentRole === 'customer' ? 'bg-[#2563eb] text-white' : 'bg-gray-200 text-black'}`}
          >
            Customer Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
