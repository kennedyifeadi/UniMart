export interface IReview {
  id: string
  customerName: string
  customerFaculty?: string
  rating: number
  date: string
  comment: string
}

export interface IVendorProfile {
  id: string
  businessName: string
  fullName?: string
  email?: string
  whatsappNumber?: string
  phoneNumber?: string
  category?: string
  subcategory?: string
  description?: string
  faculty?: string
  location?: string
  offerings?: string[]
  services?: string[]
  profilePictureUrl?: string
  backdropPictureUrl?: string
  gallery?: string[]
  isVerified?: boolean
  rating?: number
  reviewCount?: number
  responseTime?: string
  reviews?: IReview[]
  businessHours?: unknown
  website?: string
  [key: string]: unknown
}

export interface IVendor {
  id: string
  businessName: string
  description?: string
  category?: string
  subcategory?: string
  rating?: number
  reviewCount?: number
  imageUrl?: string
  isVerified?: boolean
  phoneNumber?: string
  faculty?: string
}

export interface IUser {
  uid: string
  email?: string | null
  displayName?: string | null
  photoURL?: string | null
  [key: string]: unknown
}

export interface FirestoreProfile {
  role?: string
  isVendor?: boolean
  createdAt?: { seconds: number } | string | null
  [key: string]: unknown
}

export default {};
