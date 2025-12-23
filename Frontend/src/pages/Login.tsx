import { Formik, Field, Form } from 'formik'
import Input from '../components/Auth/Input'
import loginSchema from '../lib/formSchemas/loginSchema'
import type { LoginFormValues } from '../types/login'
import { Link } from 'react-router-dom'
import { RiGoogleFill } from 'react-icons/ri'

const initialValues: LoginFormValues = { email: '', password: '' }

const Login = () => {
  const handleSubmit = (values: LoginFormValues) => {
    // TODO: call login API
    console.log('Login with:', values)
  }

  return (
    <div className="w-full min-h-screen bg-[#e7eeff] flex flex-col justify-center items-center py-10">
      <h1 className="font-semibold text-[#2563eb] text-3xl" style={{ fontFamily: 'cursive' }}>UniMart</h1>
      <div className="mt-10 bg-white w-[90%] max-w-[400px] rounded-2xl p-6 shadow">
        <div className='flex flex-col justify-center items-center mb-8'>
          <h1 className='text-lg md:text-2xl font-bold'>Welcome Back to Unimart</h1>
          <p className='text-sm text-gray-500'>Sign in to access your account</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
          {({ handleBlur, handleChange, values, errors, touched }) => (
            <Form className="space-y-4">
              <Field name="email">
                {() => (
                  <Input
                    label="Email/School Email"
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
                    placeholder="Enter your password"
                    required
                    value={values.password}
                    onChange={handleChange}
                    formikOnBlur={handleBlur}
                    externalError={errors.password as string | undefined}
                    externalTouched={Boolean(touched.password)}
                  />
                )}
              </Field>

              <button type="submit" className="mt-4 w-full py-2 rounded-md text-white bg-blue-600">Log In</button>
            </Form>
          )}
        </Formik>

        <span className='w-full flex justify-center items-center py-2 mt-4 rounded-md font-medium border border-gray-300'> <RiGoogleFill className='mr-2 text-[#2563eb]' size={20}/> Continue with Google</span>
        <div className='flex flex-col mt-4 gap-1 justify-center items-center'>
          <span className='text-xs text-[#2563eb] font-medium'>Forgot password?</span>
          <span className='text-xs text-gray-600 font-normal'>Don't have an account? <Link to="/signup" className="text-[#2563eb] hover:underline">Sign up</Link></span>
        </div>
      </div>

      <span className="text-xs mt-3 text-gray-600">By continuing, you agree to our <Link to="/terms" className="text-[#2563eb] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link></span>
    </div>
  )
}

export default Login
