import React from 'react'

export default function Login(){
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-3">
        <input placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input placeholder="Password" type="password" className="w-full px-3 py-2 border rounded" />
        <button className="px-4 py-2 bg-primary text-white rounded">Sign in</button>
      </form>
    </div>
  )
}
