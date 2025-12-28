import { Formik, Form, Field } from 'formik'
import vendorSchema from '../../lib/formSchemas/vendorSchema'
import Input from '../../components/Auth/Input'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store/store'
import { setUser } from '../../store/slices/authSlice'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
// icon removed
import { useState } from 'react'
import Toast from '../../components/Toast'
import ConfirmationModal from '../../components/ConfirmationModal'

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'education', label: 'Education' }
]

const initialValues = {
  vendorName: '',
  businessName: '',
  category: '',
  whatsappNumber: '',
  description: '',
}

export const CreateProfile = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [toast, setToast] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (values: typeof initialValues) => {
    if (!currentUser?.uid) {
      // user must be logged in
      navigate('/login')
      return
    }

    const vendorName = values.vendorName.trim()
    // initials: first letter of first two names
    const parts = vendorName.split(/\s+/)
    const initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendorName)}&background=random`

    const vendorDoc = {
      vendorName: values.vendorName,
      businessName: values.businessName,
      category: values.category,
      whatsappNumber: values.whatsappNumber,
      description: values.description,
      initials,
      avatarUrl,
      onboardingStatus: 'incomplete',
      completionPercentage: 20,
      images: { profile: '', backdrop: '' },
      isVerified: false,
      createdAt: serverTimestamp(),
      ownerUid: currentUser.uid,
    }

    try {
      const vendorsRef = doc(db, 'vendors', currentUser.uid)
      await setDoc(vendorsRef, vendorDoc)

      // update user doc
      const userRef = doc(db, 'users', currentUser.uid)
      await setDoc(userRef, { isVendor: true, role: 'vendor' }, { merge: true })

        // update redux auth state so routes recognize vendor immediately
        try {
          if (currentUser) {
            dispatch(setUser({ user: currentUser, profile: { role: 'vendor', isVendor: true } }))
          }
        } catch (err) {
          console.warn('Failed to update local auth state', err)
        }

      setToast('Vendor profile created successfully')
      setShowModal(true)
    } catch (err) {
      console.error('Failed to create vendor profile', err)
      setToast('Failed to create vendor profile')
    }
  }

  const handleGoToDashboard = () => {
    setShowModal(false)
    navigate('/vendor/dashboard')
  }

  return (
    <div className="w-[95%] md:w-[40%] min-h-screen flex flex-col items-center py-12">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Start Selling Today</h1>
          <p className="text-sm text-gray-600">Create your vendor profile and connect with the UI community</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={vendorSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="space-y-6">
              {/* Form Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col gap-6">
                  <Field name="fullName">
                    {() => (
                      <Input
                        label="Vendor Name"
                        name="vendorName"
                        placeholder="Enter your full name"
                        required
                        value={values.vendorName}
                        onChange={handleChange}
                        formikOnBlur={handleBlur}
                        externalError={errors.vendorName as string | undefined}
                        externalTouched={Boolean(touched.vendorName)}
                      />
                    )}
                  </Field>

                  <Field name="businessName">
                    {() => (
                      <Input
                        label="Business Name"
                        name="businessName"
                        placeholder="Enter your business name"
                        required
                        value={values.businessName}
                        onChange={handleChange}
                        formikOnBlur={handleBlur}
                        externalError={errors.businessName as string | undefined}
                        externalTouched={Boolean(touched.businessName)}
                      />
                    )}
                  </Field>

                  <Field name="category">
                    {() => (
                      <Input
                        label="Category"
                        name="category"
                        variant="select"
                        options={categories}
                        placeholder="Select a category"
                        required
                        value={values.category}
                        onChange={handleChange}
                        formikOnBlur={handleBlur}
                        externalError={errors.category as string | undefined}
                        externalTouched={Boolean(touched.category)}
                      />
                    )}
                  </Field>

                  <Field name="whatsapp">
                    {() => (
                      <div>
                        <label className="block mb-1 text-sm font-medium">WhatsApp Number</label>
                        <div className="flex">
                          <div className="inline-flex items-center px-3 rounded-l-md bg-gray-100 border border-r-0">+234</div>
                          <input
                            name="whatsappNumber"
                            placeholder="8123456789"
                            value={values.whatsappNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="flex-1 px-3 py-2 border rounded-r-md"
                          />
                        </div>
                        {errors.whatsappNumber && touched.whatsappNumber && <div className="text-xs text-red-500 mt-1">{errors.whatsappNumber as string}</div>}
                      </div>
                    )}
                  </Field>

                  <div className="md:col-span-2">
                    <Field name="bio">
                      {() => (
                        <div>
                          <label className="block mb-1 text-sm font-medium">Business Details (Bio)</label>
                          <textarea
                            name="description"
                            placeholder="Tell us about your business"
                            maxLength={500}
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full min-h-[120px] border p-2 rounded"
                          />
                          <div className="text-right text-xs text-gray-500 mt-1">{String(values.description?.length ?? 0)}/500</div>
                          {errors.description && touched.description && <div className="text-xs text-red-500 mt-1">{errors.description as string}</div>}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>

                <div className="mt-6">
                  <button type="submit" className="w-full py-3 rounded-lg bg-[#2563eb] text-white font-semibold">Submit Application</button>
                </div>
              </div>
              {/* simplified onboarding only: no verification or file uploads */}
            </Form>
          )}
        </Formik>
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
          {showModal && (
            <ConfirmationModal
              title="Vendor Profile Created"
              message="Your vendor profile is set up. You can complete more details from your dashboard."
              onConfirm={handleGoToDashboard}
              onClose={() => setShowModal(false)}
            />
          )}
      </div>
    </div>
  )
}

export default CreateProfile
