import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-white mt-12 border-t py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Snapmart — Starter project
      </div>
    </footer>
  )
}
