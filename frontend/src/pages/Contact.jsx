import React from 'react'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import useRevealSections from '../hooks/useRevealSections'

const details = [
  {
    icon: FiMail,
    title: 'Email',
    text: 'support@kosheli.com',
  },
  {
    icon: FiPhone,
    title: 'Phone',
    text: '9707743309',
  },
  {
    icon: FiMapPin,
    title: 'Location',
    text: 'Online storefront, built for anywhere access',
  },
]

export default function Contact(){
  const sectionRefs = useRevealSections()

  return (
    <div className="space-y-10 lg:space-y-14">
      <section ref={(node) => { sectionRefs.current[0] = node }} className="reveal relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/12 px-6 py-14 sm:px-10 lg:min-h-[calc(100vh-9rem)] lg:px-14 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,128,237,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(30,99,198,0.12),transparent_24%)]" />
        <div className="absolute inset-0 scene-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:min-h-[calc(100vh-14rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <span className="section-kicker">Contact</span>
            <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
              The contact page stays independent, centered, and readable so the user can complete the journey without losing context.
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-white/30 bg-white/18 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Quick info</p>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p>Reach support, feedback, or project questions.</p>
              <p>The section is designed to keep the content separate and easy to scan.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={(node) => { sectionRefs.current[1] = node }} className="reveal grid gap-6 lg:grid-cols-3">
        {details.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title} className="reveal rounded-[1.8rem] border border-white/20 bg-white/12 p-6 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg shadow-blue-500/15">
                <Icon />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-primary-strong">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          )
        })}
      </section>

      <section ref={(node) => { sectionRefs.current[2] = node }} className="reveal rounded-[1.8rem] border border-white/20 bg-white/14 p-6 sm:p-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-primary-strong">Send a message</h2>
        <p className="mt-3 text-slate-600">
          A full contact form ends the page so the scroll flow finishes on a useful action.
        </p>
        <form className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-field" placeholder="Your name" />
            <input className="input-field" placeholder="Email address" />
          </div>
          <input className="input-field" placeholder="Subject" />
          <textarea className="input-field min-h-[170px] resize-none" placeholder="Tell us what you need" />
          <button type="button" className="btn-primary w-full sm:w-auto">
            Send message
          </button>
        </form>
      </section>
    </div>
  )
}