import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import heroSectionReservation from '../assets/heroSectionReservarion.jpg'
import Reservation from '../assets/Reservation.jpg'

const BookTable = () => {

  const { axios, navigate } = useContext(AppContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfPeople: "",
    date: "",
    time: "",
    note: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
      
        const { data } = await axios.post("/api/booking/create", formData);
        if (data.success) {
          toast.success(data.message);
          navigate("/my-bookings");
        } else {
          //navigate('/login')
          toast.error(data.message);
        }
      
      } catch (error) {
        navigate('/login')
        //console.log(error);
        //toast.error("Something went wrong!");
      }
    
    };
  
  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Hero Section */}
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${heroSectionReservation})`,}}>
  
        <div className="absolute inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center">

          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Book Your Table</h1>
            <p className="text-xl">Reserve your table and enjoy our exquisite menu.</p>
          </div>
      
        </div>
        
      </div>

      {/* Booking Table + Image */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-6">
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
          
          {/* Image  */}
          <div className="lg:w-1/2 rounded-lg overflow-hidden shadow-lg h-[320px] md:h-[590px]">
          
            <img src={Reservation} alt="Table reservation" className="h-full w-full object-cover"/>

          </div>

          {/* Reservation Form */}
          <div className="lg:w-7/12 bg-white shadow-lg rounded-2xl p-6 md:p-8">
            
            <form onSubmit={handleSubmit} className="space-y-4">
      
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="You Name"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#FFB703] 
                  focus:outline-none" required/>

                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#FFB703] 
                  focus:outline-none" required/>
              
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#FFB703] 
                  focus:outline-none" required/>

                <input type="number" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleChange}
                  placeholder="Number of Guests" min="1" className="border border-gray-300 rounded-lg p-3 w-full 
                  focus:ring-2 focus:ring-[#FFB703] focus:outline-none" required/>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
                <input type="date" name="date" value={formData.date} onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#FFB703] 
                  focus:outline-none" required/>
              
                <input type="time" name="time" value={formData.time} onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#FFB703]
                  focus:outline-none" required/>

              </div>

              {/* Row 4: Special Request */}
              <div className="relative z-0 w-full group ">
                
                <textarea name="note" id='note' placeholder=" " value={formData.note} onChange={handleChange}
                  className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 
                  border-gray-300 focus:outline-none focus:border-(--button-hover-bg-color) peer"
                ></textarea>
                
                <label htmlFor="note" className="absolute text-sm text-gray-500 duration-300 transform 
                -translate-y-6 scale-75 top-3 -z-10 origin-left peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Special Request
                </label>

              </div>
              
            {/* <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Special Requests (optional)"
              rows="3" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-[#FFB703] 
              focus:outline-none resize-none"></textarea> */}

              <button type="submit" className="w-full bg-[#FFB703] text-white py-3 rounded-lg hover:bg-[#E09A05]
              transition font-medium">
                Confirm Booking
              </button>

            </form>

          </div>

        </div>
      
      </div>

    </div>
    

  )
}

export default BookTable