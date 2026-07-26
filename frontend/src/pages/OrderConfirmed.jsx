import React from 'react'
import { FiCheckCircle, FiShoppingBag, FiTruck, FiCreditCard, FiCalendar, FiDownload, FiArrowRight } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OrderConfirmed() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const orderData = location.state?.orderData

  // Redirect if no order data
  if (!orderData) {
    navigate('/products')
    return null
  }

  const orderDetails = orderData

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 rounded-full p-4 mb-4">
            <FiCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2 text-center">
            Thank you{user?.name ? `, ${user.name}` : ''} for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-blue-50 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700">
            <div className="flex items-center space-x-3">
              <FiShoppingBag className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">{orderDetails.orderId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{orderDetails.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCreditCard className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold">{orderDetails.paymentMethod}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <span className="text-white font-bold">Rs</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold">Rs: {orderDetails.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Item Purchase */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Purchase</h2>
          <div className="border rounded-xl overflow-hidden">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <FiShoppingBag className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name} {item.weight}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">Rs: {item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Details</h2>
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-start space-x-3 mb-4">
              <FiTruck className="text-green-500 text-xl mt-1" />
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery Time</p>
                <p className="font-semibold text-green-700">{orderDetails.estimatedDeliveryTime}</p>
              </div>
            </div>
            <div className="border-t border-green-200 pt-4">
              <p className="text-sm text-gray-500 mb-2">Delivery Address</p>
              <p className="font-semibold text-gray-800">{orderDetails.deliveryAddress.name}</p>
              <p className="text-gray-600">{orderDetails.deliveryAddress.phone}</p>
              <p className="text-gray-600">{orderDetails.deliveryAddress.street}</p>
              <p className="text-gray-600">{orderDetails.deliveryAddress.city}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            <FiShoppingBag />
            <span>Continue Shopping</span>
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            <FiTruck />
            <span>Track Order</span>
          </Link>
          <button
            className="flex items-center justify-center space-x-2 border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            <FiDownload />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>
    </div>
  )
}
