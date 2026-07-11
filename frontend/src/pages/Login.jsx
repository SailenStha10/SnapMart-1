scrum34
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', form)
      login(response.data.user, response.data.token)
      
      // Redirect admins to dashboard, others to home
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>
      <p className="mb-4 text-sm text-gray-600">Registered users and admin users can sign in here.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          type="email"
          required
          className="w-full rounded border px-3 py-2"
        />
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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-3 text-sm text-right">
        <Link to="/forgot-password" className="text-primary">
          Forgot password?
        </Link>
      </p>
      <p className="mt-4 text-sm text-gray-600">
        New here?{' '}
        <Link to="/register" className="text-primary">
          Create an account
        </Link>
      </p>
    </div>
  )

import React from 'react'
import AuthPage from './AuthPage'

export default function Login(){
  return <AuthPage initialMode="login" />
main
}
