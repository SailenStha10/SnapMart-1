import React, { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function ForgotPasswordSent() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <span className="text-xl">✉️</span>
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-gray-600">
          We sent a password reset link to <span className="font-semibold">{email}</span>.
        </p>
        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={() => window.open('https://mail.google.com', '_blank')}
            className="w-full rounded bg-primary px-4 py-2 text-white"
          >
            Open email app
          </button>
          {token ? (
            <Link
              to={`/reset-password?token=${token}`}
              className="block rounded border border-primary px-4 py-2 text-center text-primary"
            >
              Reset Password
            </Link>
          ) : (
            <p className="text-sm text-gray-500">If you do not see the email, check your spam folder.</p>
          )}
          <Link to="/login" className="block text-center text-sm text-gray-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
