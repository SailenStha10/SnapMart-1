import React from 'react'
import { Link } from 'react-router-dom'

// Top navigation layout
export default function Navbar(){
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">Snapmart</Link>
        <div className="space-x-4">
          <Link to="/products" className="text-sm">Products</Link>
          <Link to="/cart" className="text-sm">Cart</Link>
          <Link to="/wishlist" className="text-sm">Wishlist</Link>
        </div>
      </div>
    </nav>
  )
}
