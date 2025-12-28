import { Formik, Field, Form } from 'formik'
import Input from '../components/Auth/Input'
import registerSchema from '../lib/formSchemas/registerSchema'
import type { SignUpFormValues } from '../types/signUp'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { registerUser, loginWithGoogle } from '../store/slices/authSlice'

const initialValues: SignUpFormValues = { name: '', email: '', password: '', confirmPassword: '', terms: false }

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (values: SignUpFormValues) => {
    setError(null)
    setLoading(true)
    try {
      const payload = await dispatch(registerUser({ email: values.email, password: values.password, fullName: values.name })).unwrap()
      setSuccess('Account created successfully')
      const role = (payload as any)?.profile?.role ?? ((payload as any)?.profile?.isVendor ? 'vendor' : 'user')
      setTimeout(() => navigate(role === 'vendor' ? '/vendor/dashboard' : '/dashboard'), 700)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const payload = await dispatch(loginWithGoogle()).unwrap()
      const role = (payload as any)?.profile?.role ?? ((payload as any)?.profile?.isVendor ? 'vendor' : 'user')
      navigate(role === 'vendor' ? '/vendor/dashboard' : '/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Google sign-in failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#e7eeff] flex flex-col justify-center items-center py-10">
      <h1 className="font-semibold text-[#2563eb] text-3xl" style={{ fontFamily: 'cursive' }}>UniMart</h1>
      <div className="mt-6 bg-white w-[90%] max-w-[400px] rounded-2xl p-6 shadow">
        <div className='flex flex-col justify-center items-center mb-8'>
          <h1 className='text-lg md:text-2xl font-bold'>Create Your Account</h1>
          <p className='text-sm text-gray-500'>Join the UI student marketplace</p>
        </div>

        {error && <div className="mb-4 p-2 text-sm text-white bg-red-500 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 text-sm text-white bg-green-500 rounded">{success}</div>}

        <Formik initialValues={initialValues} validationSchema={registerSchema} onSubmit={handleSubmit}>
          {({ handleBlur, handleChange, values, errors, touched }) => (
            <Form className="space-y-4">
              <Field name="name">
                {() => (
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={values.name}
                    onChange={handleChange}
                    formikOnBlur={handleBlur}
                    externalError={errors.name as string | undefined}
                    externalTouched={Boolean(touched.name)}
                  />
                )}
              </Field>

              <Field name="email">
                {() => (
                  <Input
                    label="Email (School Email Recommended)"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={values.email}
                    onChange={handleChange}
                    formikOnBlur={handleBlur}
                    externalError={errors.email as string | undefined}
                    externalTouched={Boolean(touched.email)}
                  />
                )}
              </Field>

              <Field name="password">
                {() => (
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    value={values.password}
                    onChange={handleChange}
                    formikOnBlur={handleBlur}
                    externalError={errors.password as string | undefined}
                    externalTouched={Boolean(touched.password)}
                  />
                )}
              </Field>

              <Field name="confirmPassword">
                {() => (
                  <Input
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    required
                    value={values.confirmPassword}
                    onChange={handleChange}
                    formikOnBlur={handleBlur}
                    confirmWith={values.password}
                    externalError={errors.confirmPassword as string | undefined}
                    externalTouched={Boolean(touched.confirmPassword)}
                  />
                )}
              </Field>

              <div>
                <Field name="terms">
                  {() => (
                    <Input
                      name="terms"
                      type="checkbox"
                      required
                      checked={values.terms}
                      onChange={handleChange}
                      formikOnBlur={handleBlur}
                      externalError={errors.terms as string | undefined}
                      externalTouched={Boolean(touched.terms)}
                    >
                      <span className='text-xs'>I agree to the <Link to="/terms" className="text-[#2563eb] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link></span>
                    </Input>
                  )}
                </Field>
              </div>

              <button type="submit" className="w-full py-2 rounded text-white bg-[#2563eb] flex items-center justify-center" disabled={loading}>
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create account'}
              </button>
            </Form>
          )}
        </Formik>

        <button onClick={handleGoogle} className='w-full mt-3 flex justify-center items-center py-2 rounded-md font-medium border border-gray-300'> <LogIn className='mr-2 text-[#2563eb]' size={20} /> Continue with Google</button>
        <div className='flex flex-col mt-4 gap-1 justify-center items-center'>
          <span className='text-xs text-gray-600 font-normal'>Already have an account? <Link to="/login" className="text-[#2563eb] hover:underline">Log in</Link></span>
        </div>
      </div>

      <span className="text-xs mt-3 text-gray-600">By continuing, you agree to our <Link to="/terms" className="text-[#2563eb] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link></span>
    </div>
  )
}

export default SignUp
