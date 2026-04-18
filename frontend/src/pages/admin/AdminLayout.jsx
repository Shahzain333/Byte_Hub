import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { LayoutDashboard, Plus, Package, Grid3X3, ShoppingCart, BookAIcon, Menu, X } from 'lucide-react'
import { useLocation, Link, Outlet } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CiMenuFries } from 'react-icons/ci'
import { MdOutlineClose } from "react-icons/md";

const AdminLayout = () => {

  const { setAdmin, axios } = useContext(AppContext)

  const location = useLocation()
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: '/admin/add-category',
      name: 'Add Category',
      icon: Plus
    },
    {
      path: '/admin/add-menu',
      name: 'Add Menu',
      icon: Package
    },
    {
      path: '/admin/categories',
      name: 'All Categories',
      icon: Grid3X3
    },
    {
      path: '/admin/menus',
      name: 'All Menus',
      icon: Grid3X3
    },
    {
      path: '/admin/orders',
      name: 'Orders',
      icon: ShoppingCart
    },
    {
      path: '/admin/bookings',
      name: 'Bookings',
      icon: BookAIcon
    }
  ]

  const isActive = (path, exact=false) => {
    
    if(exact) {
      return location.pathname === path
    }

    return location.pathname === path
  
  }

  const logout = async () => {

    try {
  
      const { data } = await axios.post('/api/aut/logout')
  
      if(data.success) {
        toast.success(data.message)
        setAdmin(null)
      } else {
        toast.error(data.message)
      }
  
    } catch (error) {
      toast.error("Something went wrong")
      console.log("Error in Logout Admin", error)
    }
  
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      
      {/* Mobile Menu Button */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        
        <button onClick={() => setIsSideBarOpen(!isSideBarOpen)} className='p-2 rounded-md bg-white 
        shadow-lg hover:bg-gray-50 transition-colors text-[#E09A05] text-[1.8rem]'>
          { isSideBarOpen ? <MdOutlineClose /> : <CiMenuFries /> }
        </button>

      </div>

      {/* SideBar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform
        duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${ isSideBarOpen ? "translate-x-0" 
        : "-translate-x-full" }`}>

          <div className='flex flex-col h-full'>
          
            {/* Logo Header */}
            <div className='mt-17 md:mt-10 mx-4 flex items-center justify-center h-16 px-4 
            bg-[#E09A05] text-white rounded-lg'>
              <h1 className='text-xl font-bold'>Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto lg:pt-10'>
              {
                menuItems.map((item) => {

                  const Icon = item.icon
                  const active = isActive(item.path, item.exact) 

                  return (

                    <Link to={item.path} key={item.path} onClick={() => setIsSideBarOpen(!isSideBarOpen)} 
                    className={`flex items-center px-4 py-3 text-sm md:text-md font-medium rounded-lg transition-all duration-200
                    ${active ? "bg-blue-100 text-primary border-r-4 border-[#E09A05]" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                      <Icon size={20} className='mr-3 text-[#E09A05]'/>
                      {item.name}
                    </Link>
                  
                )

                })
              }
            </nav>

            {/* footer */}
            <footer className='p-4 border-t border-gray-100'>
           
              <div className='flex items-center text-sm text-gray-500'>
           
                <div className='w-8 h-8 bg-gray-300 rounded-full mr-3'></div>

                <div className=''>
                  <div className='font-medium text-gray-900'>Admin User</div>
                  <div>admin@bytehub.com</div>
                </div>
           
              </div>
           
            </footer>

          </div>

      </aside>

      {/* Mobile overlay */}
      {
        isSideBarOpen && (
          <div onClick={() => setIsSideBarOpen(false)} className='fixed inset-0 bg-black/80 
          bg-opacity-50 z-30 lg:hidden'></div>
        )
      }

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
        
        {/* Top Bar */}
        <header className='bg-white shadow-sm border-b border-gray-200 lg:pl-0 pl-16'>
          
          <div className='flex items-center justify-between px-6 py-4'>
          
            <h2 className='text-2xl font-semibold text-gray-800'>
              {
                menuItems.find((item) => isActive(item.path, item.exact))?. name || "Admin apnel"
              }
            </h2>

            <div className='hidden md:flex items-center space-x-4'>
              <div className='text-sm text-gray-500'>
                <p className='cursor-pointer hover:underline text-red-500 text-lg font-semibold'
                onClick={logout}>Logout</p>
              </div>
            </div>
          
          </div>
        </header>

        {/* Content Area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6'>
          <div className='max-w-7xl mx-auto'>
            <Outlet/>
          </div>
        </main>

      </div>
          

    </div>
  )
}

export default AdminLayout