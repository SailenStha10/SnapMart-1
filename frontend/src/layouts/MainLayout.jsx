import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function MainLayout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
