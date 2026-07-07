import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Products from '../pages/Products'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Checkout from '../pages/Checkout'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from '../pages/AdminDashboard'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home initialSection="hero" /></MainLayout>} />
      <Route path="/about" element={<MainLayout><Home initialSection="about" /></MainLayout>} />
      <Route path="/services" element={<MainLayout><Home initialSection="services" /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Home initialSection="contact" /></MainLayout>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MainLayout><Dashboard/></MainLayout>} />
        <Route path="/products" element={<MainLayout><Products/></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetails/></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart/></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout><Wishlist/></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><Checkout/></MainLayout>} />
      </Route>
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<MainLayout><AdminDashboard/></MainLayout>} />
      </Route>
      <Route path="/login" element={<MainLayout><Login/></MainLayout>} />
      <Route path="/register" element={<MainLayout><Register/></MainLayout>} />
      <Route path="*" element={<MainLayout><NotFound/></MainLayout>} />
    </Routes>
  )
}
