import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { MapPin, CheckCircle, Clock, XCircle, CreditCard, Banknote } from 'lucide-react'
import LoadingState from "../../components/LoadingState";

const statusStyles = (status) => {
  switch (status) {
    case "Pending":   return "border-yellow-300 bg-yellow-50 text-yellow-700 focus:ring-yellow-300";
    case "Preparing": return "border-blue-300 bg-blue-50 text-blue-700 focus:ring-blue-300";
    case "Delivered": return "border-green-300 bg-green-50 text-green-700 focus:ring-green-300";
    default:          return "border-gray-300 bg-gray-50 text-gray-700";
  }
};

const StatusDot = ({ status }) => {
  const colors = {
    Pending:   "bg-yellow-400",
    Preparing: "bg-blue-400",
    Delivered: "bg-green-400",
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${colors[status] || "bg-gray-400"}`} />
  );
};

// Payment Status Badge
const PaymentStatusBadge = ({ paymentStatus, paymentMethod }) => {
  
  const config = {
    Paid:    { icon: CheckCircle, cls: "bg-green-100 text-green-700 border-green-200",  label: "Paid" },
    Pending: { icon: Clock,       cls: "bg-yellow-100 text-yellow-700 border-yellow-200", label: paymentMethod === "Cash on Delivery" ? "Pay on Delivery" : "Pending" },
    Failed:  { icon: XCircle,     cls: "bg-red-100 text-red-700 border-red-200", label: "Failed" },
  };

  const { icon: Icon, cls, label } = config[paymentStatus] || config.Pending;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-1 ${cls}`}>
      <Icon size={11} />
      {label}
    </span>
  );
};


const Orders = () => {

  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/order/orders");
      if (data.success) setOrders(data.orders);
      else console.log(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      const { data } = await axios.put(`/api/order/update-status/${orderId}`, { status: newStatus });
      
      if (data.success) { 
        toast.success(data.message); 
        fetchOrders(); 
      } else toast.error(data.message);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) fetchOrders();
  }, []);

   if (loading) return <LoadingState label="Loading Orders..." />

  return (
    <div className="px-1 sm:px-6 py-2 md:py-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        All Orders
      </h1>

      <div className="max-w-6xl mx-auto space-y-4">
      
        {orders.map((item, index) => (

          <div key={item._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* Order Header */}
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">

              <span className="text-xs font-mono text-gray-400">
                #{String(index + 1).padStart(3, "0")}
              </span>

              <span className="font-bold text-gray-800 text-sm">
                {item?.user?.username}
              </span>

              <span className="text-gray-400 text-xs hidden sm:inline">•</span>

              <p className="text-xs text-gray-500 truncate max-w-xs flex items-center" title={item?.address}>
                <span className="text-[#FFB703]"><MapPin size={18} /></span>
                {item?.address}
              </p>

              <div className="ml-auto flex items-center gap-2 flex-wrap sm:justify-end">

                {/* Payment method icon + label */}
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 border 
                  border-gray-200 rounded-full px-1.5 sm:px-2.5 py-1 font-medium">

                  {item.paymentMethod === "Online Payment"
                    ? <CreditCard size={11} />
                    : <Banknote size={11} />}
                  
                  {item.paymentMethod}

                </span>

                {/* Payment Status Badge */}
                <PaymentStatusBadge
                  paymentStatus={item.paymentStatus}
                  paymentMethod={item.paymentMethod}
                />

                {/* Total */}
                <span className="text-sm font-bold text-green-600">
                  ${item?.totalAmount}
                </span>

                {/* Order status select */}
                <select
                  name="status"
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  disabled={loading}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors
                    ${statusStyles(item.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Delivered">Delivered</option>
                </select>

              </div>
              
            </div>

            {/* Order Items */}
            <div className="px-4 py-3">

              <div className="space-y-2">
              
                {item.items.map((menu, i) => (
              
                  <div key={i} className="flex items-center md:gap-3 gap-2 bg-gray-50 border 
                    border-gray-100 rounded-lg p-1 md:p-2">

                    <img src={menu?.menuItem?.image} alt={menu?.menuItem?.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />

                    <div className="flex-1">
                  
                      <p className="font-semibold text-sm text-gray-800 truncate max-w-[95px] md:max-w-full">
                        {menu?.menuItem?.name}
                      </p>
                  
                      <div className="flex items-center gap-2 md:gap-3 mt-0.5">
                  
                        <span className="text-xs text-gray-500">
                          Qty: <span className="font-medium text-gray-700">{menu?.quantity}</span>
                        </span>

                        <span className="text-xs text-gray-400">•</span>
                        
                        <span className="text-xs text-gray-500">
                          Price: <span className="font-medium text-gray-700">${menu?.menuItem?.price}</span>
                        </span>
                  
                      </div>
                  
                    </div>

                    <div className="text-right flex-shrink-0">
                
                      <p className="text-sm font-bold text-gray-800">
                        ${(menu?.quantity * menu?.menuItem?.price).toFixed(2)}
                      </p>
                      
                      <p className="text-xs text-gray-400">subtotal</p>
                
                    </div>
                
                  </div>
              
                ))}
              
              </div>

            </div>

            {/* ── Order Footer ── */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t 
              border-gray-100 text-xs text-gray-400">

              <span className="flex items-center">
                <StatusDot status={item.status} />
                {item.status}
              </span>

              <div className="flex items-center gap-3">
              
                <span>{item.items.length} item{item.items.length !== 1 ? "s" : ""}</span>

              </div>

            </div>

          </div>

        ))}

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        )}

        {orders.length > 0 && (
          <p className="text-xs text-gray-400 text-right">
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>

    </div>
  );
};

export default Orders;