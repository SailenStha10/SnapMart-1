import React from 'react'
import { Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import useCart from '../hooks/useCart'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-4 text-gray-600">Add some products to see them here.</p>
        <Link to="/products" className="rounded-lg bg-primary px-4 py-2 text-white">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cart</h1>
          <p className="text-sm text-gray-600">{cartItems.length} item(s) ready for checkout</p>
        </div>
        <button type="button" onClick={clearCart} className="text-sm text-red-500">
          Clear cart
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.shop}</p>
                <p className="mt-1 font-semibold text-primary">Rs: {item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded-full border p-2"
                >
                  <FiMinus />
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded-full border p-2"
                >
                  <FiPlus />
                </button>
              </div>
              <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs: {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>Rs: {subtotal}</span>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-lg bg-primary px-4 py-2 text-center text-white">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
