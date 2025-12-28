import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../../store/store'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { uploadToCloudinary } from '../../../utils/upload'
import { setUser } from '../../../store/slices/authSlice'
import { Image, Shield, Clock, List, ArrowLeft } from 'lucide-react'
import { FACULTIES } from '../../../constants/faculties'
import { useNavigate } from 'react-router-dom'
import Toast from '../../../components/Toast'

const tabs = [
    { id: 'general', label: 'General Info', icon: List },
    { id: 'visuals', label: 'Visuals', icon: Image },
    { id: 'offerings', label: 'Offerings & Hours', icon: Clock },
    { id: 'verification', label: 'Verification', icon: Shield },
]

type VendorDoc = {
    businessName?: string
    category?: string
    subcategory?: string
    businessDescription?: string
    faculty?: string
    whatsappNumber?: string
    businessHours?: string
    services?: string[]
    images?: {
        profile?: string
        backdrop?: string
        studentId?: string
    }
    profileUrl?: string
    backdropUrl?: string
    idUrl?: string
    avatarUrl?: string
    onboardingStatus?: string | null
    isVerified?: boolean
}

const EditVendorProfile = () => {
    const { currentUser, profile } = useSelector((s: RootState) => s.auth)
    const uid = currentUser?.uid
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<string | null>(null)

    // vendor fields (match required Firestore schema)
    const [businessName, setBusinessName] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [businessDescription, setBusinessDescription] = useState('')
    const [faculty, setFaculty] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [businessHours, setBusinessHours] = useState('')
    const [services, setServices] = useState<string[]>([])
    const [newService, setNewService] = useState('')

    // images and previews - follow schema `images` object
    const [profileUrl, setProfileUrl] = useState<string | null>(null)
    const [backdropUrl, setBackdropUrl] = useState<string | null>(null)
    const [studentIdUrl, setStudentIdUrl] = useState<string | null>(null)

    const [profileFile, setProfileFile] = useState<File | null>(null)
    const [backdropFile, setBackdropFile] = useState<File | null>(null)
    const [studentIdFile, setStudentIdFile] = useState<File | null>(null)

    const profilePreview = useRef<string | null>(null)
    const backdropPreview = useRef<string | null>(null)
    const idPreview = useRef<string | null>(null)

    useEffect(() => {
        let mounted = true
        async function load() {
            if (!uid) {
                setLoading(false)
                return
            }
            try {
                const ref = doc(db, 'vendors', uid)
                const snap = await getDoc(ref)
                if (!mounted) return
                if (snap.exists()) {
                    const data = snap.data() as VendorDoc
                    setBusinessName(data.businessName ?? '')
                    setCategory(data.category ?? '')
                    setSubcategory(data.subcategory ?? '')
                    setBusinessDescription(data.businessDescription ?? '')
                    setFaculty(data.faculty ?? '')
                    setWhatsappNumber(data.whatsappNumber ?? '')
                    setBusinessHours(data.businessHours ?? '')
                    setServices(Array.isArray(data.services) ? data.services : [])
                    setProfileUrl(data.images?.profile ?? data.profileUrl ?? data.avatarUrl ?? null)
                    setBackdropUrl(data.images?.backdrop ?? data.backdropUrl ?? null)
                    setStudentIdUrl(data.images?.studentId ?? data.idUrl ?? null)
                }
            } catch (err) {
                console.error('Failed to load vendor', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => {
            mounted = false
            // revoke previews
            if (profilePreview.current) {
                URL.revokeObjectURL(profilePreview.current)
            }
            if (backdropPreview.current) {
                URL.revokeObjectURL(backdropPreview.current)
            }
            if (idPreview.current) {
                URL.revokeObjectURL(idPreview.current)
            }
        }
    }, [uid])

    function handleProfileSelect(f?: File) {
        if (!f) return
        setProfileFile(f)
        const url = URL.createObjectURL(f)
        if (profilePreview.current) {
            URL.revokeObjectURL(profilePreview.current)
        }
        profilePreview.current = url
        setProfileUrl(url)
    }

    function handleBackdropSelect(f?: File) {
        if (!f) return
        setBackdropFile(f)
        const url = URL.createObjectURL(f)
        if (backdropPreview.current) {
            URL.revokeObjectURL(backdropPreview.current)
        }
        backdropPreview.current = url
        setBackdropUrl(url)
    }

    function handleStudentIdSelect(f?: File) {
        if (!f) return
        setStudentIdFile(f)
        const url = URL.createObjectURL(f)
        if (idPreview.current) {
            URL.revokeObjectURL(idPreview.current)
        }
        idPreview.current = url
        setStudentIdUrl(url)
    }

    function addService() {
        const v = newService.trim()
        if (!v) return
        setServices((s) => [...s, v])
        setNewService('')
    }

    function removeService(idx: number) {
        setServices((s) => s.filter((_, i) => i !== idx))
    }

    async function handleSave() {
        if (!uid) return
        setSaving(true)
        try {
            // uploads
            let uploadedProfileUrl: string | null = null
            let uploadedBackdropUrl: string | null = null
            let uploadedStudentIdUrl: string | null = null

            if (profileFile) uploadedProfileUrl = await uploadToCloudinary(profileFile)
            if (backdropFile) uploadedBackdropUrl = await uploadToCloudinary(backdropFile)
            if (studentIdFile) uploadedStudentIdUrl = await uploadToCloudinary(studentIdFile)

            const vendorRef = doc(db, 'vendors', uid)

            // completion calculation per spec
            const hasBasic = Boolean(businessName && businessDescription && whatsappNumber)
            const hasCategory = Boolean(category && subcategory)
            const hasVisuals = Boolean((profileUrl && !profileFile) || uploadedProfileUrl) && Boolean((backdropUrl && !backdropFile) || uploadedBackdropUrl)
            const hasServices = services.length > 0
            const hasStudentId = Boolean((studentIdUrl && !studentIdFile) || uploadedStudentIdUrl)

            const parts = [hasBasic, hasCategory, hasVisuals, hasServices, hasStudentId]
            const completionPercentage = parts.reduce((acc, v) => acc + (v ? 20 : 0), 0)

            const update: {
                businessName: string
                category: string
                subcategory: string
                businessDescription: string
                faculty: string
                whatsappNumber: string
                businessHours: string
                services: string[]
                completionPercentage: number
                images?: {
                    profile?: string
                    backdrop?: string
                    studentId?: string
                }
                onboardingStatus?: string | null
                isVerified?: boolean
            } = {
                businessName,
                category,
                subcategory,
                businessDescription,
                faculty,
                whatsappNumber,
                businessHours,
                services,
                completionPercentage,
            }

            update.images = {
                ...(profileUrl ? { profile: profileUrl } : {}),
                ...(backdropUrl ? { backdrop: backdropUrl } : {}),
                ...(studentIdUrl ? { studentId: studentIdUrl } : {}),
            }

            if (uploadedProfileUrl) update.images.profile = uploadedProfileUrl
            if (uploadedBackdropUrl) update.images.backdrop = uploadedBackdropUrl
            if (uploadedStudentIdUrl) {
                update.images.studentId = uploadedStudentIdUrl
                update.onboardingStatus = 'pending_verification'
            }

            // if already verified in DB, keep verified
            const snap = await getDoc(vendorRef)
            type Vendor = { isVerified?: boolean; onboardingStatus?: string | null }
            const existing = snap.exists() ? (snap.data() as Vendor) : null
            const isVerified = existing?.isVerified === true
            if (isVerified) update.isVerified = true
            if (!update.onboardingStatus) {
                if (isVerified) update.onboardingStatus = 'verified'
                else update.onboardingStatus = existing?.onboardingStatus ?? (completionPercentage === 100 && uploadedStudentIdUrl ? 'pending_verification' : 'incomplete')
            }

            await setDoc(vendorRef, update, { merge: true })

            // update local redux profile (mark vendor)
            try {
                dispatch(setUser({ user: currentUser ?? null, profile: { ...(profile ?? {}), isVendor: true, role: 'vendor' } }))
            } catch (err) {
                console.warn('Failed to update auth state', err)
            }

            setToast('Profile saved successfully')
            setTimeout(() => navigate('/vendor/dashboard'), 900)
        } catch (err: unknown) {
            console.error('Save failed', err)
            if (err instanceof Error) {
                setToast(err.message ?? 'Save failed')
            } else {
                setToast(String(err) || 'Save failed')
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 w-full h-full">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-6 mt-20">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/vendor/dashboard')} className="flex items-center gap-2 text-sm text-blue-600">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <h2 className="text-xl font-semibold">Edit Vendor Profile</h2>
            </div>

            <div className="bg-white rounded shadow p-4 md:flex">
                <aside className="w-full md:w-48 border-r md:border-r md:pr-4 mb-4 md:mb-0">
                    <nav className="flex md:flex-col gap-2">
                        {tabs.map((t, i) => (
                            <button key={t.id} onClick={() => setActiveTab(i)} className={`flex items-center gap-2 p-2 rounded w-full text-left ${activeTab === i ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                                <t.icon size={16} />
                                <span className="text-sm">{t.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 md:pl-6">
                    {/* General */}
                    {activeTab === 0 && (
                        <div className="space-y-4">
                            <label className="block">
                                <div className="text-sm font-medium">Business Name *</div>
                                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border p-2 rounded" />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label>
                                    <div className="text-sm font-medium">Category *</div>
                                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded" />
                                </label>
                                <label>
                                    <div className="text-sm font-medium">Subcategory *</div>
                                    <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full border p-2 rounded" />
                                </label>
                            </div>

                            <label className="block">
                                <div className="text-sm font-medium">Business Description *</div>
                                <textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} className="w-full border p-2 rounded" />
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label>
                                    <div className="text-sm font-medium">Faculty</div>
                                    <select value={faculty} onChange={(e) => setFaculty(e.target.value)} className="w-full border p-2 rounded">
                                        <option value="">Select faculty</option>
                                        {FACULTIES.map((f) => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <div className="text-sm font-medium">WhatsApp *</div>
                                    <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full border p-2 rounded" />
                                </label>
                                <label>
                                    <div className="text-sm font-medium">Business Hours</div>
                                    <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Mon-Fri: 9am - 5pm" />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Visuals */}
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium mb-2">Profile Photo</div>
                                <label className="flex flex-col items-center justify-center border-dashed border-2 border-gray-200 rounded p-6 cursor-pointer">
                                    {profileUrl ? <img src={profileUrl} alt="profile" className="w-32 h-32 object-cover rounded-full" /> : <Image />}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleProfileSelect(e.target.files?.[0])} />
                                    <div className="text-xs text-gray-500 mt-2">Click to upload or drag and drop</div>
                                </label>
                            </div>

                            <div>
                                <div className="text-sm font-medium mb-2">Backdrop Image</div>
                                <label className="flex flex-col items-center justify-center border-dashed border-2 border-gray-200 rounded p-6 cursor-pointer">
                                    {backdropUrl ? <img src={backdropUrl} alt="backdrop" className="w-full h-40 object-cover rounded" /> : <Image />}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBackdropSelect(e.target.files?.[0])} />
                                    <div className="text-xs text-gray-500 mt-2">Click to upload or drag and drop</div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Offerings & Hours */}
                    {activeTab === 2 && (
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium mb-2">What We Offer</div>
                                <div className="flex gap-2">
                                    <input value={newService} onChange={(e) => setNewService(e.target.value)} className="flex-1 border p-2 rounded" />
                                    <button onClick={addService} className="px-4 bg-blue-600 text-white rounded">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {services.map((o, i) => (
                                        <div key={i} className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2">
                                            <span className="text-sm">{o}</span>
                                            <button onClick={() => removeService(i)} className="text-xs text-gray-500">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium mb-2">Business Hours</div>
                                <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Mon-Fri: 9am - 5pm" />
                            </div>
                        </div>
                    )}

                    {/* Verification */}
                    {activeTab === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-green-50 p-3 rounded">
                                <Shield size={20} />
                                <div>
                                    <div className="text-sm font-semibold">Verification</div>
                                    <div className="text-xs text-gray-600">This ID is for admin verification only and will not be shown publicly.</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium mb-2">Student ID</div>
                                {studentIdUrl && !studentIdFile ? (
                                    <div className="flex items-center gap-4">
                                        <img src={studentIdUrl} alt="id" className="w-40 object-cover rounded" />
                                        <div className="text-sm text-green-700">Uploaded (pending verification)</div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border-dashed border-2 border-gray-200 rounded p-6 cursor-pointer">
                                        <div className="text-gray-500"><Shield /></div>
                                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleStudentIdSelect(e.target.files?.[0])} />
                                        <div className="text-xs text-gray-500 mt-2">Upload Student ID</div>
                                    </label>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => navigate('/vendor/dashboard')} className="px-4 py-2 border rounded">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    )
}

export default EditVendorProfile
