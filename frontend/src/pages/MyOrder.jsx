import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import LoadingState from '../components/LoadingState'
import { CheckCircle, Clock, XCircle, CreditCard, Banknote } from 'lucide-react'

// Payment Status Badge
const PaymentStatusBadge = ({ paymentStatus, paymentMethod }) => {
  
  const config = {
    Paid:    { icon: CheckCircle, cls: "bg-green-100 text-green-700 border-green-200",    label: "Paid" },
    Pending: { icon: Clock,       cls: "bg-yellow-100 text-yellow-700 border-yellow-200", label: paymentMethod === "Cash on Delivery" ? "Pay on Delivery" : "Pending" },
    Failed:  { icon: XCircle,     cls: "bg-red-100 text-red-700 border-red-200",          label: "Payment Failed" },
  }
  
  const { icon: Icon, cls, label } = config[paymentStatus] || config.Pending
  
  return (
    
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-2.5 py-1 ${cls}`}>
      <Icon size={11} />
      {label}
    </span>

  )
}

// Order Status Badge
const OrderStatusBadge = ({ status }) => {
 
  const config = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Preparing: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
  }
 
  return (
    <span className={`px-3 py-1 text-sm rounded-full font-medium ${config[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )

}

const MyOrder = () => {

  const { axios,loading, setLoading } = useContext(AppContext)
  const [orders, setOrders]       = useState([])

  const fetchMyOrders = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/order/my-orders')
      if (data.success) setOrders(data.orders)
    } catch (error) {
      toast.error("Something went wrong!")
      console.log("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [])

  if (loading) return <LoadingState label="Loading My Orders..." />

  return (
    <div className="max-w-5xl mx-auto mt-1 p-6">

      <h2 className="text-2xl font-semibold mb-6 text-center">My Orders</h2>

      {orders.length === 0 ? (

        <p className="text-center text-gray-600 h-40">You have no orders yet</p>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div key={order._id} className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 
              hover:shadow-lg transition mb-2">

              {/* Order ID + Order Status */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID: <span className="text-green-600">#{order._id.slice(-6)}</span>
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">

                <p>
                  <span className="font-medium">Address: </span>
                  {order.address}
                </p>

                <p className="flex items-center gap-1.5">
                  <span className="font-medium">Payment:</span>
                  {order.paymentMethod === "Online Payment"
                    ? <CreditCard size={13} className="text-gray-400" />
                    : <Banknote   size={13} className="text-gray-400" />}
                  {order.paymentMethod}
                </p>

                <p>
                  <span className="font-medium">Total:</span> $ {order.totalAmount}
                </p>

                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>

              {/* Items count + Payment Status Badge */}
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">

                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Items:</span> {order.items.length} product(s)
                </p>

                <PaymentStatusBadge
                  paymentStatus={order.paymentStatus}
                  paymentMethod={order.paymentMethod}
                />

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default MyOrder