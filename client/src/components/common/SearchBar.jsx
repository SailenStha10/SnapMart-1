import React from 'react'

export default function SearchBar({ value, onChange, placeholder = 'Search' }){
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-3 py-2 border rounded-md w-full"
    />
  )
}
