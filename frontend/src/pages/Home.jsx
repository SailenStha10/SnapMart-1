import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiTruck, FiShield, FiStar } from 'react-icons/fi'

export default function Home(){
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(4)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/products')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleSkip = () => {
    navigate('/products')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#163A6B] to-[#0f2f5a] flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-8 max-w-2xl px-4">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <FiShoppingBag className="text-6xl animate-bounce" />
            <h1 className="text-6xl font-bold">SnapMart</h1>
          </div>
          <p className="text-2xl text-blue-200">Your one-stop shop for everything</p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
            <FiTruck className="text-4xl mx-auto text-yellow-400" />
            <h3 className="font-semibold">Fast Delivery</h3>
            <p className="text-sm text-blue-200">Get your order in 30-40 minutes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
            <FiShield className="text-4xl mx-auto text-green-400" />
            <h3 className="font-semibold">Safe Packaging</h3>
            <p className="text-sm text-blue-200">Secure and protected delivery</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
            <FiStar className="text-4xl mx-auto text-purple-400" />
            <h3 className="font-semibold">Best Prices</h3>
            <p className="text-sm text-blue-200">Competitive prices guaranteed</p>
          </div>
        </div>

        {/* Countdown and Skip Button */}
        <div className="space-y-4 mt-12">
          <div className="text-2xl font-semibold animate-pulse">
            Redirecting to products in {countdown} seconds...
          </div>
          
          <button
            onClick={handleSkip}
            className="px-8 py-3 bg-white text-[#163A6B] rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
          >
            Skip to Products
          </button>
        </div>

        {/* Additional Trust Badges */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-blue-200">
          <span>✓ 100% Authentic</span>
          <span>✓ Easy Returns</span>
          <span>✓ 24/7 Support</span>
        </div>
      </div>
    </div>
  )
}
