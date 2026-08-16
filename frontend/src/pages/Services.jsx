import React from 'react'
import { FiBox, FiGrid, FiPackage, FiShoppingCart } from 'react-icons/fi'
import useRevealSections from '../hooks/useRevealSections'

const services = [
  {
    icon: FiPackage,
    title: 'Product discovery',
    text: 'A browsing-focused service area with clear reading width and separate sections.',
  },
  {
    icon: FiShoppingCart,
    title: 'Cart ready flow',
    text: 'The page explains the shopping journey in a way that feels structured and easy to follow.',
  },
  {
    icon: FiGrid,
    title: 'Project pages',
    text: 'About, Services, and Contact are kept as individual routes for better UX.',
  },
]

export default function Services(){
  const sectionRefs = useRevealSections()

  return (
    <div className="space-y-10 lg:space-y-14">
      <section ref={(node) => { sectionRefs.current[0] = node }} className="reveal relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/12 px-6 py-14 sm:px-10 lg:min-h-[calc(100vh-9rem)] lg:px-14 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,99,198,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(47,128,237,0.12),transparent_24%)]" />
        <div className="absolute inset-0 scene-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:min-h-[calc(100vh-14rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <span className="section-kicker">Services</span>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-primary-strong sm:text-5xl">
              A dedicated page for KOSHELI services and structure.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
              This page stays separate and scrollable, so the services content changes naturally as the user moves down the page.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-white/30 bg-white/18 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Service flow</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Browse', 'Compare', 'Choose', 'Checkout'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/35 bg-white/24 px-4 py-4 text-sm font-medium text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={(node) => { sectionRefs.current[1] = node }} className="reveal grid gap-6 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <article key={service.title} className="reveal rounded-[1.8rem] border border-white/20 bg-white/12 p-6 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg shadow-blue-500/15">
                <Icon />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-primary-strong">{service.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{service.text}</p>
            </article>
          )
        })}
      </section>

      <section ref={(node) => { sectionRefs.current[2] = node }} className="reveal grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.8rem] border border-white/20 bg-white/12 p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-primary-strong">Flow overview</h2>
          <p className="mt-4 text-slate-600">
            The section blocks are intentionally spaced for a laptop-first design and designed to transition cleanly when the user scrolls.
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-white/20 bg-white/14 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <FiBox className="text-xl text-primary" />
            <h3 className="text-xl font-bold text-primary-strong">Designed for clarity</h3>
          </div>
          <p className="mt-4 text-slate-600">
            Separate content blocks help the service page feel like its own destination instead of a repeating panel.
          </p>
        </div>
      </section>
    </div>
  )
}