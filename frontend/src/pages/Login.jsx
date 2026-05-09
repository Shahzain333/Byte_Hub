import { React, useContext, useState } from "react"
import { Link } from 'react-router-dom'
import { MailIcon, LockIcon, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AppContext } from "../context/AppContext"

const Login = () => {

  const { axios, loading, setLoading, navigate, isAuth } = useContext(AppContext)

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const { data } = await axios.post("/api/auth/login", formData)

      if (data.success) {
        await isAuth()
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

  return (

    <div className="bg-stone-100 min-h-[calc(100vh-72px)] flex items-center justify-center py-4 px-4">

      <div className="w-full md:max-w-[420px] rounded-[20px] overflow-hidden shadow-xl border border-amber-100 bg-white">

        {/* Header */}
        <div className="px-8 pt-8 pb-5 relative overflow-hidden bg-gradient-to-br from-[#E09A05] via-[#FFB703] to-[#F5C842]">

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 left-5 w-20 h-20 rounded-full bg-white/10" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 mb-4">
            <span className="text-white text-[13px] font-medium tracking-wide">
              ✦ Welcome Back
            </span>
          </div>

          <h1
            className="relative z-10 text-white text-[30px] leading-tight mb-1"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
          >
            Sign in to<br />your account
          </h1>

          <p className="relative z-10 text-white/90 text-[13px]">
            Continue your journey with us
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Email */}
          <div>

            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Email address
            </label>

            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">

              <MailIcon size={16} className="text-amber-600 shrink-0" />

              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-[14px] pt-1 pb-1 text-zinc-800 placeholder-zinc-400 
                outline-none"
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                required
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Password
            </label>

            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">

              <LockIcon size={16} className="text-amber-600 shrink-0" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="flex-1 bg-transparent text-[14px] text-zinc-800 pt-1 pb-1 placeholder-zinc-400 outline-none"
                name="password"
                value={formData.password}
                onChange={onChangeHandler}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}

              </button>

            </div>

          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-1">
          
            <button type="button" className="text-[13px] text-amber-600 hover:text-amber-700 
            transition-colors">
              Forgot Password?
            </button>
          
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] rounded-xl bg-[#FFB703] hover:bg-[#E09A05] active:scale-[0.99]
            disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-semibold
            text-[15px] flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            {
              loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )
            }
          </button>

          {/* Footer */}
          <p className="text-center text-zinc-500 text-[13px] pt-1">
            Don't have an account?{' '}
            <Link
              to={"/signup"}
              className="text-[#FFB703] hover:text-[#E09A05] font-medium transition-colors"
            >
              Create account →
            </Link>
          </p>

        </form>

      </div>

    </div>
  )
}

export default Login