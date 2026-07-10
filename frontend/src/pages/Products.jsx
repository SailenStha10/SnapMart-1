  import React, { useEffect, useState } from 'react'
  import { FiShoppingCart, FiStar } from 'react-icons/fi'
  import api from '../services/api'

  export default function Products(){
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
      let active = true

      const loadProducts = async () => {
        try {
          const { data } = await api.get('/products')
          if (active) {
            setProducts(data.products || [])
          }
        } catch (error) {
          if (active) {
            setMessage(error.response?.data?.message || 'Unable to load products.')
          }
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }

      loadProducts()

      return () => {
        active = false
      }
    }, [])

    const addToCart = async (productId) => {
      try {
        await api.post('/cart', { productId, quantity: 1 })
        setMessage('Added to cart.')
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to add item to cart.')
      }
    }

    return (
      <section className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="section-kicker">Customer dashboard</span>
          <h1 className="text-4xl font-bold text-primary-strong sm:text-5xl">Products ready to buy.</h1>
          <p className="text-slate-600">Browse live inventory from MongoDB, add items to your cart, and continue to checkout.</p>
        </div>

        {message ? <p className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

        {loading ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/75 p-6 text-slate-600">Loading products...</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="card-soft flex h-full flex-col overflow-hidden p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg shadow-blue-500/20">
                    <FiStar />
                  </div>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-primary-strong">{product.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{product.description || 'A clean ecommerce product card linked to the database.'}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-xl font-bold text-primary-strong">${Number(product.price || 0).toFixed(2)}</span>
                  <button type="button" onClick={() => addToCart(product.id)} className="btn-primary text-sm" disabled={product.stock <= 0}>
                    <FiShoppingCart />
                    Buy now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    )
  }
