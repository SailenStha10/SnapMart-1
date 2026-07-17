import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ForgotPasswordSent from '../pages/ForgotPasswordSent'
import ResetPassword from '../pages/ResetPassword'
import ResetSuccess from '../pages/ResetSuccess'
import Checkout from '../pages/Checkout'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home initialSection="hero" /></MainLayout>} />
      <Route path="/about" element={<MainLayout><Home initialSection="about" /></MainLayout>} />
      <Route path="/services" element={<MainLayout><Home initialSection="services" /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Home initialSection="contact" /></MainLayout>} />
      <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
      <Route path="/products/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
      <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
      <Route path="/forgot-password/sent" element={<MainLayout><ForgotPasswordSent /></MainLayout>} />
      <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
      <Route path="/reset-success" element={<MainLayout><ResetSuccess /></MainLayout>} />
      <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/admin/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      </Route>

      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  )
}
