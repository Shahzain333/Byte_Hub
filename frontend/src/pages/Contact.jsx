import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import heroSectionContact from '../assets/heroSectionContact.jpg'

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const Contact = () => {

  const [formData, setFormData] = useState(initialFormData);

  const [submitted, setSubmitted] = useState(false);
  const { axios } = useContext(AppContext)
  
  const getMapEmbedUrl = () => {
    const lat = 24.819315733225455;  // ← your latitude
    const lng =  67.01494154740129;  // ← your longitude
    return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitted(true);
      
      const { data } = await axios.post("/api/contact/create", formData);

      if (data?.success) {
        toast.success(data.message || "Message sent successfully.");
        setFormData(initialFormData);
      } else {
        toast.error(data?.message || "Failed to send message.");
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitted(false);
    }
  
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative h-70 bg-cover bg-center" style={{ backgroundImage: `url(${heroSectionContact})`,}}>

        <div className="absolute inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center">

          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl">We'd love to hear from you</p>
          </div>
      
        </div>
      
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        
          {/* Contact Information */}
          <div>
        
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Contact Information
            </h2>

            <div className="space-y-6">
              
              <div className="flex items-start space-x-4">
                
                <div className="bg-[#FFB703]  p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              
                <div>

                  <h3 className="font-semibold text-lg text-gray-800">
                    Address
                  </h3>
                  
                  <p className="text-gray-600">
                    123 Restaurant Street
                    <br />
                    Food District, City 12345
                  </p>
              
                </div>
              
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-[#FFB703]  p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
              
              </div>

              <div className="flex items-start space-x-4">
                
                <div className="bg-[#FFB703]  p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                  <p className="text-gray-600">info@restaurant.com</p>
                  <p className="text-gray-600">reservations@restaurant.com</p>
                </div>
              
              </div>

              <div className="flex items-start space-x-4">
                
                <div className="bg-[#FFB703]  p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Opening Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 11:00 AM - 10:00 PM
                  </p>
                  <p className="text-gray-600">
                    Saturday - Sunday: 10:00 AM - 11:00 PM
                  </p>
                </div>
              
              </div>
            
            </div>

            {/* Map Image */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 mt-4">
                <iframe
                  title="Restaurant Location"
                  src={getMapEmbedUrl()}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">

            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
              
                <label className="block text-gray-700 font-semibold mb-2">
                  Name *
                </label>
              
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#FFB703] "
                  placeholder="Your Name"
                />
              
              </div>

              <div className="mb-4">

                <label className="block text-gray-700 font-semibold mb-2">
                  Email *
                </label>
                
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#FFB703]"
                  placeholder="your@email.com"
                />
              
              </div>

              <div className="mb-4">

                <label className="block text-gray-700 font-semibold mb-2">
                  Phone
                </label>
                
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#FFB703] "
                  placeholder="+1 (555) 123-4567"
                />
              
              </div>

              <div className="mb-4">
                
                <label className="block text-gray-700 font-semibold mb-2">
                  Subject *
                </label>
                
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#FFB703] "
                  placeholder="Reservation, Inquiry, Feedback..."
                />

              </div>

              <div className="mb-6">

                <label className="block text-gray-700 font-semibold mb-2">
                  Message *
                </label>
                
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#FFB703] "
                  placeholder="Tell us what's on your mind..."
                ></textarea>
              
              </div>

              <button type="submit" disabled={submitted} className="w-full bg-[#FFB703]  hover:bg-[#E09A05] text-white 
              font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>

            </form>
      
          </div>
      
        </div>
      
      </div>

    </div>

  );
};

export default Contact;
