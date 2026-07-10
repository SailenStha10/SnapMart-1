import React from 'react'

export default function Wishlist(){
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <span className="section-kicker">Wishlist</span>
        <h1 className="mt-3 text-4xl font-bold text-primary-strong">Saved for later</h1>
      </div>
      <div className="card-soft p-6">
        <p className="text-slate-600">Wishlist support can be connected to the backend next. This screen now matches the new dashboard layout.</p>
      </div>
    </section>
  )
}
