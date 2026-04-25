import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Orders = () => {

  const { axios, admin, loading, setLoading } = useContext(AppContext)
  const [orders, setOrders] = useState([])

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      setLoading(true)
      const { data } = await axios.put(`/api/order/update-status/${orderId}`, {
        status: newStatus
      })

      if(data.success) {
        //setOrders(data.orders)
        toast.success(data.message)
        fetchOrders()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!")
      console.log("Error in Frontend HandleChangeStatus Orders", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/orders")
      console.log("Data", data)

      if(data.success) {
        setOrders(data.orders)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!")
      console.log("Error in Frontend fetch Orders", error)
    }
  }

  useEffect(() => {
    if(admin) {
      fetchOrders()
    }
  }, [])

  return (
    <div className='py-24 px-3 sm:px-6'>
      
      <h1 className='text-3xl font-bold text-center my-3'>All Orders</h1>

      <div className='border border-gray-400 max-w-5xl mx-auto p-3 rounded-lg'>
        
        {/* Header */}
        <div className='hidden md:grid grid-cols-5 font-semibold text-gray-700 mb-4'>
          <div>Name</div>
          <div>Address</div>
          <div>Total Amount</div>
          <div>Payment Method</div>
          <div>Status</div>
        </div>

        {/* Item */}
        <ul className='space-y-4'>
          { 
            orders.map((item) => (
              <li key={item._id} className='border rounded-lg p-3 md:p-2'>
                
                <div className='flex flex-col md:grid md:grid-cols-5 md:items-center gap-2 md:gap-0'>
                  
                  <p className='font-medium text-center md:text-left'>{item?.user.username}</p>
                  <p className='font-medium text-center md:text-left'>{item?.address}</p>
                  <p className='text-gray-600 hidden md:block'>${item?.totalAmount}</p>
                  <p className='text-gray-600 hidden md:block'>{item?.paymentMethod}</p>   
                  <div className='flex justify-center md:justify-start items-center gap-2 md:gap-5 mt-2 md:mt-0'>
                    
                    <select name='status' value={item.status} 
                    onChange={(e) => handleChangeStatus(item._id,e.target.value)} 
                    disabled={loading}
                    className='border rounded-md px-3 py-2'>

                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  
                  </div>     

                </div>

                {/* Render Menu Item */}
                <div className='mt-3'>
                  {
                    item.items.map((menu,index) => (
                      <div key={index} className='flex items-centergap-3 bg-gray-50 rounded-lg border 
                      p-2 my-2'>
                        
                        <img src={menu?.menuItem?.image} alt={menu?.menuItem?.name} className='w-16 h-16 rounded object-cover'/>
                        
                        <div className=''>
                          <p className='font-semibold'>{menu?.menuItem?.name}</p>
                          <p className='text-sm text-gray-600'>QTY:{menu?.quantity}</p>
                          <p className='text-sm text-gray-600'>${menu?.menuItem?.price}</p>
                        </div>

                      </div>
                    ))
                  }
                </div>
          
              </li>
            
            ))
          
          }

        </ul>

      </div>

    </div>
  )
}

export default Orders