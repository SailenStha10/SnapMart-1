import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetails(){
  const { id } = useParams()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <p>Placeholder details for product <strong>{id || 'sample-id'}</strong></p>
    </div>
  )
}
