import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiSearch, FiChevronDown } from 'react-icons/fi'
import useCart from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { cartCount, wishlistCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/products" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-sm">
            S
          </div>
          <div className="hidden min-w-[180px] flex-col sm:flex">
            <span className="text-lg font-bold text-slate-900">SNAPMART</span>
            <span className="text-sm text-slate-500">Customer Satisfaction</span>
          </div>
        </Link>

     

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className={`hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex ${isActive('/products') ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Products
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className={`hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex ${isActive('/admin/dashboard') ? 'bg-red-600 text-white' : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'}`}
            >
              Admin
            </Link>
          )}

          <Link
            to="/wishlist"
            className={`relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${isActive('/wishlist') ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            <FiHeart className="mr-2" />
            Wishlist
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className={`relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${isActive('/cart') ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            <FiShoppingCart className="mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to={user ? '/orders' : '/login'}
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${isActive('/orders') ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Orders
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
              <span className="font-medium">{user.name || user.email}</span>
              <button onClick={logout} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
