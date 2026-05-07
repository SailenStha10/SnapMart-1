import React from 'react'
import ProductCard from '../components/product/ProductCard'

export default function Home(){
  const sample = { name: 'Sample Product', short: 'Starter product' }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Snapmart</h1>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProductCard product={sample} />
        <ProductCard product={sample} />
        <ProductCard product={sample} />
      </section>
    </div>
  )
}
