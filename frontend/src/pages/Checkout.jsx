import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Checkout = () => {

  const { axios, navigate, totalPrice, fetchCart } = useContext(AppContext)
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Pay at hotel")

  const handleCheckOut = async () => {
    
    if(!address) {
      toast.error("Please Enter Your Address")
    }

    try {
      const { data } = await axios.post('/api/order/place', {
        address,
        paymentMethod
      })

      if(data.success) {
        toast.success(data.message)
        fetchCart()
        navigate('/my-orders')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error("Something Went Wrong!")
      console.log("Error In Checkout In Frontend",error)
    }
  }

  return (
    <div className='max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white shadow-lg rounded-2xl mb-2'>

      {/* LEFT SIDE - Address */}
      <div>
      
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Delivery Address
        </h2>

        <textarea rows={5} value={address} placeholder="Enter your full address" onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#FFB703] 
          focus:outline-none resize-none"></textarea>
      
      </div>

      {/* RIGHT SIDE - Order Summary */}
      <div className="flex flex-col justify-between">

        <div>
        
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
        
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        
            <p className="flex justify-between text-lg font-medium text-gray-700">
              <span>Total Amount:</span>
              <span className="text-[#FFB703] font-semibold">$. {totalPrice} </span>
            </p>
        
          </div>

          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Payment Method
          </h3>

          <div className="space-y-3">
          
            <label htmlFor="" className="flex items-center space-x-3">
          
              <input type="radio" name="payment" value="Pay at hotel" checked={paymentMethod === "Pay at hotel"}
                onChange={(e) => setPaymentMethod(e.target.value)}/>
              
              <span>Pay at hotel</span>

            </label>

            <label className="flex items-center space-x-3">
             
              <input type="radio" name="payment" value="Online Payment" checked={paymentMethod === "Online Payment"}
                onChange={(e) => setPaymentMethod(e.target.value)} className="text-green-600 focus:ring-green-500"/>

              <span>Online Payment</span>

            </label>

          </div>

        </div>

        <button onClick={handleCheckOut} className="mt-6 bg-[#FFB703] text-white py-3 rounded-lg 
        hover:bg-[#E09A05] transition font-medium cursor-pointer">
          Confirm Order
        </button>
        
      </div>

    </div>
  )
}

export default Checkout