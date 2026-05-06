import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { User } from 'lucide-react'

const StatusBadge = ({ status }) => {

  const styles = {
    Pending: "border-yellow-300 bg-yellow-50 text-yellow-700 focus:ring-yellow-300",
    Approved: "border-green-300 bg-green-50 text-green-700 focus:ring-green-300",
    Cancelled: "border-red-300 bg-red-50 text-red-700 focus:ring-red-300",
  };

  return styles[status] || styles.Pending;

};

const Bookings = () => {
  
  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/booking/bookings");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/booking/update-status/${bookingId}`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  useEffect(() => {
    if (admin) fetchBookings();
  }, []);

  return (
    <div className="px-3 sm:px-6 py-2 md:py-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        All Bookings
      </h1>

      <div className="max-w-6xl mx-auto">

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      
          <table className="w-full text-sm text-left">
      
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold text-center">Guests</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
      
            <tbody className=" bg-white">
              
              {bookings.map((item, index) => (
                <tr key={item._id} className={`transition-colors hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                      
                  {/* Row number */}
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    {item?.name}
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {item?.phone}
                  </td>

                  {/* Guests */}
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs 
                    font-semibold px-2.5 py-1 rounded-full border border-blue-200">
                      {item?.numberOfPeople}{" "}
                      {item?.numberOfPeople === 1 ? "Guest" : "Guests"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item?.date)}
                  </td>

                  {/* Time */}
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {item?.time}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3 text-center">
                    <select name="status" value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)} disabled={loading}
                      className={`text-xs font-semibold rounded-full px-3 py-1.5 border cursor-pointer 
                        focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors 
                        ${StatusBadge({ status: item.status })}`}>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
        
                  </td>
        
                </tr>

              ))}
        
            </tbody>
        
          </table>
        
        </div>

        {/* ── Mobile Card View ── */}
        <ul className="md:hidden space-y-3">
          
          {bookings.map((item, index) => (
            <li
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div>
                  <p className="font-semibold text-gray-800 text-base">{item?.name}</p>
                  <p className="text-sm text-gray-500">{item?.phone}</p>
                </div>
                <select
                  name="status"
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  disabled={loading}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border cursor-pointer focus:outline-none ${StatusBadge({ status: item.status })}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Card Details */}
              <div className="grid grid-cols-3 gap-2 text-center">
          
                <div className="bg-gray-50 rounded-lg py-2 px-1">
                  <p className="text-xs text-gray-400 mb-0.5">Guests</p>
                  <p className="flex item-center justify-center text-lg font-semibold text-gray-700">
                    {item?.numberOfPeople} <span><User size={22}/></span>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg py-2 px-1">
                  <p className="text-xs text-gray-400 mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatDate(item?.date)}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg py-2 px-1">
                  <p className="text-xs text-gray-400 mb-0.5">Time</p>
                  <p className="text-sm font-semibold text-gray-700">{item?.time}</p>
                </div>
          
              </div>
          
            </li>
          
          ))}

        </ul>

        {/* ── Empty State ── */}
        {bookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">No bookings found</p>
          </div>
        )}

        {/* ── Row Count ── */}
        {bookings.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-right">
            Showing {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>

    </div>
  );
};

export default Bookings;