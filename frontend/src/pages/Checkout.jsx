import React from 'react'

export default function Checkout(){
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <span className="section-kicker">Checkout</span>
        <h1 className="mt-3 text-4xl font-bold text-primary-strong">Finish your order</h1>
      </div>

      <div className="card-soft space-y-4 p-6">
        <p className="text-slate-600">Shipping and payment capture can be added here next. The checkout screen is already protected and ready for cart data from MongoDB.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input-field" placeholder="Shipping name" />
          <input className="input-field" placeholder="Phone number" />
          <input className="input-field sm:col-span-2" placeholder="Delivery address" />
          <input className="input-field" placeholder="Card number" />
          <input className="input-field" placeholder="Expiry / CVV" />
        </div>
        <button type="button" className="btn-primary">
          Place order
        </button>
      </div>
    </section>
  )
}
