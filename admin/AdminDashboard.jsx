import React, { useState } from 'react'
import { FiUsers, FiShoppingBag, FiTrendingUp, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { useAuth } from '../frontend/src/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([
    { id: 1, name: 'Dabur RED Toothpaste', category: 'Toothpaste', price: 200, stock: 50 },
    { id: 2, name: 'Sensodyne Toothpaste', category: 'Toothpaste', price: 250, stock: 30 },
    { id: 3, name: 'Wireless Headphones', category: 'Electronics', price: 150, stock: 20 },
  ])
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const stats = [
    { label: 'Total Products', value: 156, icon: FiShoppingBag, color: 'bg-blue-100' },
    { label: 'Total Users', value: 2340, icon: FiUsers, color: 'bg-green-100' },
    { label: 'Total Revenue', value: 'Rs 45,820', icon: FiTrendingUp, color: 'bg-purple-100' },
  ]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">SnapMart Admin</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || 'Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Overview</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="rounded-lg bg-white p-6 shadow-sm">
                    <div className={`mb-4 inline-block rounded-lg p-3 ${stat.color}`}>
                      <Icon className="text-xl" />
                    </div>
                    <h3 className="text-gray-600">{stat.label}</h3>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90">
                <FiPlus /> Add Product
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4">Rs {product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-sm ${
                            product.stock > 20 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="rounded-lg border p-2 text-blue-500 hover:bg-blue-50">
                              <FiEdit2 />
                            </button>
                            <button className="rounded-lg border p-2 text-red-500 hover:bg-red-50">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-600">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Manage Users</h2>
            <div className="rounded-lg bg-white p-6 shadow-sm text-center text-gray-600">
              <p>User management interface coming soon...</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Manage Orders</h2>
            <div className="rounded-lg bg-white p-6 shadow-sm text-center text-gray-600">
              <p>Orders management interface coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
