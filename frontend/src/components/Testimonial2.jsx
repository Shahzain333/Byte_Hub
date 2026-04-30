import React from 'react'
import { FaStar } from 'react-icons/fa'

const Testimonial2 = () => {
  
  const testimonials = [
    {
      name: "Donald Jackman",
      role: "Content Creator",
      text: "I've been using prebuiltui for nearly two years, primarily for web pages and it has been incredibly user-friendly, making my work much easier.",
      img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
    },
    {
      name: "Richard Nelson",
      role: "Instagram Influencer",
      text: "I've been using this website for nearly a year, primarily for web apps and it has been incredibly amazing, making my work much easier.",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
    },
    {
      name: "James Washington",
      role: "Marketing Manager",
      text: "I've been using this awesome website for nearly two years, primarily for my saas app and it has been incredibly user-friendly, making my work much easier.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ]

  return (
    <div className="flex flex-wrap items-stretch justify-center gap-14 md:gap-12 
    lg:gap-8 pt-14 px-4 md:px-0">
      
      {testimonials.map((t, i) => (
      
        <div key={i} className="flex flex-col text-sm w-full sm:w-80 md:w-72 lg:w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      
          <div className="flex flex-col items-center px-5 pt-4 pb-2 relative">
      
            <img className="h-24 w-24 absolute -top-12 rounded-full object-cover border-4 border-white shadow-sm" src={t.img} alt={t.name} />
      
            <div className="pt-14 text-center">
              <h1 className="text-lg font-medium text-gray-800">{t.name}</h1>
              <p className="text-gray-800/80 text-sm">{t.role}</p>
            </div>
      
          </div>
      
          <p className="text-gray-500 px-5 text-center flex-grow leading-relaxed">{t.text}</p>
      
          <div className="flex justify-center pt-5 mt-2">
    
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => <FaStar key={j} color="#FFB703" size={16} />)}
            </div>
    
          </div>
    
        </div>
    
      ))}
    
    </div>
  )
}

export default Testimonial2