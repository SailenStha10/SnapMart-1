import React from 'react'
import { FiArrowDownRight, FiShoppingBag, FiUsers, FiZap } from 'react-icons/fi'
import useRevealSections from '../hooks/useRevealSections'

const values = [
  {
    icon: FiShoppingBag,
    title: 'Shopping first',
    text: 'The about page explains the storefront direction without crowding the viewport.',
  },
  {
    icon: FiZap,
    title: 'Fast experience',
    text: 'Sections are spaced for laptop screens and transition naturally as the user scrolls.',
  },
  {
    icon: FiUsers,
    title: 'User friendly',
    text: 'The reading width stays centered so the content feels easy to scan and separate.',
  },
]

export default function About(){
  const sectionRefs = useRevealSections()

  return (
    <div className="space-y-10 lg:space-y-14">
      <section ref={(node) => { sectionRefs.current[0] = node }} className="reveal relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/12 px-6 py-14 sm:px-10 lg:min-h-[calc(100vh-9rem)] lg:px-14 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,128,237,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(30,99,198,0.12),transparent_24%)]" />
        <div className="absolute inset-0 scene-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:min-h-[calc(100vh-14rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <span className="section-kicker">About SnapMart</span>
           
            
          </div>
          <div className="rounded-[1.8rem] border border-white/30 bg-white/18 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Project focus</p>
            <p className="mt-3 text-slate-600">Visual clarity, easy navigation, and a laptop-friendly composition.</p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>Dedicated route and content block.</p>
              <p>Centered reading area with soft background effects.</p>
              <p>Scroll-friendly pacing for better UX.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={(node) => { sectionRefs.current[1] = node }} className="reveal grid gap-6 lg:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon
          return (
            <article key={value.title} className="reveal rounded-[1.8rem] border border-white/20 bg-white/12 p-6 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg shadow-blue-500/15">
                <Icon />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-primary-strong">{value.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{value.text}</p>
            </article>
          )
        })}
      </section>

      <section ref={(node) => { sectionRefs.current[2] = node }} className="reveal grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.8rem] border border-white/20 bg-white/12 p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-primary-strong">What this page covers</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Dedicated pages for Home, About, Services, and Contact.</li>
            <li>A consistent visual system across the full app.</li>
            <li>A centered layout that reads well on laptop screens.</li>
          </ul>
        </div>

        <div className="rounded-[1.8rem] border border-white/20 bg-white/14 p-6 sm:p-8 backdrop-blur-sm">
          <p className="section-kicker">Scroll cue</p>
          <h3 className="mt-4 text-xl font-bold text-primary-strong">Move down to continue</h3>
          <p className="mt-3 text-slate-600">
            The page keeps the content separate and uses the scroll experience as the transition between sections.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
            <FiArrowDownRight />
            <span>Soft, scroll-based content exchange</span>
          </div>
        </div>
      </section>
    </div>
  )
}