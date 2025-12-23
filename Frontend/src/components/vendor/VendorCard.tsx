import React from 'react'
import { Link } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
import { HiShieldCheck } from 'react-icons/hi'
import type { IVendor } from '../../types/vendor'

interface Props {
  vendor: IVendor
}

const VendorCard: React.FC<Props> = ({ vendor }) => {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-0 overflow-hidden flex flex-col">
      <div className="relative h-40 w-full bg-gray-100">
        <img src={vendor.imageUrl} alt={vendor.businessName} className="object-cover w-full h-full" />
        {vendor.isVerified && (
          <div className="absolute top-3 right-3 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <HiShieldCheck className="w-4 h-4 text-green-600" />
            UI Verified
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{vendor.category} → {vendor.subcategory}</span>
        </div>

        <h3 className="font-semibold text-lg text-gray-900">{vendor.businessName}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
          <AiFillStar className="text-yellow-400 mr-1" />
          <span className="mr-2">{vendor.rating.toFixed(1)}</span>
          <span className="text-xs">({vendor.reviewCount} reviews)</span>
        </div>

        <p className="text-sm text-gray-700 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{vendor.description}</p>

        <div className="mt-3 text-xs text-gray-500">Faculty: {vendor.faculty}</div>

        <div className="mt-4 flex gap-3">
          <Link to={`/vendors/${vendor.id}`} className="flex-1 text-center py-2 rounded-md bg-[#2563eb] text-white font-medium">View Profile</Link>
          <a
            href={`https://wa.me/${vendor.phoneNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center py-2 rounded-md bg-[#22c55e] text-white font-medium"
          >
            Contact via WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export default VendorCard
