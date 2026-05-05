import React from 'react'

const NewsLetter = () => {
    
  return ( 
    <>

    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * {
            font-family: 'Poppins', sans-serif;
        }
    `}
    </style>

    <div className="w-full px-2 text-center bg-gradient-to-b from-gray-50 to-white py-10 sm:py-20 flex flex-col items-center 
    justify-center">
        
        <p className="text-[#FFB703] font-medium">Get updated</p>
        
        <h1 className="max-w-lg font-semibold text-4xl/[44px] mt-2">
            Subscribe to our newsletter & get the latest news
        </h1>
        
        <div className="flex items-center justify-center mt-10 border border-[#FFB703] focus-within:outline 
        focus-within:outline-[#E09A05] sm:text-md text-sm rounded-full h-14 max-w-md w-full">
        
            <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full w-full flex-1" 
            placeholder="Enter your email address"/>
        
            <button className="bg-[#FFB703] hover:hover:bg-[#E09A05] text-white rounded-full font-semibold 
            h-11 mr-1 sm:px-8 px-4 flex items-center justify-center cursor-pointer">
                Subscribe now
            </button>
        
        </div>

    </div>
    
    </>
  )
}

export default NewsLetter