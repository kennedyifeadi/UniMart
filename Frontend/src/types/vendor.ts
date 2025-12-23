export type IVendorProfile = {
  fullName: string
  businessName: string
  category: string
  bio: string
  whatsapp: string
  studentIdFile?: File | null
}

export interface IVendor {
  id: string
  businessName: string
  description: string
  category: string
  subcategory: string
  rating: number
  reviewCount: number
  imageUrl: string
  isVerified: boolean
  phoneNumber: string
  faculty: string
}

