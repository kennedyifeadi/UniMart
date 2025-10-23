
import { useState } from 'react'
import { Input } from '../components/Auth/Input'
import { Link } from 'react-router-dom'
import { RiGoogleFill } from "react-icons/ri";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const hasErrors = Boolean(emailError || passwordError)
  const isIncomplete = !email || !password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasErrors || isIncomplete) return
    // TODO: call login API
    console.log('Login with:', { email, password })
  }
  return (
    <div className="w-full min-h-screen bg-[#e7eeff] flex flex-col justify-center items-center py-10">
      <h1 className="font-semibold text-[#2563eb] text-3xl" style={{ fontFamily: 'cursive' }}>UniMart</h1>
      <form onSubmit={handleSubmit} className="mt-10 bg-white w-[90%] max-w-[400px] rounded-2xl p-6 shadow">
        <div className='flex flex-col justify-center items-center mb-8'>
          <h1 className='text-lg md:text-2xl font-bold'>Welcome Back to Unimart</h1>
          <p className='text-sm text-gray-500'>Sign in to access your account</p>
        </div>
        <div className="space-y-4 flex flex-col gap-2">
          <Input
            label="Email/School Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(err) => setEmailError(err)}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(err) => setPasswordError(err)}
          />
        </div>
        <button
          type="submit"
          disabled={hasErrors || isIncomplete}
          className={`mt-8 w-full py-2 rounded-md text-white font-medium transition-colors ${
            hasErrors || isIncomplete ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-[#2563eb] cursor-pointer'
          }`}
        >
          Log In
        </button>
        <span className='w-full flex justify-center items-center py-2 mt-4  rounded-md font-medium border border-gray-300'> <RiGoogleFill className='mr-2 text-[#2563eb]' size={20}/> Continue with Google</span>
        <div className='flex flex-col mt-4 gap-1 justify-center items-center'>
          <span className='text-xs text-[#2563eb] font-medium'>Forgot password?</span>
          <span className='text-xs text-gray-600 font-normal'>Don't have an account? <Link to="/signup" className="text-[#2563eb] hover:underline">Sign up</Link></span>
        </div>
      </form>
      <span className="text-xs mt-3 text-gray-600">By continuing, you agree to our <Link to="/terms" className="text-[#2563eb] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link></span>
    </div>
  )
}

export default Login
