import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/register', form)
      login(response.data.user, response.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full Name"
          required
          className="w-full rounded border px-3 py-2"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone Number"
          type="tel"
          required
          className="w-full rounded border px-3 py-2"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          type="email"
          required
          className="w-full rounded border px-3 py-2"
        />
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
          required
          className="w-full rounded border px-3 py-2"
        />
        <select
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select City</option>
          <option value="kathmandu">Kathmandu</option>
          <option value="pokhara">Pokhara</option>
          <option value="lalitpur">Lalitpur</option>
          <option value="bhaktapur">Bhaktapur</option>
        </select>
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          type="password"
          required
          className="w-full rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-70">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary">
          Sign in
        </Link>
      </p>
    </div>
  )
}
