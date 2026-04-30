import React, { useContext, useEffect, useState } from 'react'
import Menus from '../components/Menus'
import { AppContext } from '../context/AppContext'
import MenuCard from '../components/MenuCard'
import { Search, X } from 'lucide-react'

const Menu = () => {
  
  const { menus } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMenus, setFilteredMenus] = useState([])

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  useEffect(() => {

    if(searchQuery === "") {
      
      setFilteredMenus(menus)

    } else {
      
      const filtered = menus.filter((menu) => 
        menu.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()))
      
      setFilteredMenus(filtered)

    }

  }, [searchQuery, menus])

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-4'>

      <div className='container mx-auto px-4'>
        
        {/* Header */}
        <div className='text-center mb-4'>
          
          <h1 className="text-4xl font-bold mb-3">
            Our <span className="text-[#FFB703]">Menu</span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            {" "}
            Explore our delicious selection of handcrafted dishes made with the
            finest ingredients
          </p>

          {/* Search Box */}
          <div className='max-w-2xl mx-auto mt-2'>
            
            <div className='relative'>

              <Search className='text-[#FFB703] absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5'/>
              
              <input type='text' placeholder='Search for your favourite dish...' value={searchQuery} 
              onChange={(e)=> setSearchQuery(e.target.value)}
              className='w-full pl-12 pr-12 py-4 rounded-full border-2 border-gray-200 focus:border-[#FFB703] 
              focus:outline-none transition-colors duration-300 text-gray-300 placeholder-gray-400 shadow-md'/>

              {
                searchQuery && (
                  <button onClick={handleClearSearch} className='absolute right-4 top-1/2 transform -translate-y-1/2
                  transition-color text-[#FFB703] hover:text-[#E09A05]'>
                    <X className='w-5 h-5'/>
                  </button>
                )
              }

            </div>

          </div>

        </div>

        {/* Result Count */}
        <div className='mb-4'>
          <p className='text-gray-600 text-center'>
            {searchQuery ? (
              <>
                Found <span className='font-semibold text-[#FFB703]'>{filteredMenus.length}</span>
                {filteredMenus.length === 1 ? ` result` : " results"} for {searchQuery}
              </>
            ) : (
              <>
                Showing <span className='font-semibold text-[#FFB703]'>{filteredMenus.length}</span>
                {filteredMenus.length === 1 ? ` dish` : " dishes"}
              </>
            )}

          </p>
        
        </div>

        {/* Menus */}
        { 
          filteredMenus.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filteredMenus.map((menu) => (
                  <MenuCard key={menu._id} menu={menu} />
                ))}
            
            </div>
            </>
          ) : (
            <div className='text-center'>
              <p className='text-gray-600'>No Result Found For "{searchQuery}"</p>
              <button onClick={handleClearSearch} className='px-6 py-3 text-white rounded-full
              transition-color duration-300 font-semibold bg-[#FFB703] hover:bg-[#E09A05]'>
                Clear Search
              </button>
            </div>
          )
        }
      
      </div>
  
    </div>
  )
}

export default Menu