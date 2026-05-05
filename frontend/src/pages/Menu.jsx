import React, { useContext, useEffect, useState } from 'react'
import Menus from '../components/Menus'
import { AppContext } from '../context/AppContext'
import MenuCard from '../components/MenuCard'
import { Search, X } from 'lucide-react'
import heroSectionMenu from '../assets/heroSectionMenu.jpg'

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
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf0] via-white to-gray-50">
      
      {/* Hero Section And Search Box */}
      <div className="relative isolate overflow-hidden bg-center bg-cover" style={{ backgroundImage:  `url(${heroSectionMenu})` }}>

        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative container mx-auto px-4 py-12 sm:py-14">
          
          <div className="mx-auto max-w-4xl text-center text-white">
          
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#FFB703]">
              Freshly Crafted Daily
            </p>
          
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Explore Our Menu
            </h1>
          
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-100 sm:text-base">
              Discover your favorite dishes made with premium ingredients and
              served with care.
            </p>

            <div className="mx-auto mt-8 w-full max-w-2xl">
              
              <div className="relative rounded-full border border-[#FFB703] focus:outline-[#E09A05]  p-1 shadow-xl 
              backdrop-blur bg-transparent">
              
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FFB703]" />
              
                <input
                  type="text"
                  placeholder="Search for your favorite dish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-transparent py-3 pl-12 pr-12 text-sm text-white/90 placeholder:text-white/60 
                  focus:outline-none sm:text-base"
                />
              
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#FFB703] transition-colors 
                    hover:text-[#E09A05]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
            
              </div>
            
            </div>

            <p className="mt-5 text-sm text-gray-100 sm:text-base">
              {searchQuery ? (
                <>
                  Found{" "}
                  <span className="font-semibold text-[#FFB703]">
                    {filteredMenus.length}
                  </span>{" "}
                  {filteredMenus.length === 1 ? "result" : "results"} for{" "}
                  <span className="font-medium text-white">"{searchQuery}"</span>
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-[#FFB703]">
                    {filteredMenus.length}
                  </span>{" "}
                  {filteredMenus.length === 1 ? "dish" : "dishes"}
                </>
              )}
            </p>

          </div>
      
        </div>
      
      </div>

      {/*Menu Cards  */}
      <div className="container mx-auto px-4 py-10 sm:py-12">
        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMenus.map((menu) => (
              <MenuCard menu={menu} key={menu._id} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-800">
              No dishes found for "{searchQuery}"
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try another keyword or clear the search to view all menu items.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-5 rounded-full bg-[#f59e0b] px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#d97706]"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

    </div>
  
  )
}

export default Menu