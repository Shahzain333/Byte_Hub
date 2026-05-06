import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Contacts = () => {

  const { admin, axios, loading, setLoading } = useContext(AppContext)
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get("/api/contact/all");
      if (data.success) {
        setContacts(data.contacts);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    toast.success("Contact Status Changed", contactId, newStatus)
    // try {
    //   setLoading(true);
    //   const { data } = await axios.put(`/api/contact/update-status/${contactId}`, {
    //     status: newStatus,
    //   });
    //   if (data.success) {
    //     toast.success(data.message);
    //     fetchContacts();
    //   } else {
    //     toast.error(data.message);
    //   }
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (admin) {
      fetchContacts();
    }
  }, []);

  return (
    <div className="px-3 sm:px-6 py-6">

      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        All Contacts
      </h1>

      <div className="max-w-7xl mx-auto">

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          
          <table className="w-full text-sm text-left">
            
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold w-28">Name</th>
                <th className="px-4 py-3 font-semibold w-48">Email</th>
                <th className="px-4 py-3 font-semibold w-32">Phone</th>
                <th className="px-4 py-3 font-semibold w-32">Subject</th>
                <th className="px-4 py-3 font-semibold">Message</th>
                <th className="px-4 py-3 font-semibold w-28 text-center">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 bg-white">
              
              {contacts.map((item, index) => (
                
                <tr key={item._id} className={`transition-colors hover:bg-gray-50 
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {item?.name}
                  </td>

                  {/* Email — truncated with tooltip */}
                  <td className="px-4 py-3 w-48 max-w-[16rem]">
                    <span className="block text-blue-600 truncate" title={item?.email}>
                      {item?.email}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {item?.phone}
                  </td>

                  {/* Subject — truncated */}
                  <td className="px-4 py-3 max-w-[8rem]">
                    <span className="block text-gray-700 truncate">
                      {item?.subject}
                    </span>
                  </td>

                  {/* Message — truncated */}
                  <td className="px-4 py-3">
                    <span className="block text-gray-500 truncate max-w-xs">
                      {item?.message}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <select
                      name="status"
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      disabled={loading}
                      className={`text-xs font-semibold rounded-full px-3 py-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                        item.status === 'Read'
                          ? 'border-green-300 bg-green-50 text-green-700 focus:ring-green-300'
                          : 'border-red-300 bg-red-50 text-red-700 focus:ring-red-300'
                      }`}
                    >
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                    </select>
                  </td>

                </tr>
              
              ))}
          
            </tbody>
          
          </table>

        </div>

        {/* Mobile Card View */}
        <ul className="md:hidden space-y-3">
          
          {contacts.map((item) => (
            
            <li key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">

              <div className="flex items-center justify-between">
              
                <span className="font-semibold text-gray-800 text-base">{item?.name}</span>
              
                <select
                  name="status"
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  disabled={loading}
                  className={`text-xs font-semibold rounded-full px-3 py-1 border cursor-pointer focus:outline-none ${
                    item.status === 'Read'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-red-300 bg-red-50 text-red-700'
                  }`}
                >
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                </select>

              </div>

              <div className="text-sm text-blue-600 truncate" title={item?.email}>
                {item?.email}
              </div>

              <div className="text-sm text-gray-600">
                {item?.phone}
              </div>

              {item?.subject && (
                <div className="text-sm text-gray-700 font-medium truncate">
                  {item?.subject}
                </div>
              )}

              {item?.message && (
                <p className="text-sm text-gray-500 line-clamp-2 border-t border-gray-100 pt-2">
                  {item?.message}
                </p>
              )}
          
            </li>

          ))}

        </ul>

        {/* Empty State */}
        {contacts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">No contacts found</p>
          </div>
        )}

        {/* Row count */}
        {contacts.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-right">
            Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>

    </div>
  )
}

export default Contacts