import { React, useState } from 'react'
import { Link } from 'react-router-dom'
import { User2Icon, MailIcon, LockIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Signup = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      toast.success("Registered Successfuly!")
      console.log(formData)
    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
      <div className="py-12 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-[350px] text-center border border-zinc-300/60 dark:border-zinc-700 rounded-2xl px-8 bg-white dark:bg-zinc-900"
        >
          <h1 className="text-zinc-900 dark:text-white text-3xl mt-10 font-medium">
            Register
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 pb-6">
            Please sign up to continue
          </p>

          <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border 
          border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
            {/* User Icon */}
            <User2Icon className="text-white" />
            <input
              type="text"
              placeholder="Name"
              className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 
              dark:placeholder-zinc-400 outline-none text-sm w-full h-full"
              name="name"
              value={formData.name}
              onChange={onChangeHandler}
              required
            />
          </div>

          <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
            {/* Mail Icon */}
            <MailIcon className="text-white" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              required
            />
          </div>

          <div className="flex items-center mt-4 w-full bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
            {/* Lock Icon */}
            <LockIcon className="text-white" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full"
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              required
            />
          </div>

          <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-orange-500 
          hover:opacity-90 transition-opacity cursor-pointer">
            Register
          </button>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 mb-11">
            Already have an account?
            <Link to={"/login"} className="text-indigo-500 dark:text-indigo-400">
              Login
            </Link>
          </p>
        </form>
      </div>
    )
}

export default Signup