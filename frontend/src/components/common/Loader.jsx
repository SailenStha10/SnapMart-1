import React from 'react'

export default function Loader(){
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin border-primary"></div>
    </div>
  )
}
