import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'

const AddCategory = () => {

  const { axios, navigate, loading, setLoading } = useContext(AppContext)

  const [formData, setFormData] = useState({
    name: "",
    image: null
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

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

      const { data } = await axios.post('/api/category/add', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      
      if(data.success) {
        toast.success(data.message)
        navigate('/admin/categories')
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
    <div className=''>
      
      <form onSubmit={handleSubmit} className='max-w-md w-full flex flex-col gap-5'>
        
        { preview && <img src={preview} alt='preview' className='w-[200px]'/> }

        <div className=''>
        
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Category Name *
          </label>

          <input 
            type='text' 
            name='name' 
            value={formData.name} 
            onChange={handleChange} 
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
            focus:ring-[#E09A05] focus:border-transparent'
            placeholder='Enter Category Name'
          />
        
        </div>

        <div className=''>
        
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Category Image 
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
          { loading ? "Adding..." : "Add Category"}
        </button>

      </form>
  
    </div>
  )
}

export default AddCategory