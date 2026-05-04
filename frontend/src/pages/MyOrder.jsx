import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const MyOrder = () => {
  
  const { axios } = useContext(AppContext)
  const [orders, setOrders] = useState([])

  const fetchMyOrders = async () => {
    try {
      
      const { data } = await axios.get('/api/order/my-orders')
      //console.log("Order Data", data)
      
      if(data.success) {
        setOrders(data.orders)
      } 

    } catch (error) {
      toast.error("Something Went Wrong!")
      console.log("Error In Checkout In Frontend",error)
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-1 p-6">
      
      <h2 className='text-2xl font-semibold mb-6 text-center'>My Orders</h2>

      {orders.length === 0 ? (
        
        <p className="text-center text-gray-600 h-40">You have no orders yet</p>

      ) : (

        <div className='space-y-6'>

          {orders.map((order) => (
            
            <div key={order._id} className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 
            hover:shadow-lg transition mb-2">

              {/* Order ID & Status */}
              <div className="flex justify-between items-center mb-3">
              
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID:
                  <span className="text-green-600">{order._id.slice(-6)}</span>
                </h3>
              
                <span className={`px-3 py-1 text-sm rounded-full ${ order.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                  : order.status === "Preparing" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  {order.status}
                </span>

              </div>

              {/* Order Deatils */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          
                <p>
                  {" "}
                  <span className="font-medium">Address: </span>
                  {order.address}{" "}
                </p>
          
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>
          
                <p>
                  <span className="font-medium">Total:</span> $.{" "}
                  {order.totalAmount}
                </p>
          
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
          
              </div>

              <div className="mt-4">
          
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Items:</span>{" "}
                  {order.items.length} product(s)
                </p>
          
              </div>
          
            </div>
          
          ))}

        </div>
      )}

    </div>
  )
}

export default MyOrder