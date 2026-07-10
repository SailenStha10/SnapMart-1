import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiBox, FiCheckCircle, FiLayers, FiShoppingBag, FiTruck, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import useRevealSections from '../hooks/useRevealSections'

const highlights = [
  {
    icon: FiTruck,
    title: 'Fast delivery flow',
    text: 'A cleaner route for discovering products and getting into the shopping experience quickly.',
  },
  {
    icon: FiShoppingBag,
    title: 'Product focused',
    text: 'The structure highlights what the store offers without stacking heavy content blocks.',
  },
  {
    icon: FiLayers,
    title: 'Smooth sections',
    text: 'About, Services, and Contact read as separate sections that reveal as you scroll.',
  },
]

const services = [
  'Product browsing',
  'Cart and checkout flow',
  'Login and sign up access',
  'Support and contact reach',
]

export default function Home({ initialSection = 'hero' }){
  const sectionRefs = useRevealSections()

  useEffect(() => {
    const target = document.getElementById(initialSection)
    if (target) {
      const offset = 88
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [initialSection])

  return (
    <div className="page-scroll space-y-10 lg:space-y-14">
      <section id="hero" ref={(node) => { sectionRefs.current[0] = node }} className="reveal relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 px-6 py-16 sm:px-10 lg:min-h-[calc(100vh-9rem)] lg:px-14 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,128,237,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(30,99,198,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.06),transparent_22%)]" />
        <div className="absolute inset-0 scene-grid opacity-60" />
        <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute right-12 top-20 h-32 w-32 rounded-full bg-cyan-300/18 blur-3xl" />
        <div className="absolute left-[18%] top-[16%] hidden h-8 w-8 rounded-full border border-white/60 bg-white/35 backdrop-blur-sm lg:block" />
        <div className="absolute right-[18%] bottom-[18%] hidden h-10 w-10 rounded-full border border-white/50 bg-white/28 backdrop-blur-sm lg:block" />

        <div className="relative mx-auto flex min-h-[calc(100vh-14rem)] max-w-4xl flex-col items-center justify-center text-center">
          <span className="section-kicker mx-auto">Fresh grocery commerce</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-primary-strong sm:text-5xl lg:text-6xl">
            SnapMart built for a clean laptop-first experience.
          </h1>
        

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary">
              Login / Sign up <FiArrowRight />
            </Link>
            <a href="#about" className="btn-secondary">
              Explore sections
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {['Fresh produce', 'Fast checkout', 'Trusted supply', 'Single page flow'].map((item) => (
              <span key={item} className="rounded-full border border-white/45 bg-white/20 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="about" ref={(node) => { sectionRefs.current[1] = node }} className="reveal grid gap-6 lg:min-h-[78vh] lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-4">
          <span className="section-kicker">About SnapMart</span>
          <h2 className="max-w-xl text-3xl font-bold text-primary-strong sm:text-4xl">A separate section for the project story.</h2>
          <p className="max-w-2xl text-slate-600">
            The about content is kept apart so the user can scan the purpose, structure, and experience of the website without losing focus.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <span key={item} className="rounded-full border border-white/35 bg-white/20 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-[1.8rem] border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg shadow-blue-500/15">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary-strong">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="services" ref={(node) => { sectionRefs.current[2] = node }} className="reveal grid gap-6 lg:min-h-[78vh] lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-4">
          <span className="section-kicker">Services</span>
          <h2 className="max-w-xl text-3xl font-bold text-primary-strong sm:text-4xl">What SnapMart offers in a single scroll flow.</h2>
          <p className="text-slate-600">
            The services section stays centered and readable while the page transitions naturally between content blocks.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service} className="rounded-2xl border border-white/30 bg-white/14 px-4 py-4 text-sm font-medium text-slate-600 backdrop-blur-sm">
                {service}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.8rem] border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <FiBox className="text-2xl text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-primary-strong">Shopping flow</h3>
            <p className="mt-2 text-sm text-slate-600">Explore, compare, and move toward checkout.</p>
          </div>
          <div className="rounded-[1.8rem] border border-slate-900/10 bg-slate-900/90 p-6 text-white backdrop-blur-sm">
            <FiCheckCircle className="text-2xl text-blue-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">User experience</h3>
            <p className="mt-2 text-sm text-slate-300">Soft motion keeps the page interactive without feeling busy.</p>
          </div>
          <div className="rounded-[1.8rem] border border-white/20 bg-blue-50/35 p-6 backdrop-blur-sm sm:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Layout cue</p>
            <p className="mt-3 text-slate-600">The content stays separate and scrollable so each section can breathe on a laptop display.</p>
          </div>
        </div>
      </section>

      <section id="contact" ref={(node) => { sectionRefs.current[3] = node }} className="reveal grid gap-6 lg:min-h-[72vh] lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
        <div className="space-y-4">
          <span className="section-kicker">Contact</span>
          <h2 className="max-w-xl text-3xl font-bold text-primary-strong sm:text-4xl">A minimal contact section to close the page.</h2>
          <p className="text-slate-600">
            The end of the page turns into a useful action, so the scroll flow finishes with a direct way to reach the team.
          </p>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3"><FiMail className="text-primary" /> support@snapmart.com</div>
            <div className="flex items-center gap-3"><FiPhone className="text-primary" /> +1 (555) 014-2026</div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-primary-strong">Send a message</h3>
          <p className="mt-3 text-slate-600">A lightweight form ends the page without bringing the old card style back.</p>
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
        </div>
      </section>
    </div>
  )
}
