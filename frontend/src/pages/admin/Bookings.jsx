import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Bookings = () => {
  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);

  const fecthBookings = async () => {
    try {
      const { data } = await axios.get("/api/booking/bookings");
      //console.log("dataa", data);

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
      const { data } = await axios.put(`/api/booking/update-status/${bookingId}`,{
          status: newStatus,
        });

      if (data.success) {
        toast.success(data.message);
        fecthBookings(); 
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
      fecthBookings();
    }
  }, []);

  return (
    <div className="py-2 px-3 sm:px-6">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center my-3">All Bookings</h1>
      
      <div className="border border-gray-400 max-w-5xl mx-auto p-2 sm:p-3 rounded-lg">
      
        {/* Header - Hide on mobile, show on desktop */}
        <div className="hidden md:grid grid-cols-6 font-semibold text-gray-700 mb-4">
          <div>Name</div>
          <div>Phone</div>
          <div>Persons</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
        </div>
        
        {/* Items */}
        <ul className="space-y-4">
          {bookings.map((item) => (
            
            <li key={item._id} className="border rounded-lg p-3 md:p-2">

              {/* Mobile Card View */}
              
              <div className="md:hidden space-y-2">
              
                {/* Customer Name */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Name:</span>
                  <span className="font-medium">{item?.name}</span>
                </div>
                
                {/* Phone */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Phone:</span>
                  <span className="text-gray-700">{item?.phone}</span>
                </div>
                
                {/* Number of Persons */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Persons:</span>
                  <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                    {item?.numberOfPeople} {item?.numberOfPeople === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                
                {/* Date & Time combined row for mobile */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold text-gray-600">Date & Time:</span>
                  <div className="text-right">
                    <span className="block text-sm">
                      {new Date(item?.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {item?.time}
                    </span>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-gray-600">Status:</span>
                  <select
                    name="status"
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    disabled={loading}
                    className={`border rounded-md px-3 py-1.5 text-sm font-medium ${
                      item.status === 'Pending' ? 'border-yellow-400 bg-yellow-50' :
                      item.status === 'Approved' ? 'border-green-400 bg-green-50' :
                      'border-red-400 bg-red-50'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                
                </div>

              </div>

              {/* Desktop View */}
              <div className="hidden md:flex md:flex-col">
                
                <div className="flex flex-col md:grid md:grid-cols-6 md:items-center gap-2 md:gap-0">
                
                  <p className="font-medium text-center md:text-left">
                    {item?.name}
                  </p>
                  <p className="font-medium text-center md:text-left">
                    {item?.phone}
                  </p>
                  <p className="text-gray-600 hidden md:block text-center">
                    {item?.numberOfPeople}
                  </p>
                  <p className="text-gray-600 hidden md:block text-center">
                    {new Date(item?.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600 hidden md:block text-center">
                    {item?.time}
                  </p>
                  <div className="flex justify-center md:justify-start items-center gap-2 md:gap-5 mt-2 md:mt-0">
                    <select
                      name="status"
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      disabled={loading}
                      className={`border rounded-md px-3 py-2 ${
                        item.status === 'Pending' ? 'border-yellow-400' :
                        item.status === 'Approved' ? 'border-green-400' :
                        'border-red-400'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

              </div>
        
            </li>
        
          ))}
        
        </ul>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
  
      </div>

    </div>
  
  );
};

export default Bookings;