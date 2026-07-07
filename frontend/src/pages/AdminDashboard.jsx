import React, { useEffect, useState } from 'react'
import api from '../services/api'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  images: '',
}

export default function AdminDashboard(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    const { data } = await api.get('/products')
    setProducts(data.products || [])
  }

  useEffect(() => {
    const init = async () => {
      try {
        await loadProducts()
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load admin products.')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          ? form.images.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      })
      setForm(emptyForm)
      setMessage('Product created successfully.')
      await loadProducts()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create product.')
    }
  }

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`)
      setMessage('Product removed.')
      await loadProducts()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to remove product.')
    }
  }

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <span className="section-kicker">Admin dashboard</span>
        <h1 className="text-4xl font-bold text-primary-strong sm:text-5xl">Manage products and storefront data.</h1>
        <p className="text-slate-600">This dashboard uses the same database, but only admin users can create, edit, or remove products.</p>
      </div>

      {message ? <p className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form className="card-soft space-y-4 p-6" onSubmit={handleCreate}>
          <div>
            <h2 className="text-2xl font-bold text-primary-strong">Add product</h2>
            <p className="mt-2 text-sm text-slate-600">Create a new item in MongoDB.</p>
          </div>
          <input className="input-field" placeholder="Product name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <textarea className="input-field min-h-28" placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-field" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required />
            <input className="input-field" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} required />
          </div>
          <input className="input-field" placeholder="Image URLs comma separated" value={form.images} onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))} />
          <button type="submit" className="btn-primary w-full">Create product</button>
        </form>

        <div className="card-soft space-y-4 p-6">
          <div>
            <h2 className="text-2xl font-bold text-primary-strong">Current products</h2>
            <p className="mt-2 text-sm text-slate-600">Edit and remove items from the live catalog.</p>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading products...</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="font-semibold text-primary-strong">{product.name}</p>
                    <p className="text-sm text-slate-500">${Number(product.price || 0).toFixed(2)} · Stock {product.stock}</p>
                  </div>
                  <button type="button" onClick={() => handleDelete(product.id)} className="btn-secondary text-sm">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}