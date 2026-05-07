import React from 'react'

// Reusable button component
export default function Button({ children, onClick, className = '' }){
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] ${className}`}
    >
      {children}
    </button>
  )
}
