import React, { useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import SmartAvatar from '../../../components/common/SmartAvatar'
import { FACULTIES } from '../../../constants/faculties'
import { uploadToCloudinary } from '../../../utils/upload'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../store/slices/authSlice'
import Toast from '../../../components/Toast'
import Input from '../../../components/Auth/Input'

type User = {
  uid: string
  photoURL?: string | null
  fullName?: string | null
  faculty?: string | null
}

type Props = {
  isOpen: boolean
  onClose: () => void
  currentUser: User
}

export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
  const dispatch = useDispatch()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [fullName, setFullName] = useState(currentUser?.fullName ?? '')
  const [faculty, setFaculty] = useState(currentUser?.faculty ?? '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(currentUser?.photoURL ?? null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  useEffect(() => {
    setFullName(currentUser?.fullName ?? '')
    setFaculty(currentUser?.faculty ?? '')
    setPreview(currentUser?.photoURL ?? null)
    setSelectedFile(null)
  }, [currentUser, isOpen])

  useEffect(() => {
    if (!selectedFile) return
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  if (!isOpen) return null

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (f) setSelectedFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let photoURL = currentUser.photoURL ?? null

      if (selectedFile) {
        try {
          photoURL = await uploadToCloudinary(selectedFile)
        } catch (err: unknown) {
          console.error('Cloudinary upload failed', err)
          setToast({ message: 'Image upload failed. Please try again.', type: 'error' })
          setLoading(false)
          return
        }
      }

      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, {
        fullName,
        faculty,
        photoURL,
      })

      // update local redux state for immediate UI update
      dispatch(
        setUser({
          user: { uid: currentUser.uid, displayName: fullName, photoURL },
          profile: { faculty, fullName },
        }),
      )

      setToast({ message: 'Profile updated successfully', type: 'success' })
      setTimeout(() => {
        setLoading(false)
        onClose()
      }, 800)
    } catch (err) {
      console.error('Update profile failed', err)
      setToast({ message: 'Update profile failed', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[400px] mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#2563eb]" style={{ fontFamily: 'cursive' }}>Edit Profile</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {preview ? (
              <img src={preview} alt={fullName || 'avatar'} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <SmartAvatar src={null} name={fullName || 'User'} size="lg" />
            )}
            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[#2563eb] text-white rounded"
              >
                <Camera size={16} /> Change Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>
          </div>

          <div>
            <Input
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Input
              label="Faculty"
              name="faculty"
              variant="select"
              value={faculty ?? ''}
              onChange={(e) => setFaculty(e.target.value)}
              options={FACULTIES.map((f) => ({ value: f, label: f }))}
              placeholder="Select Faculty"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#2563eb] text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type === 'error' ? 'error' : 'success'} onClose={() => setToast(null)} />}
    </div>
  )
}
