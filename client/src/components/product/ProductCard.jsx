import React from 'react'

export default function ProductCard({ product }){
  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="h-40 bg-gray-100 mb-3 flex items-center justify-center">Image</div>
      <h3 className="font-medium">{product?.name || 'Product name'}</h3>
      <p className="text-sm text-gray-600">{product?.short || 'Short description'}</p>
    </div>
  )
}
