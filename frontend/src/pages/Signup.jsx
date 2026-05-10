import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { User2Icon, MailIcon, LockIcon, Upload, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/AppContext'

const PasswordStrength = ({ password }) => {

  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#E24B4A', '#EF9F27', '#639922', '#3B6D11']
  const barColors = ['', '#E24B4A', '#EF9F27', '#639922', '#639922']

  if (!password.length) return null

  return (
    <div className="mt-2">

      <div className="flex gap-1">
        
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-[2px] rounded-full transition-all duration-300"
            style={{ background: i <= score ? barColors[score] : '#e5e7eb' }}/>
        ))}

      </div>
      
      <p className="text-[11px] mt-1 font-medium" style={{ color: colors[score] }}>
        {labels[score]}
      </p>

    </div>
  )
}

const Signup = () => {

  const { axios, loading, setLoading, navigate } = useContext(AppContext)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  })
  
  const [file, setFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post('/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/login')
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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFormData((prev) => ({ ...prev, image: selectedFile }))
    }
  }

  return (

    <div className="bg-stone-100 flex items-center justify-center min-h-[calc(100vh-72px)] py-2 px-4">
    
      <div className="w-full md:max-w-[450px] rounded-[20px] overflow-hidden shadow-xl border border-amber-100 
      bg-white">

        {/* Header */}
        <div className="px-8 pt-8 pb-4 relative overflow-hidden bg-gradient-to-br from-[#E09A05] via-[#FFB703] to-[#F5C842]">

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 left-5 w-20 h-20 rounded-full bg-white/10" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 [#E09A05] border 
          border-[#FFB703] rounded-full px-3 py-1 mb-4">
            <span className="text-white text-[13px] font-medium tracking-wide">✦ Welcome</span>
          </div>

          <h1 className="relative z-10 text-white text-[28px] leading-tight mb-1" 
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}>
            Create your<br />account
          </h1>

          <p className="relative z-10 text-white/90 text-[13px]">Join thousands of users today</p>

        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">

          {/* Username & Email */}
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-3'>

            {/* Full Name */}
            <div>

              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Full name
              </label>
              
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11
               px-4 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 
               transition-all">
                <User2Icon size={16} className="text-amber-600 shrink-0" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={onChangeHandler}
                  className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 outline-none"
                  required
                />
            
              </div>
            
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Email address
              </label>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">
                <MailIcon size={16} className="text-amber-600 shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={onChangeHandler}
                  className="flex-1 bg-transparent text-[14px] text-zinc-800 placeholder-zinc-400 
                  outline-none"
                  required
                />
              
              </div>

              {formData.email.length > 0 && !emailValid && (
                <p className="text-[11px] text-red-500 mt-1">Please enter a valid email address</p>
              )}

            </div>

          </div>
        
          {/* File Upload */}
          <div>
            
            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Profile photo
            </label>

            <label htmlFor="fileUpload" className={`flex items-center gap-3 bg-stone-50 border rounded-xl p-3 
            cursor-pointer transition-all ${ file ? 'border-green-400 bg-green-50/50'
                  : 'border-dashed border-stone-300 hover:border-[#FFB703] hover:bg-amber-50/30'}`}>

              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Upload size={16} className="text-amber-700" />
              </div>

              <div className="flex-1 min-w-0">
              
                <p className="text-[13px] font-medium text-zinc-700 truncate">
                  {file ? file.name : 'Click to upload a photo'}
                </p>
              
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {file ? `${(file.size / 1024).toFixed(0)} KB` : 'JPG, PNG, GIF — max 5MB'}
                </p>
              
              </div>
              
              {file && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
              
              <input
                type="file"
                name='file'
                id="fileUpload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
          
            </label>
          
          </div>

          {/* Password row */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2  gap-3">
           
            {/* Password */}
            <div>
           
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
           
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl h-11 px-4 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15 transition-all">
           
                <LockIcon size={16} className="text-amber-600 shrink-0" />
           
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 8 chars"
                  value={formData.password}
                  onChange={onChangeHandler}
                  className="flex-1 bg-transparent text-[13px] text-zinc-800 placeholder-zinc-400 
                  outline-none min-w-0"
                  required
                />
           
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="text-zinc-400 hover:text-zinc-600 shrink-0"
                  aria-label="Toggle password visibility">

                  {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                
                </button>
           
              </div>
           
              <PasswordStrength password={formData.password} />
           
            </div>

            {/* Confirm */}
            <div>
              
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Confirm
              </label>
              
              <div className={`flex items-center gap-2 bg-stone-50 border rounded-xl h-11 px-4 
              focus-within:ring-2 transition-all ${passwordsMatch
                  ? 'border-red-400 focus-within:ring-red-400/15'
                  : 'border-stone-200 focus-within:border-amber-400 focus-within:ring-amber-400/15'
              }`}>
              
                <LockIcon size={16} className="text-amber-600 shrink-0" />
              
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={onChangeHandler}
                  className="flex-1 bg-transparent text-[13px] text-zinc-800 placeholder-zinc-400 outline-none 
                  min-w-0"
                  required
                />
              
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="text-zinc-400 hover:text-zinc-600 shrink-0"
                  aria-label="Toggle confirm password visibility"
                >
                  
                  {showConfirm ? <Eye size={15} /> : <EyeOff size={15} />}

                </button>
          
              </div>
          
              {passwordsMatch && (
                <p className="text-[11px] text-red-500 mt-1">Passwords don't match</p>
              )}

            </div>
          
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] rounded-xl bg-[#FFB703] hover:bg-[#E09A05] active:scale-[0.99] 
            disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-semibold 
            text-[15px] flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            { loading ?
              <div className='flex items-center justify-center gap-2'>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Creating Account...
              </div> : 
              "Creating Account"
            }
          </button>

          <p className="text-center text-zinc-500 text-[13px] pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FFB703] hover:text-[#E09A05] font-medium transition-colors">
              Sign in →
            </Link>
          </p>

        </form>

      </div>
    
    </div>
  )
}

export default Signup