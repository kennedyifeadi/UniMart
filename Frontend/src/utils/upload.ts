import axios from 'axios'

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET')
  }
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const res = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  if (!res?.data?.secure_url) throw new Error('Cloudinary upload did not return secure_url')

  return res.data.secure_url as string
}
