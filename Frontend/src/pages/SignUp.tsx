
import { useState } from 'react'
import { Input } from '../components/Auth/Input'
import { Link } from 'react-router-dom'
import { RiGoogleFill } from 'react-icons/ri'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [checked, setChecked] = useState(false)

  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [termsError, setTermsError] = useState<string | null>(null)

  const hasErrors = Boolean(nameError || emailError || passwordError || confirmError || termsError)
  const isIncomplete = !name || !email || !password || !confirmPassword || !checked

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasErrors || isIncomplete) return
    // TODO: call signup API
    console.log('Sign up with:', { name, email, password, checked })
  }

  return (
    <div className="w-full min-h-screen bg-[#e7eeff] flex flex-col justify-center items-center py-10">
      <h1 className="font-semibold text-[#2563eb] text-3xl" style={{ fontFamily: 'cursive' }}>UniMart</h1>
      <form onSubmit={handleSubmit} className="mt-6 bg-white w-[90%] max-w-[400px] rounded-2xl p-6 shadow">
        <div className='flex flex-col justify-center items-center mb-8'>
          <h1 className='text-lg md:text-2xl font-bold'>Create Your Account</h1>
          <p className='text-sm text-gray-500'>Join the UI student marketplace</p>
        </div>
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="Jane Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(err) => setNameError(err)}
          />
          <Input
            label="Email (School Email Recommended)"
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
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(err) => setPasswordError(err)}
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            required
            value={confirmPassword}
            confirmWith={password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={(err) => setConfirmError(err)}
          />
        </div>
        <div className='mt-4'>
          <Input
            name="terms"
            type="checkbox"
            required
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            onBlur={(err) => setTermsError(err)}
          >
            <span className='text-xs'>I agree to the <Link to="/terms" className="text-[#2563eb] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link></span>
          </Input>
        </div>
        <button
          type="submit"
          disabled={hasErrors || isIncomplete}
          className={` w-full py-2 rounded text-white font-medium transition-colors ${hasErrors || isIncomplete ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Create account
        </button>
        <span className='w-full flex justify-center items-center py-2 mt-4  rounded-md font-medium border border-gray-300'> <RiGoogleFill className='mr-2 text-[#2563eb]' size={20} /> Continue with Google</span>
        <div className='flex flex-col mt-4 gap-1 justify-center items-center'>
          <span className='text-xs text-gray-600 font-normal'>Don't have an account? <Link to="/login" className="text-[#2563eb] hover:underline">Log in</Link></span>
        </div>
      </form>
      <span className="text-xs mt-3 text-gray-600">By continuing, you agree to our <Link to="/terms" className="text-[#2563eb] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2563eb] hover:underline">Privacy Policy</Link></span>

    </div>
  )
}

export default SignUp
