import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiLock, FiUser } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ initialMode = 'login' }){
  const [mode, setMode] = useState(initialMode)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', role: 'user', adminKey: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, register } = useAuth()
  const navigate = useNavigate()

  const isLogin = mode === 'login'
  const modeLabel = useMemo(() => (isLogin ? 'Login' : 'Sign up'), [isLogin])

  const redirectForRole = (role) => (role === 'admin' ? '/admin/dashboard' : '/dashboard')

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await signIn({
        email: loginForm.email,
        password: loginForm.password,
      })

      toast.success(response.message || 'Signed in successfully')
      navigate(redirectForRole(response.user?.role), { replace: true })
    } catch (loginError) {
      const message = loginError.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await register({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role,
        adminKey: signupForm.role === 'admin' ? signupForm.adminKey : undefined,
      })

      toast.success(response.message || 'Account created successfully')
      navigate(redirectForRole(response.user?.role || signupForm.role), { replace: true })
    } catch (signupError) {
      const message = signupError.response?.data?.message || 'Signup failed'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-180px)] items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="space-y-5">
        <span className="section-kicker">Account access</span>
        <h1 className="max-w-xl text-4xl font-bold text-primary-strong sm:text-5xl">SignUp Your Account to Continue</h1>
        <p className="max-w-lg text-slate-600">
          Slide between login and sign up without leaving the page.
        </p>

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

                <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="Email address"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Signing in...' : <><span>Sign in</span><FiArrowRight /></>}
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

                <form className="mt-6 space-y-4" onSubmit={handleSignupSubmit}>
                  <input
                    className="input-field"
                    placeholder="Full name"
                    value={signupForm.name}
                    onChange={(event) => setSignupForm((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                  <input
                    className="input-field"
                    type="email"
                    placeholder="Email address"
                    value={signupForm.email}
                    onChange={(event) => setSignupForm((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                  <input
                    className="input-field"
                    type="password"
                    placeholder="Create password"
                    value={signupForm.password}
                    onChange={(event) => setSignupForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                  <select
                    className="input-field"
                    value={signupForm.role}
                    onChange={(event) => setSignupForm((current) => ({ ...current, role: event.target.value }))}
                  >
                    <option value="user">User account</option>
                    <option value="admin">Admin account</option>
                  </select>
                  {signupForm.role === 'admin' && (
                    <div className="space-y-2">
                      <input
                        className="input-field"
                        type="password"
                        placeholder="Admin signup key"
                        value={signupForm.adminKey}
                        onChange={(event) => setSignupForm((current) => ({ ...current, adminKey: event.target.value }))}
                        required
                      />
                      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Use admin123 to create an admin account.
                      </p>
                    </div>
                  )}
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Creating account...' : <><span>Create account</span><FiArrowRight /></>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-center text-sm font-medium text-red-500">{error}</p> : null}
          <p className="mt-5 text-center text-sm text-slate-500">
            Current view: <span className="font-semibold text-primary-strong">{modeLabel}</span>
          </p>
        </div>
      </section>
    </div>
  )
}
