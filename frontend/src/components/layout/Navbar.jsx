import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiArrowRight, FiHeart, FiLogOut, FiShoppingCart } from 'react-icons/fi'
import useCart from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { cartCount, wishlistCount } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const dashboardLink = isAdmin ? '/admin/dashboard' : '/dashboard'

  return (
    <nav className="pointer-events-none sticky top-4 z-30 px-4 sm:top-5 sm:px-5 lg:top-6">
      <div className="pointer-events-auto mx-auto flex w-full max-w-7xl flex-col gap-2 rounded-[1.5rem] border border-white/65 bg-white/72 px-4 py-2 shadow-[0_14px_35px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient text-xs font-bold text-white shadow-lg shadow-blue-500/20">
            S
          </span>
          <span>
            <span className="block text-sm font-bold leading-none text-primary-strong">SnapMart</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/70 bg-white/70 p-1 shadow-sm shadow-slate-900/5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-strong'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Link to="/wishlist" className="btn-secondary text-xs px-2 py-1">
            <FiHeart /> {wishlistCount ? wishlistCount : ''}
          </Link>
          <Link to="/cart" className="btn-secondary text-xs px-2 py-1">
            <FiShoppingCart /> {cartCount ? cartCount : ''}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} className="btn-secondary text-xs px-2 py-1">
                {isAdmin ? 'Admin' : user?.name ? user.name.split(' ')[0] : 'Dashboard'}
              </Link>
              <button type="button" onClick={logout} className="btn-secondary text-xs px-2 py-1">
                <FiLogOut />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-secondary text-xs px-2 py-1">
              Login
            </Link>
          )}

          <Link to="/products" className="btn-primary text-xs px-2 py-1">
            Products <FiArrowRight />
          </Link>
        </div>
      </div>
    </nav>
  )
}
