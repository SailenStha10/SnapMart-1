import React from 'react'
import Navbar from '../components/layout/Navbar'

export default function MainLayout({ children }){
  return (
    <div className="app-shell min-h-screen">
      <div className="tech-bg" aria-hidden="true" />
      <Navbar />
scrum34
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />

      <main className="page-transition page-scroll mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
 main
    </div>
  )
}
