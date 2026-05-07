import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import LoadingState from '../../components/LoadingState'

const Contacts = () => {

  const { admin, axios, loading, setLoading } = useContext(AppContext)
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/contact/all");
      if (data.success) {
        setContacts(data.contacts);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
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

   if (loading) return <LoadingState label="Loading Contacts..." />

  return (
    <div className="px-1 md:px-6 py-2 md:py-6">

      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        All Contacts
      </h1>

      <div className="max-w-4xl mx-auto">

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

                </tr>
              
              ))}
          
            </tbody>
          
          </table>

        </div>

        {/* Mobile Card View */}
        <ul className="md:hidden space-y-3">
          
          {contacts.map((item) => (
            
            <li key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">

              <div className="">
              
                <span className="font-semibold text-gray-800 text-base">{item?.name}</span>

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