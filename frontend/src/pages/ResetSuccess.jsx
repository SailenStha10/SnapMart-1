import React from 'react'
import { Link } from 'react-router-dom'

export default function ResetSuccess() {
  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold">Password Reset</h1>
        <p className="text-sm text-gray-600">Your password has been successfully reset. Click below to login.</p>
        <Link to="/login" className="w-full rounded bg-primary px-4 py-2 text-white text-center">
          Continue
        </Link>
      </div>
    </div>
  )
}
