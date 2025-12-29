import { Edit2, Plus } from 'lucide-react'
import SmartAvatar from '../../../components/common/SmartAvatar'

export default function VendorHeader({ owner = 'Owner Name', business = 'My Business' , joined = 'Recently', faculty = '' , onEdit, onAdd }: { owner?: string, business?: string, joined?: string, faculty?: string, onEdit?: () => void, onAdd?: () => void }) {
  return (
    <div className="w-full bg-blue-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold font-heading">Good evening, {owner}!</div>
          <div className="text-sm text-white/90 mt-1">Welcome back to your Unimart business dashboard</div>

          <div className="mt-3 flex items-center gap-3 text-xs text-white/90">
            <div className="flex items-center gap-2">
              <SmartAvatar src={null} name={business} size="md" />
              <div className="flex flex-col">
                <span className="font-medium font-heading">{business}</span>
                <span className="text-[12px]">{faculty || 'Business'}</span>
              </div>
            </div>
            <div className="ml-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-[13px]">
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">UI Verified</span>
              <span>Joined {joined}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="px-3 py-2 rounded border border-white/30 text-white bg-transparent flex items-center gap-2"><Edit2 /> Edit Profile</button>
          <button onClick={onAdd} className="px-3 py-2 rounded bg-white text-blue-600 flex items-center gap-2"><Plus /> Add Product</button>
        </div>
      </div>
    </div>
  )
}
