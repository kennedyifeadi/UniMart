import { Formik, Form, Field } from 'formik'
import artisanSchema from '../../lib/formSchemas/artisanSchema'
import type { IVendorProfile } from '../../types/vendor'
import Input from '../../components/Auth/Input'
import { HiShieldCheck } from 'react-icons/hi'

const categories = [
  { value: 'food', label: 'Food' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'education', label: 'Education' }
]

const initialValues: IVendorProfile = {
  fullName: '',
  businessName: '',
  category: '',
  bio: '',
  whatsapp: '',
  studentIdFile: null
}

export const CreateProfile = () => {
  const handleSubmit = (values: IVendorProfile) => {
    // TODO: wire to artisanService
    console.log('Vendor profile:', values)
  }

  return (
    <div className="w-[95%] md:w-[40%] min-h-screen flex flex-col items-center py-12">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Start Selling Today</h1>
          <p className="text-sm text-gray-600">Create your vendor profile and connect with the UI community</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={artisanSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <Form className="space-y-6">
              {/* Form Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col gap-6">
                  <Field name="fullName">
                    {() => (
                      <Input
                        label="Vendor Name"
                        name="fullName"
                        placeholder="Enter your full name"
                        required
                        value={values.fullName}
                        onChange={handleChange}
                        formikOnBlur={handleBlur}
                        externalError={errors.fullName as string | undefined}
                        externalTouched={Boolean(touched.fullName)}
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
                      <Input
                        label="WhatsApp Number"
                        name="whatsapp"
                        placeholder="8123456789"
                        required
                        prefix={<span className="font-medium">+234</span>}
                        value={values.whatsapp}
                        onChange={handleChange}
                        formikOnBlur={handleBlur}
                        externalError={errors.whatsapp as string | undefined}
                        externalTouched={Boolean(touched.whatsapp)}
                      />
                    )}
                  </Field>

                  <div className="md:col-span-2">
                    <Field name="bio">
                      {() => (
                        <Input
                          label="Business Details (Bio)"
                          name="bio"
                          variant="textarea"
                          placeholder="Tell us about your business"
                          required
                          maxLength={500}
                          value={values.bio}
                          onChange={handleChange}
                          formikOnBlur={handleBlur}
                          externalError={errors.bio as string | undefined}
                          externalTouched={Boolean(touched.bio)}
                        />
                      )}
                    </Field>
                  </div>
                </div>

                <div className="mt-6">
                  <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold">Submit Application</button>
                </div>
              </div>

              {/* Verification Card */}
              <div className="bg-green-50 rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <HiShieldCheck className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-1">Verify Your Business with UI</h3>
                <p className="text-sm text-gray-700 mb-4">Uploading your student ID helps verify you as a student vendor — it increases trust and visibility among fellow students.</p>

                <div className="w-full max-w-md">
                  <label className="block mb-2 text-sm font-medium">Student ID Card (Optional but Recommended)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0]
                      setFieldValue('studentIdFile', file ?? null)
                    }}
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white file:text-sm file:font-semibold file:text-blue-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CreateProfile
