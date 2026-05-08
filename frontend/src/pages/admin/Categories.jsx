import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingState from '../../components/LoadingState'

const Categories = () => {

  const { categories, fetchCategories, axios, dataLoading } = useContext(AppContext)

  const deleteCategory = async (id) => {
    try {
      
      const { data } = await axios.delete(`/api/category/delete/${id}`)
      
      if(data.success) {
        toast.success(data.message || "Category Deleted")
        fetchCategories()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message)
      console.log("Error in Frontend Categories, Delete Category", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (dataLoading) return <LoadingState label="Loading Categories..." />

  return (
    <div className="px-1 sm:px-6 py-2 md:py-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        All Categories
      </h1>

      <div className="max-w-4xl mx-auto">

        {/* ── Desktop Table ── */}
        <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">

          <table className="w-full text-md text-left">
          
            <thead className="bg-gray-50 text-gray-500 uppercase text-md tracking-wider">
          
              <tr>
                <th className="px-5 py-3 font-semibold w-20">Image</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold text-center w-28">Action</th>
              </tr>
          
            </thead>
          
            <tbody className=" bg-white">
              
              {categories.map((item, index) => (
              
                <tr key={item._id} className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 
                'bg-white' : 'bg-gray-50/40'}`}>

                  {/* Image */}
                  <td className="pl-2 py-3">
                  
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-full object-cover border 
                    border-gray-100 shadow-sm"/>

                  </td>

                  {/* Name */}
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3 text-center">
                    
                    <button onClick={() => deleteCategory(item._id)} className="inline-flex items-center gap-1.5 
                    text-[1rem] font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent
                  hover:border-red-200 px-3 py-1.5 rounded-lg transition-all">
                      <Trash2 size={18} />
                      Delete
                    </button>
                    
                  </td>

                </tr>
              
              ))}
          
            </tbody>
          
          </table>
        
        </div>

        {/* ── Mobile Card Grid ── */}
        <div className="sm:hidden grid grid-cols-2 gap-3">
          
          {categories.map((item) => (
            
            <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex 
            flex-col items-center gap-2 text-center">
              
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border 
              border-gray-100 shadow-sm"/>
              
              <p className="font-semibold text-gray-800 text-md truncate w-full">
                {item.name}
              </p>
              
              <button onClick={() => deleteCategory(item._id)}
                className="w-full flex items-center justify-center gap-1 text-[0.8rem] font-medium text-red-500 
                hover:bg-red-50 border border-red-200 py-1.5 rounded-lg transition-all">
                <Trash2 size={14} />
                Delete
              </button>
              
            </div>
          ))}
        </div>

        {/* ── Empty State ── */}
        {categories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">No categories found</p>
          </div>
        )}

        {/* ── Count footer ── */}
        {categories.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-right">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        )}

      </div>

    </div>
  )
}

export default Categories