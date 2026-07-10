import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiArrowRight, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar(){
  const { isAuthenticated, isAdmin, logout } = useAuth()

  const dashboardLink = isAdmin ? '/admin/dashboard' : '/dashboard'

  return (
    <nav className="pointer-events-none sticky top-4 z-30 px-4 sm:top-5 sm:px-5 lg:top-6">
      <div className="pointer-events-auto mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-[1.5rem] border border-white/65 bg-white/72 px-4 py-3 shadow-[0_14px_35px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            S
          </span>
          <span>
            <span className="block text-base font-bold leading-none text-primary-strong">SnapMart</span>
            <span className="text-[0.67rem] font-medium uppercase tracking-[0.28em] text-slate-500">Fresh shopping, fast delivery</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-sm shadow-slate-900/5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-100 hover:text-primary-strong'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} className="btn-secondary text-sm">
                {isAdmin ? 'Admin dashboard' : 'My dashboard'}
              </Link>
              <button type="button" onClick={logout} className="btn-secondary text-sm">
                Logout <FiLogOut />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-secondary text-sm">
              Login / Sign up
            </Link>
          )}
          <Link to="/products" className="btn-primary text-sm">
            Browse products <FiArrowRight />
          </Link>
        </div>
      </div>
    </nav>
  )
}
