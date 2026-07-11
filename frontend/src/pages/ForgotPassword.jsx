import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      const token = response.data.token
      const params = new URLSearchParams({ email })

      if (token) {
        params.set('token', token)
      }

      navigate(`/forgot-password/sent?${params.toString()}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>
      <p className="mb-4 text-sm text-gray-600">Enter your email and we will send password reset instructions.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          type="email"
          required
          className="w-full rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button disabled={loading} className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-70">
          {loading ? 'Sending reset link...' : 'Reset Password'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        <Link to="/login" className="text-primary">
          Back to login
        </Link>
      </p>
    </div>
  )
}
