import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { Upload , ChevronDown} from 'lucide-react'

const AddMenu = () => {

  const { axios, loading, setLoading, navigate, categories } = useContext(AppContext)

  const [formData, setFormData] = useState({ 
    name: "", 
    price: "",
    description: "",
    category: "",
    image: null
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")

  // Add ref for dropdown
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }

  }, [])

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    
    const selectedFile = e.target.files[0]
    
    if(selectedFile){
      setFile(selectedFile)
    }
  
    setFormData({ ...formData, image: selectedFile })
    
    if(selectedFile) {
      setPreview(URL.createObjectURL(selectedFile))
    }
  
  } 

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      
      setLoading(true)

      const { data } = await axios.post('/api/menu/add', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      
      if(data.success) {
        toast.success(data.message)
        navigate('/admin/menus')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!")
      console.log("Error in Frontend Add Category", error)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className='grid lg:grid-cols-2 grid-cols-1 gap-5'>
      
      <form onSubmit={handleSubmit} className='max-w-2xl w-full flex flex-col gap-5'>

        <div className=''>
        
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Menu Name *
          </label>

          <input 
            type='text' 
            name='name' 
            value={formData.name} 
            onChange={handleChange} 
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
            focus:ring-[#E09A05] focus:border-transparent'
            placeholder='Enter Menu Name'
          />
        
        </div>

        <div className=''>
        
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Price
          </label>

          <input 
            type='number' 
            name='price' 
            value={formData.price} 
            onChange={handleChange} 
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
            focus:ring-[#E09A05] focus:border-transparent'
            placeholder='Enter Menu Price'
          />
        
        </div>

        <div className=''>
        
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>

          <input 
            type='text' 
            name='description' 
            value={formData.description} 
            onChange={handleChange} 
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
            focus:ring-[#E09A05] focus:border-transparent'
            placeholder='Enter Menu Description'
          />
        
        </div>

        {/* Custom Select Category Option */}
        <div className='' ref={dropdownRef}>
        
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Select Category
          </label>

          <div className="relative">
            
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#E09A05] flex justify-between items-center"
            >
              <span>
                {selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : "Select Category"}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md 
              shadow-lg max-h-60 overflow-auto">
                
                {/* Clickable Select Category option */}
                <div
                  onClick={() => {
                    setSelectedCategory("")
                    setFormData({ ...formData, category: "" })
                    setIsOpen(false)
                  }}
                  className="px-3 py-2 text-gray-500 font-semibold border-b border-gray-200 
                  bg-gray-50 hover:bg-[#E09A05] hover:text-white cursor-pointer"
                >
                  Select Category
                </div>

                
                {categories.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedCategory(item._id)
                      setFormData({ ...formData, category: item._id })
                      setIsOpen(false)
                    }}
                    className="px-3 py-2 hover:bg-[#E09A05] hover:text-white cursor-pointer"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        
        </div>

        <div className=''>
        
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Image 
          </label>

          <input 
            type='file'
            id='fileUpload' 
            onChange={handleFileChange} 
            required
            className='hidden'
          />

          {/* Custom Upload Area */}
          <label htmlFor='fileUpload' className='flex flex-col items-center justify-center w-full
          h-32 border border-dashed border-gray-300 rounded-lg cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-[#E09A05] transition'>
            <Upload className='w-7 h-7 text-gray-500 mb-2'/>
            <span className='text-gray-600 text-sm'>
              { file ? file.name : "Click to upload an image" }
            </span>
          </label>
        
        </div>

        <button className='px-8 py-3 text-white cursor-pointer bg-[#E09A05] rounded-lg
        hover:bg-[#E09A05] transition-colors font-medium'>
          { loading ? "Adding..." : "Add Menu"}
        </button>
      
      </form>

      { preview && <img src={preview} alt='preview' className='md:w-full w-[300px] rounded-lg'/> }

    </div>
  )
}

export default AddMenu