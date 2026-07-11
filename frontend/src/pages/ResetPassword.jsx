import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/reset-password', {
        token,
        password: form.password,
        confirmPassword: form.confirmPassword
      })
      navigate('/reset-success')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Set New Password</h1>
      <p className="mb-4 text-sm text-gray-600">Your new password must be different from previously used passwords.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="New Password"
          type="password"
          required
          className="w-full rounded border px-3 py-2"
        />
        <input
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Confirm Password"
          type="password"
          required
          className="w-full rounded border px-3 py-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-70">
          {loading ? 'Resetting password...' : 'Reset Password'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        <Link to="/login" className="text-primary">
          Back to Login
        </Link>
      </p>
    </div>
  )
}
