import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import api from '../services/api'

export default function ProductDetails(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data.product)
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load product.')
      }
    }

    loadProduct()
  }, [id])

  const addToCart = async () => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 })
      setMessage('Added to cart.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to add item to cart.')
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <span className="section-kicker">Product details</span>
        <h1 className="mt-3 text-4xl font-bold text-primary-strong">{product?.name || 'Product details'}</h1>
      </div>

      {message ? <p className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

      <div className="card-soft space-y-4 p-6">
        <p className="text-slate-600">{product?.description || 'The selected product will load from the backend and can be purchased from this view.'}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-primary-strong">${Number(product?.price || 0).toFixed(2)}</span>
          <button type="button" className="btn-primary" onClick={addToCart} disabled={!product}>
            <FiShoppingCart />
            Add to cart
          </button>
        </div>
      </div>
    </section>
  )
}
 