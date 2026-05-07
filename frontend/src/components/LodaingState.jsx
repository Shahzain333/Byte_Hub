import React from 'react'

const LodaingState = ({ label }) => {
  return (
    <div className="flex items-center justify-center h-64">

        <div className="flex flex-col items-center gap-3">
      
          <div className="w-10 h-10 border-3 border-[#FFB703] border-t-[#E09A05] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">{label}</p>
      
        </div>
      
    </div>
  )
}

export default LodaingState