import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import { Calendar, LogOut, Package, ShoppingCart, UserCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { CiMenuFries } from 'react-icons/ci'

const Navbar = () => {
    
    const { navigate, user, setUser, axios } = useContext(AppContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const NavbarLinks = [
        {name:"Home", path:"/"},
        {name:"Menu", path:"/menu"},
        {name:"Reservation", path:"/book-table"},
        {name:"Contact", path:"/contact"}
    ]

    const handleLogOut = async () => {
        try {
            const { data } = await axios.post('/api/auth/logout')
            if(data.success) {
                setUser(null)
                toast.success(data.message)
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in Handle Logout Navbar", error)   
        }
    }

    const handleLogoutAndClose = async () => {
        await handleLogOut()
        setIsMenuOpen(false)
    }

    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false)
            }
        }

        if(isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [isMenuOpen])

  return (
    <nav className='bg-cyan-50 shadow-md sticky top-0 z-50 py-3'>

        <div className='max-w-7xl mx-auto px-1 sm:px-6 lg:px-8'>

            {/* Large Devices For Desktop */}
            <div className='flex items-center justify-between h-16'>
            
                {/* left - Logo */}
                <div className='flex items-center'>
                    <Link to="/" className='text-2xl font-bold text-blue-600'>
                      <img src={logo} alt='logo' className='w-32'/>
                    </Link>
                </div>
                
                {/* Mid - Menu Items {Desktop} */}
                <ul className="hidden md:flex items-center space-x-8 text-base text-[#1A1A1A]">
                    
                    {NavbarLinks.map((link, index) => (
                        
                        <li key={index} className="relative group capitalize">
                            <NavLink to={link.path} className={({ isActive }) => isActive ? 
                                "text-[#E09A05]" : "text-[#1A1A1A]" }>
                                {link.name}

                                {/* underline effect */}
                                <span className={`test absolute left-0 -bottom-1 w-0 h-0.5 
                                bg-[#E09A05] transition-all duration-300 group-hover:w-full`}></span>

                            </NavLink>
                        </li>

                    ))}
                
                </ul>

                {/* Right - Cart & Login/Profile */}
                <div className={`flex items-center space-x-2`}>
                    
                    <button onClick={() => navigate('/cart')} className='relative p-2 group
                    rounded-lg transition-colors hover:cursor-pointer'>
                        <ShoppingCart size={22} className='text-gray-700'/>
                        <span className='absolute -top-1 -right-1 bg-[#FFB703] group-hover:bg-[#E09A05] text-white text-xs
                        rounded-full w-5 h-5 flex items-center justify-center font-medium'>3</span>
                    </button>

                    <div className='hidden md:block'>
                        { user ? (
                            <div className='relative'>
                                
                                <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                                onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                                    <UserCircle size={30} className='text-gray-700'/>
                                </button>

                                { 
                                    isProfileOpen && (
                                        <div onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}
                                        className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100'>
                                            
                                            <Link to={'/my-bookings'} className='flex items-center px-4 py-2 text-gray-700
                                            hover:bg-gray-100 transition-colors'>
                                                <Calendar size={18} className='mr-3'/>
                                                My Bookings
                                            </Link>
                                            
                                            <Link to={'/my-orders'} className='flex items-center px-4 py-2 text-gray-700
                                            hover:bg-gray-100 transition-colors'>
                                                <Package size={18} className='mr-3'/>
                                                My Orders
                                            </Link>
                                            
                                            <button onClick={handleLogOut} className='flex item-center w-full px-4 py-2 text-[#E09A05] hover:bg-red-50 
                                            transition-colors'>
                                                <LogOut size={18} className='mr-3' /> 
                                                Logout
                                            </button>

                                        </div>
                                    )
                                }

                            </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className='bg-[#FFB703] hover:bg-[#E09A05] text-white px-6
                                py-2 rounded-lg transition-colors font-medium cursor-pointer'>
                                    Login
                                </button>                           
                            )
                        }
                    </div>

                    {/* Menu Icon */}
                    <div ref={menuRef} className="md:hidden">

                        <CiMenuFries
                            className="text-[1.8rem] text-[#E09A05]"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        />

                    </div>
                
                </div>
            
            </div>

            {/* Small Devices For Mobile Menu Sidebar */}
            <aside className={`${ isMenuOpen ? "translate-x-0 opacity-100 z-20" : `-translate-x-[200px] 
            opacity-0 z-[-1]`} md:hidden bg-gray-100 px-5 py-5 text-left absolute left-0 top-23 
            w-full transition-all duration-300 flex flex-col gap-4`}>

                <ul className="flex flex-col gap-4 text-[15px] text-[#1A1A1A]">
                
                    {NavbarLinks.map((link, index) => (
                        <li key={index} className="relative group capitalize">

                            <NavLink to={link.path} onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => isActive ? "text-[#E09A05]" 
                                : "text-[#1A1A1A]"}>
                                {link.name}
                            </NavLink>  

                            {/* <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#E09A05] 
                            transition-all duration-300 group-hover:w-full"></span> */}
                        
                        </li>
                    ))}

                </ul>

                {user ? (
                    <button onClick={handleLogoutAndClose} className='
                    bg-[#FFB703] hover:bg-[#E09A05] text-white px-6 py-2 rounded-lg 
                    transition-colors font-medium cursor-pointer'>
                        Log Out
                    </button>
                    ) : (
                    <button onClick={() => { navigate('/login'), setIsMenuOpen(false) }} className='
                    bg-[#FFB703] hover:bg-[#E09A05] text-white px-6 py-2 rounded-lg 
                    transition-colors font-medium cursor-pointer'>
                        Login
                    </button>   
                )}
            </aside>
            
        </div>

    </nav>
  )
}

export default Navbar