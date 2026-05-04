import { React, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { User2Icon, MailIcon, LockIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/AppContext'

const Signup = () => {

  const { axios, loading, setLoading, navigate } = useContext(AppContext)

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
      
      e.preventDefault()
      
      try {
        setLoading(true)
        const { data } = await axios.post("/api/auth/register", formData)
        
        if(data.success) {
          toast.success(data.message)
          navigate('/login')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        setLoading(false)
      }

    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
      <div className="min-h-[calc(100vh-72px)] bg-cyan-50 py-4 px-2 md:px-0 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-[380px] text-center border border-amber-200 rounded-2xl px-4 md:px-8 bg-white shadow-md"
        >
          {/* Header accent bar */}
          <div className="w-16 h-1 bg-[#FFB703] rounded-full mx-auto mt-10 mb-4" />

          <h1 className="text-[#1A1A1A] text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-zinc-500 text-sm mt-2 pb-6">
            Please sign up to continue
          </p>

          {/* Name Field */}
          <div className="flex items-center w-full mt-4 bg-amber-50 border border-amber-200
          h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#FFB703] transition-colors">
            <User2Icon size={18} className="text-[#E09A05] shrink-0" />
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent text-[#1A1A1A] placeholder-zinc-400 
              outline-none text-sm w-[80%] h-full"
              name="username"
              value={formData.username}
              onChange={onChangeHandler}
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center w-full mt-4 bg-amber-50 border border-amber-200
          h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#FFB703] transition-colors">
            <MailIcon size={18} className="text-[#E09A05] shrink-0" />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent text-[#1A1A1A] placeholder-zinc-400 outline-none 
              text-sm w-[80%] h-full"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center mt-4 w-full bg-amber-50 border border-amber-200 
          h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#FFB703] transition-colors">
            <LockIcon size={18} className="text-[#E09A05] shrink-0" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-[#1A1A1A] placeholder-zinc-400 outline-none 
              text-sm w-[80%] h-full"
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              required
            />
          </div>

          <button type="submit" className="mt-5 w-full h-11 rounded-full text-white bg-[#FFB703] 
          hover:bg-[#E09A05] transition-colors cursor-pointer font-medium shadow-sm">
            {loading ? "Loading..." : "Create Account" }
          </button>

          <p className="text-zinc-500 text-sm mt-3 mb-10">
            Already have an account?{' '}
            <Link to={"/login"} className="text-[#FFB703] hover:text-[#E09A05] font-medium transition-colors">
              Login
            </Link>
          </p>
        </form>
      </div>
    )
}

export default Signup
