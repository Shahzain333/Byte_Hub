import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { MailIcon, LockIcon, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/AppContext'

const Login = () => {

  const { axios, loading, setLoading, navigate, isAuth, setUser } = useContext(AppContext)

  // ── Login state ──────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  // ── Forgot password state ────────────────────────────────────
  const [forgotStep, setForgotStep] = useState(null) // null | 'email' | 'otp' | 'reset'
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  // ── Helper: reset all forgot-password state ──────────────────
  const resetForgotState = () => {
    setForgotStep(null)
    setForgotEmail('')
    setForgotOtp('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  // ── Login handler ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/auth/login', formData)
      if (data.success) {
        setUser(data.user)
        await isAuth()
        setUser(data.user)
        toast.success(data.message)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ── Step 1: Send OTP to email ────────────────────────────────
  const handleSendOtp = async () => {
    
    if (!forgotEmail) return toast.error('Please enter your email')

    try {

      setLoading(true)
      
      const { data } = await axios.post('/api/auth/forgot-password', { email: forgotEmail })
      
      if (data.success) {
        
        toast.success(data.message)
        setForgotStep('otp')

      } else {
        toast.error(data.message)
      }
    
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async () => {

    if (forgotOtp.length !== 6) return toast.error('Please enter the complete 6-digit OTP')
    
      try {
    
        setLoading(true)
    
        const { data } = await axios.post('/api/auth/verify-otp', {
          email: forgotEmail,
          otp: forgotOtp,
        })

        if (data.success) {
          toast.success(data.message)
          setForgotStep('reset')
        } else {
          toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: Reset password ───────────────────────────────────
  const handleResetPassword = async () => {
    
    if (!newPassword || !confirmNewPassword) return toast.error('Please fill all fields')
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters')
    if (newPassword !== confirmNewPassword) return toast.error('Passwords do not match')

    try {
      
      setLoading(true)
      
      const { data } = await axios.post('/api/auth/reset-password', {
        email: forgotEmail,
        otp: forgotOtp,
        newPassword,
        confirmPassword: confirmNewPassword,
      })
      
      if (data.success) {
        toast.success(data.message)
        resetForgotState()
      } else {
        toast.error(data.message)
      }
    
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="bg-stone-100 min-h-[calc(100vh-72px)] flex items-center justify-center py-4 px-4">

      <div className="w-full md:max-w-[420px] rounded-[20px] overflow-hidden shadow-xl border border-amber-100 bg-white">

        {/* Header */}
        <div className="px-8 pt-8 pb-5 relative overflow-hidden bg-gradient-to-br from-[#E09A05] via-[#FFB703] to-[#F5C842]">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 left-5 w-20 h-20 rounded-full bg-white/10" />

          <div className="relative z-10 inline-flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 mb-4">
            <span className="text-white text-[13px] font-medium tracking-wide">✦ Welcome Back</span>
          </div>

          <h1 className="relative z-10 text-white text-[30px] leading-tight mb-1"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}>
            Sign in to<br />your account
          </h1>
          <p className="relative z-10 text-white/90 text-[13px]">Continue your journey with us</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Email address
            </label>
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4
              focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">
              <MailIcon size={16} className="text-amber-600 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChangeHandler}
                className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4
              focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">
              <LockIcon size={16} className="text-amber-600 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={onChangeHandler}
                className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 outline-none"
                required
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="text-zinc-400 hover:text-zinc-600 shrink-0">
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password trigger */}
          <div className="flex justify-end -mt-1">
            <button type="button" onClick={() => setForgotStep('email')}
              className="text-[13px] text-amber-600 hover:text-amber-700 transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full h-[46px] rounded-xl bg-[#FFB703] hover:bg-[#E09A05] active:scale-[0.99]
            disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-semibold
            text-[15px] flex items-center justify-center gap-2 mt-2 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </div>
            ) : 'Sign In'}
          </button>

          <p className="text-center text-zinc-500 text-[13px] pt-1">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FFB703] hover:text-[#E09A05] font-medium transition-colors">
              Create account →
            </Link>
          </p>

        </form>

      </div>

      {/* ── Forgot Password Modal ──────────────────────────────── */}
      {forgotStep && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">

            {/* Step 1 — Enter Email */}
            {forgotStep === 'email' && (
              <>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-800">Forgot Password</h2>
                  <p className="text-[13px] text-zinc-500 mt-0.5">Enter your email to receive an OTP</p>
                </div>

                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4
                  focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">
                  
                  <MailIcon size={16} className="text-amber-600 shrink-0" />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                    className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 outline-none"
                    autoFocus
                  />

                </div>

                <div className="flex gap-2">

                  <button type="button" onClick={resetForgotState}
                    className="flex-1 h-10 rounded-xl border border-stone-200 text-zinc-600 text-[14px]
                    hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  
                  <button type="button" onClick={handleSendOtp} disabled={loading}
                    className="flex-1 h-10 rounded-xl bg-[#FFB703] hover:bg-[#E09A05] text-white text-[14px]
                    font-semibold disabled:opacity-60 transition-all flex items-center justify-center gap-2">

                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                      ) : 'Send OTP'
                    }

                  </button>

                </div>
              
              </>

            )}

            {/* Step 2 — Enter OTP */}
            {forgotStep === 'otp' && (
              <>
                
                <div>
                
                  <h2 className="text-lg font-semibold text-zinc-800">Enter OTP</h2>
                  <p className="text-[13px] text-zinc-500 mt-0.5">
                    We sent a 6-digit code to{' '}
                    <span className="text-zinc-700 font-medium">{forgotEmail}</span>
                  </p>
                
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={forgotOtp}
                  onChange={e => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                  className="w-full text-center tracking-[0.5em] text-xl font-semibold bg-stone-50
                  border border-stone-200 rounded-xl h-12 outline-none focus:border-amber-400
                  focus:ring-2 focus:ring-amber-400/15 transition-all"
                  autoFocus
                />

                <p className="text-[12px] text-zinc-400 text-center">
                  Didn't receive it?{' '}
                  <button type="button" onClick={() => { setForgotOtp(''); handleSendOtp() }}
                    className="text-amber-500 hover:text-amber-600 font-medium">
                    Resend OTP
                  </button>
                </p>

                <div className="flex gap-2">

                  <button type="button" onClick={() => { setForgotStep('email'); setForgotOtp('') }}
                    className="flex-1 h-10 rounded-xl border border-stone-200 text-zinc-600 text-[14px]
                    hover:bg-stone-50 transition-all">
                    Back
                  </button>

                  <button type="button" onClick={handleVerifyOtp} disabled={loading || forgotOtp.length !== 6}
                    className="flex-1 h-10 rounded-xl bg-[#FFB703] hover:bg-[#E09A05] text-white text-[14px]
                    font-semibold disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                      ) : 'Verify OTP'}
                  </button>
                
                </div>

              </>
            
            )}

            {/* Step 3 — Reset Password */}
            {forgotStep === 'reset' && (
              <>

                <div>
                  <h2 className="text-lg font-semibold text-zinc-800">Reset Password</h2>
                  <p className="text-[13px] text-zinc-500 mt-0.5">Enter your new password below</p>
                </div>

                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4
                  focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">
                  
                  <LockIcon size={16} className="text-amber-600 shrink-0" />
                  
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 outline-none"
                    autoFocus
                  />

                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="text-zinc-400 hover:text-zinc-600 shrink-0">
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                </div>

                <div className={`flex items-center gap-2 bg-stone-50 border rounded-xl h-11 px-4
                  focus-within:ring-2 transition-all ${
                    confirmNewPassword.length > 0 && newPassword !== confirmNewPassword
                      ? 'border-red-400 focus-within:ring-red-400/15'
                      : 'border-stone-200 focus-within:border-amber-400 focus-within:ring-amber-400/15'
                  }`}>

                  <LockIcon size={16} className="text-amber-600 shrink-0" />
                  
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                    className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 outline-none"
                  />

                  <button type="button" onClick={() =>  setShowConfirmPassword(v => !v)}
                    className="text-zinc-400 hover:text-zinc-600 shrink-0">
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                
                </div>

                {confirmNewPassword.length > 0 && newPassword !== confirmNewPassword && (
                  <p className="text-[11px] text-red-500 -mt-2">Passwords don't match</p>
                )}

                <div className="flex gap-2">
                
                  <button type="button" onClick={resetForgotState}
                    className="flex-1 h-10 rounded-xl border border-stone-200 text-zinc-600 text-[14px]
                    hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                
                  <button type="button" onClick={handleResetPassword} disabled={loading}
                    className="flex-1 h-10 rounded-xl bg-[#FFB703] hover:bg-[#E09A05] text-white text-[14px]
                    font-semibold disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                      ) : 'Reset Password'}
                  
                  </button>
              
                </div>
              
              </>

            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Login
