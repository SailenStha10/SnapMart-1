import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Cart(){
  const [cart, setCart] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadCart = async () => {
      try {
        const { data } = await api.get('/cart')
        setCart(data.cart)
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load cart.')
      }
    }

    loadCart()
  }, [])

  return (
    <section className="space-y-6">
      <div>
        <span className="section-kicker">Shopping cart</span>
        <h1 className="mt-3 text-4xl font-bold text-primary-strong">Your selected items</h1>
      </div>

      {message ? <p className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

      <div className="card-soft space-y-4 p-6">
        {cart?.items?.length ? (
          cart.items.map((item) => (
            <div key={String(item.productId)} className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-primary-strong">{item.product?.name || 'Product'}</p>
                <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-primary-strong">${Number(item.product?.price || 0).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-600">Your cart is empty.</p>
        )}
      </div>
    </section>
  )
}
