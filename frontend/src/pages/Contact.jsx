import React, { useState, useRef } from "react";
import { MapPin, Phone, Mail, Clock, Send, ChevronDown } from "lucide-react"; // ✅ Added ChevronDown
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

const subjectOptions = [
  { id: "reservation", label: "Reservation" },
  { id: "inquiry",     label: "Inquiry"     },
  { id: "feedback",    label: "Feedback"    },
];

const Contact = () => {

  const [formData, setFormData] = useState(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(""); 

  const { axios, loading, setLoading } = useContext(AppContext);

  const dropdownRef = useRef(null);

  const getMapEmbedUrl = () => {
    const lat = 24.826652652279787;
    const lng = 67.0234831933299;
    return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post("/api/contact/create", formData);

      if (data?.success) {
        toast.success(data.message || "Message sent successfully.");
        setFormData(initialFormData);
        setSelectedSubject(""); // ✅ Reset dropdown display on success
      } else {
        toast.error(data?.message || "Failed to send message.");
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const adminEmail = "adminbytehub@gmail.com";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${heroSectionContact})` }}>
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
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Contact Information</h2>

            <div className="space-y-6">

              <div className="flex items-start space-x-4">
                <div className="bg-[#FFB703] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Address</h3>
                  <p className="text-gray-600">
                    Boat Basin Food Street, SC-6 Bank Rd,
                    <br />
                    Block 5 Clifton, Karachi, 75600, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#FFB703] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Phone</h3>
                  <a href="tel:+923333422776" className="text-gray-600">(+92) 333-3422776</a><br />
                  <a href="tel:+923017570550" className="text-gray-600">(+92) 301-7570550</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#FFB703] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(adminEmail)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 uppercase hover:underline"
                  >
                    {adminEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#FFB703] p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Opening Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 11:00 AM - 10:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                </div>
              </div>

            </div>

            {/* Map */}
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

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Send a Message</h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 tracking-wide">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 tracking-wide">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2 tracking-wide">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                  placeholder="+92 123-4567890"
                />
              </div>

              {/* Subject Dropdown */}
              <div className="mb-4" ref={dropdownRef}>
                
                <label className="block text-gray-700 font-semibold mb-2 tracking-wide">
                  Subject *
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#E09A05] flex justify-between items-center"
                  >
                    {/* Look up label by id using subjectOptions array */}
                    <span className={selectedSubject ? "text-gray-800" : "text-gray-400"}>
                      {selectedSubject
                        ? subjectOptions.find((opt) => opt.id === selectedSubject)?.label
                        : "Select Subject"}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">

                      {/* Reset option */}
                      <div
                        onClick={() => {
                          setSelectedSubject("");
                          setFormData({ ...formData, subject: "" }); 
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 text-gray-500 font-semibold border-b border-gray-200 bg-gray-50 hover:bg-[#E09A05] hover:text-white cursor-pointer"
                      >
                        Select Subject
                      </div>

                      {/* Iterate over subjectOptions correctly */}
                      {subjectOptions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedSubject(item.id);
                            setFormData({ ...formData, subject: item.label }); 
                            setIsOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-[#E09A05] hover:text-white cursor-pointer"
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2 tracking-wide">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
                  placeholder="Tell us what's on your mind..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFB703] hover:bg-[#E09A05] tracking-wide text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;