import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Orders = () => {
  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  console.log("orders", orders);

  const fecthOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/orders");
      console.log("dataa", data);

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/order/update-status/${orderId}`, {
        status: newStatus,
      });

      if (data.success) {
        toast.success(data.message);
        fecthOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fecthOrders();
    }
  }, []);
  
  return (
    <div className="py-20 px-3 sm:px-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center my-3">All Orders</h1>
      
      <div className="border border-gray-400 max-w-5xl mx-auto p-2 sm:p-3 rounded-lg">
        
        {/* Header - Hide on mobile, show on desktop */}
        <div className="hidden md:grid grid-cols-5 font-semibold text-gray-700 mb-4">
          <div>Name</div>
          <div>Address</div>
          <div>Total Amount</div>
          <div>payment method</div>
          <div>Status</div>
        </div>
        
        {/* Items */}
        <ul className="space-y-4">

          {orders.map((item) => (
            <li key={item._id} className="border rounded-lg p-3 md:p-2">
              
              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="grid grid-cols-5 items-center gap-2">
                  <p className="font-medium text-center md:text-left">
                    {item?.user.name}
                  </p>
                  <p className="font-medium text-center md:text-left">
                    {item?.address}
                  </p>
                  <p className="text-gray-600">
                    ${item?.totalAmount}
                  </p>
                  <p className="text-gray-600">
                    {item.paymentMethod}
                  </p>
                  <div className="flex justify-center md:justify-start items-center gap-2 md:gap-5 mt-2 md:mt-0">
                    <select
                      name="status"
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      disabled={loading}
                      className="border rounded-md px-3 py-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mobile View - Only visible on small devices */}
              <div className="md:hidden space-y-3">
                
                {/* Customer Name */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Customer:</span>
                  <span className="font-medium">{item?.user?.name}</span>
                </div>
                
                {/* Total Amount */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${item?.totalAmount}
                  </span>
                </div>
                
                {/* Payment Method */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Payment:</span>
                  <span className="capitalize px-2 py-1 rounded-full text-sm bg-gray-100">
                    {item.paymentMethod}
                  </span>
                </div>
                
                {/* Status */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Status:</span>
                  <select
                    name="status"
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    disabled={loading}
                    className={`border rounded-md px-3 py-1.5 text-sm font-medium ${
                      item.status === 'Pending' ? 'border-yellow-400 bg-yellow-50' :
                      item.status === 'Preparing' ? 'border-blue-400 bg-blue-50' :
                      'border-green-400 bg-green-50'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                
                {/* Delivery Address */}
                <div className="border-b pb-2">
                  <span className="font-semibold text-gray-600 block mb-1">Delivery Address:</span>
                  <p className="text-sm text-gray-700 break-words">{item?.address}</p>
                </div>
              </div>

              {/* Menu Items - Responsive for all devices */}
              <div className="mt-3">
                
                {/* Mobile menu items heading */}
                <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-base block md:hidden">
                  Order Items:
                </h3>
                
                {item.items.map((menu, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 border rounded-lg p-2 my-2"
                  >
                    <img
                      src={menu?.menuItem?.image}
                      alt={menu?.menuItem?.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">
                        {menu?.menuItem?.name}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <p className="text-xs sm:text-sm text-gray-600">
                          QTY: {menu?.quantity}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          ${menu?.menuItem?.price}
                        </p>
                      </div>
                      {/* Subtotal for mobile */}
                      <p className="text-xs text-gray-500 mt-1 block sm:hidden">
                        Subtotal: ${(menu?.quantity * menu?.menuItem?.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}

        </ul>

        {/* Empty State for mobile */}
        {orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
  
      </div>

    </div>
  
  );
};

export default Orders;