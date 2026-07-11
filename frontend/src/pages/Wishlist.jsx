import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import useCart from '../hooks/useCart'

export default function Wishlist() {
  const { wishlistItems, toggleWishlist, addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

  useEffect(() => {
    const sort = searchParams.get('sort') || 'newest'
    setSortBy(sort)
  }, [searchParams])

  const handleSort = (sortOption) => {
    setSortBy(sortOption)
    setSearchParams({ sort: sortOption })
  }

  const getSortedItems = () => {
    const items = [...wishlistItems]
    switch (sortBy) {
      case 'price-low':
        return items.sort((a, b) => a.price - b.price)
      case 'price-high':
        return items.sort((a, b) => b.price - a.price)
      case 'rating':
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'newest':
      default:
        return items
    }
  }

  const sortedItems = getSortedItems()

  if (wishlistItems.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Your Wishlist is Empty</h1>
        <p className="mb-4 text-gray-600">Looks like you haven't added anything to your wishlist yet.</p>
        <Link to="/products" className="inline-block rounded-lg bg-primary px-6 py-2 text-white hover:opacity-90">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold">My Wishlist</h1>
          <p className="text-sm text-gray-600">{wishlistItems.length} items</p>
        </div>
        {wishlistItems.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('newest')}
              className={`rounded-lg px-4 py-2 text-sm ${
                sortBy === 'newest' ? 'bg-primary text-white' : 'border bg-white hover:bg-gray-50'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => handleSort('price-low')}
              className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm ${
                sortBy === 'price-low' ? 'bg-primary text-white' : 'border bg-white hover:bg-gray-50'
              }`}
            >
              <FiArrowUp /> Price
            </button>
            <button
              onClick={() => handleSort('price-high')}
              className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm ${
                sortBy === 'price-high' ? 'bg-primary text-white' : 'border bg-white hover:bg-gray-50'
              }`}
            >
              <FiArrowDown /> Price
            </button>
            <button
              onClick={() => handleSort('rating')}
              className={`rounded-lg px-4 py-2 text-sm ${
                sortBy === 'rating' ? 'bg-primary text-white' : 'border bg-white hover:bg-gray-50'
              }`}
            >
              Rating
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedItems.map((item) => (
          <div key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
            <img src={item.image} alt={item.name} className="mb-3 h-40 w-full rounded-lg object-cover" />
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.shop}</p>
              </div>
              <button onClick={() => toggleWishlist(item)} className="text-red-500">
                <FiHeart />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-primary">Rs: {item.price}</span>
              <button
                onClick={() => addToCart(item)}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-white"
              >
                <FiShoppingCart />
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
