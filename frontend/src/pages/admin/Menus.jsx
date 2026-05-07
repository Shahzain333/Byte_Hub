import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingState from '../../components/LoadingState'

const Menus = () => {
  
  const { menus, fetchMenus, axios, loading } = useContext(AppContext)

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

  if (loading) {
    return (
      <LoadingState label={"Loading Menus...."} />
    )
  }

  return (
    <div className="px-1 sm:px-6 py-2 md:py-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        All Menus
      </h1>

      <div className="max-w-6xl mx-auto">

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      
          <table className="w-full text-md text-left">
      
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold w-20">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold w-32">Category</th>
                <th className="px-4 py-3 font-semibold w-24">Price</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-center w-28">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
            
              {menus.map((item, index) => (
                
                <tr key={item._id} className={`transition-colors hover:bg-gray-50 
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>

                  {/* Image */}
                  <td className="pl-2 py-3">
                    
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover border 
                    border-gray-100 shadow-sm"/>

                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    {item.name}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 text-[0.9rem]
                    font-medium px-2.5 py-1 rounded-full">
                      {item?.category?.name}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">
                    ${item.price}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 text-gray-500 max-w-xs">
                    <span className="block truncate" title={item.description}>
                      {item.description}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-center">
                    
                    <button onClick={() => deleteMenu(item._id)}
                      className="flex items-center justify-center gap-1.5 text-[1rem] font-medium text-red-500 
                      hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 
                      px-3 py-1.5 rounded-lg transition-all">
                      <Trash2 size={15} />
                      Delete
                    </button>
        
                  </td>
        
                </tr>
        
              ))}

            </tbody>

          </table>

        </div>

        {/* ── Mobile Card View ── */}
        <div className="md:hidden space-y-3">

          {menus.map((item) => (
          
            <div key={item._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

              {/* Card Header */}
              <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100 shadow-sm flex-shrink-0"/>

                <div className="flex-1 min-w-0">
                  
                  <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                  
                  <span className="inline-block mt-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs 
                  font-medium px-2 py-0.5 rounded-full">
                    {item?.category?.name}
                  </span>
                
                </div>

                <span className="font-bold text-green-600 text-base flex-shrink-0">
                  ${item.price}
                </span>
              
              </div>

              {/* Description */}
              {item.description && (
                <p className="px-3 py-2 text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Action */}
              <div className="px-3 pb-3 pt-1">

                <button onClick={() => deleteMenu(item._id)} className="w-full flex items-center justify-center 
                gap-1.5 text-[1rem] font-medium text-red-500 hover:bg-red-50 border border-red-200 py-1.5 rounded-lg transition-all">
                  <Trash2 size={14} />
                  Delete
                </button>
              
              </div>
          
            </div>
          
          ))}

        </div>

        {/* ── Empty State ── */}
        {menus.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">No menus found</p>
          </div>
        )}

        {/* ── Count footer ── */}
        {menus.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-right">
            {menus.length} menu item{menus.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </div>
  )
}

export default Menus