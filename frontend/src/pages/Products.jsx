   import React from 'react'
import ProductCard from '../components/product/ProductCard'

export default function Products(){
  const list = Array.from({length:6}).map((_,i)=>({name:`Product ${i+1}`, short: 'Short description'}))
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {list.map((p,idx)=> <ProductCard key={idx} product={p} />)}
      </div>
    </div>
  )
}
