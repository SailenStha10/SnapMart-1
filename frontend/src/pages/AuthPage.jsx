import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiLock, FiUser } from 'react-icons/fi'

export default function AuthPage({ initialMode = 'login' }){
  const [mode, setMode] = useState(initialMode)

  const isLogin = mode === 'login'

  const modeLabel = useMemo(() => (isLogin ? 'Login' : 'Sign up'), [isLogin])

  return (
    <div className="grid min-h-[calc(100vh-180px)] items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="space-y-5">
        <span className="section-kicker">Account access</span>
        <h1 className="max-w-xl text-4xl font-bold text-primary-strong sm:text-5xl">One card, two states.</h1>
        <p className="max-w-lg text-slate-600">
          Slide between login and sign up without leaving the page.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-soft p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Login</p>
            <p className="mt-2 text-sm text-slate-600">For returning users.</p>
          </div>
          <div className="card-soft p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Sign up</p>
            <p className="mt-2 text-sm text-slate-600">For new users.</p>
          </div>
        </div>

        <Link to="/" className="btn-secondary w-fit">
          Back to home
        </Link>
      </section>

      <section className="relative">
        <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="card relative overflow-hidden p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${isLogin ? 'bg-white text-primary-strong shadow-sm' : 'text-slate-500'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${!isLogin ? 'bg-white text-primary-strong shadow-sm' : 'text-slate-500'}`}
            >
              Sign up
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white">
            <div
              className="flex w-[200%] transition-transform duration-500 ease-in-out"
              style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(-50%)' }}
            >
              <div className="w-1/2 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-kicker">Welcome back</p>
                    <h2 className="mt-3 text-2xl font-bold text-primary-strong">Login to SnapMart</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white">
                    <FiLock />
                  </div>
                </div>

                <form className="mt-6 space-y-4">
                  <input className="input-field" placeholder="Email address" />
                  <input className="input-field" type="password" placeholder="Password" />
                  <button type="button" className="btn-primary w-full">
                    Sign in <FiArrowRight />
                  </button>
                </form>
              </div>

              <div className="w-1/2 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-kicker">Create account</p>
                    <h2 className="mt-3 text-2xl font-bold text-primary-strong">Join SnapMart</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white">
                    <FiUser />
                  </div>
                </div>

                <form className="mt-6 space-y-4">
                  <input className="input-field" placeholder="Full name" />
                  <input className="input-field" placeholder="Email address" />
                  <input className="input-field" type="password" placeholder="Create password" />
                  <button type="button" className="btn-primary w-full">
                    Create account <FiArrowRight />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Current view: <span className="font-semibold text-primary-strong">{modeLabel}</span>
          </p>
        </div>
      </section>
    </div>
  )
}