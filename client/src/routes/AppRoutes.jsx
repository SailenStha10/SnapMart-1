import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Checkout from '../pages/Checkout'
import NotFound from '../pages/NotFound'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home/></MainLayout>} />
      <Route path="/products" element={<MainLayout><Products/></MainLayout>} />
      <Route path="/products/:id" element={<MainLayout><ProductDetails/></MainLayout>} />
      <Route path="/cart" element={<MainLayout><Cart/></MainLayout>} />
      <Route path="/wishlist" element={<MainLayout><Wishlist/></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login/></MainLayout>} />
      <Route path="/register" element={<MainLayout><Register/></MainLayout>} />
      <Route path="/checkout" element={<MainLayout><Checkout/></MainLayout>} />
      <Route path="*" element={<MainLayout><NotFound/></MainLayout>} />
    </Routes>
  )
}
