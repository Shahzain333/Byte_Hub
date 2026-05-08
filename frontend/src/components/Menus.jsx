import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import MenuCard from '../components/MenuCard'
import { Link, NavLink } from 'react-router-dom'

const Menus = () => {
    
    const { menus, navigate } = useContext(AppContext)

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-12'>

        <div className="container mx-auto px-4">
        
            <div className="text-center mb-12">
                
                <h1 className="text-4xl font-bold mb-3">
                    Our <span className="text-[#FFB703]">Menu</span>
                </h1>
                
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {" "}
                    Explore our delicious selection of handcrafted dishes made with the
                    finest ingredients
                </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {menus.slice(0, 8).map((menu) => (
                    <MenuCard key={menu._id} menu={menu} />
                ))}
            
            </div>

            {/* "View Full Menu" button linking to the menu page */}
            {menus.length > 8 && (
                <div className="text-center mt-10">
                    <div onClick={() => navigate('/menu')} className="inline-block bg-[#FFB703] text-white 
                    font-semibold px-8 py-3 rounded-full hover:bg-[#e0a500] transition-colors duration-200 hover:cursor-pointer">
                        View Full Menu
                    </div>
                </div>
            )}

        </div>
    
    </div>
  )
}

export default Menus