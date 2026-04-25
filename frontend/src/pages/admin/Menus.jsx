import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { CircleX } from 'lucide-react'
import toast from 'react-hot-toast'

const Menus = () => {

  const { menus, fetchMenus, axios } = useContext(AppContext)

  const deleteMenu = async (id) => {
    try {
      
      const { data } = await axios.delete(`/api/menu/delete/${id}`)
      
      if(data.success) {
        toast.success(data.message || "Menu Deleted")
        fetchMenus()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message)
      console.log("Error in Frontend Menus, Delete Menu", error)
    }
  }

  return (
    <div className='py-0 lg:py-4 px-4 sm:px-6'>
      
      <h1 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'>All Menus</h1>
      
      {/* Desktop Table View - hidden on mobile */}
      <div className='hidden md:block border border-gray-400 shadow-sm max-w-5xl mx-auto p-3 overflow-x-auto'>
        
        {/* Header */}
        <div className='grid grid-cols-6 font-semibold text-gray-700 min-w-[600px]'>
          <div>Image</div>
          <div>Name</div>
          <div>Category</div>
          <div>Price</div>
          <div>Description</div>
          <div>Action</div>
        </div>

        <hr className='w-full my-2 text-gray-200'/>

        <ul>      
          {
            menus.map((item) => (
              
              <div key={item._id}>
              
                <div className='grid grid-cols-6 item-center mb-2 min-w-[600px]'>
              
                  <div className='flex items-center gap-2'>
                    <img src={item.image} alt={item.name} className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover'/>
                  </div>
                  
                  <p className='flex items-center break-words'>{item.name}</p>
                  <p className='flex items-center break-words'>{item?.category?.name}</p>
                  <p className='flex items-center text-green-600 font-bold'>${item.price}</p>
                  <p className='flex items-center break-words'>{item.description}</p>
                  <p className='flex items-center text-red-600 cursor-pointer hover:underline' 
                  onClick={() => deleteMenu(item._id)}>
                    <CircleX />
                  </p>
                  
                </div>

                <hr className='w-full my-2 text-gray-200'/>
              
              </div>
            ))
          }
        </ul>

      </div>

      {/* Mobile Card View - visible only on mobile/tablet */}
      <div className='md:hidden space-y-4'>

        {
        menus.map((item) => (
         
         <div key={item._id} className='border border-gray-400 rounded-lg p-2 bg-white shadow-sm'>
         
            <div className='flex items-start gap-2'>
         
              <img src={item.image} alt={item.name} className='w-24 h-24 rounded-full object-cover 
              flex-shrink-0'/>
         
              <div className='flex-1'>
         
                <div className='flex justify-between items-start'>
         
                  <h3 className='font-bold text-lg break-words flex-1'>{item.name}</h3>
         
                  <button 
                    onClick={() => deleteMenu(item._id)}
                    className='text-red-600 hover:text-red-800 ml-2 flex-shrink-0'
                  >
                    <CircleX size={24} />
                  </button>
         
                </div>
                
                <div className='mt-2 space-y-1'>
         
                  <p className='text-sm text-gray-600'>
                    <span className='font-semibold'>Category:</span> {item?.category?.name}
                  </p>
         
                  <p className='text-sm text-gray-600'>
                    <span className='font-semibold'>Price:</span> <span className='text-green-600 font-bold'>${item.price}</span>
                  </p>
         
                  <p className='text-sm text-gray-600'>
                    <span className='font-semibold'>Description:</span> {item.description}
                  </p>
         
                </div>
         
              </div>
         
            </div>
         
          </div>
        
        ))}
      
      </div>

      {/* Empty state */}
      {menus.length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          No menus available
        </div>
      )}

    </div>
  )
}

export default Menus