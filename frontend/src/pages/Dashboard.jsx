import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FiArrowRight,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
  FiGrid,
  FiLock,
  FiSearch,
  FiPackage,
  FiRefreshCw,
  FiSave,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiShield,
  FiStar,
  FiTag,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { createAdminProduct, fetchAdminOrders } from '../services/admin'

const adminSidebar = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { key: 'users', label: 'Users', icon: FiUsers },
  { key: 'products', label: 'Products', icon: FiPackage },
  { key: 'settings', label: 'Settings', icon: FiSettings },
]

const userSidebar = [
  { key: 'products', label: 'All Products', icon: FiShoppingBag },
]

const defaultProductForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(Number(value || 0))

const barColors = ['#1e3a5f', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']

function SimpleBarChart({ data, width = 500, height = 200 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-400 text-sm">
        No chart data available yet.
      </div>
    )
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const barWidth = Math.max(20, Math.min(60, (width - 40) / data.length - 10))
  const chartHeight = height - 40

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <line x1="30" y1="10" x2="30" y2={chartHeight + 10} stroke="#e2e8f0" strokeWidth="1" />
      <line x1="30" y1={chartHeight + 10} x2={width - 10} y2={chartHeight + 10} stroke="#e2e8f0" strokeWidth="1" />
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / maxVal) * chartHeight)
        const x = 35 + i * (barWidth + 10)
        const y = chartHeight + 10 - barH
        const color = barColors[i % barColors.length]
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} fill={color} rx="2" opacity="0.85" />
            <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#64748b">
              {d.label}
            </text>
            <text x={x + barWidth / 2} y={y - 16} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
              {d.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [activeSection, setActiveSection] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [creatingProduct, setCreatingProduct] = useState(false)
  const [productForm, setProductForm] = useState(defaultProductForm)
  const [editingId, setEditingId] = useState(null)
  const [settingsForm, setSettingsForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    displayName: user?.name || '',
    email: user?.email || '',
    visibility: 'public',
    dashboardRefresh: '30',
    theme: 'light',
  })
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userSelectedCategory, setUserSelectedCategory] = useState('All')
  const [userSelectedBrand, setUserSelectedBrand] = useState('Any')
  const [userSelectedPrice, setUserSelectedPrice] = useState('Any')
  const [userSelectedSort, setUserSelectedSort] = useState('Best rating')
  const [userInStock, setUserInStock] = useState(false)
  const [userInStorePickup, setUserInStorePickup] = useState(false)
  const [userSameDayDelivery, setUserSameDayDelivery] = useState(false)
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const userProductsPerPage = 6

  const loadAllData = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products')
      setProducts(data.products || [])
      if (isAdmin) {
        const [orderResponse, usersResponse] = await Promise.all([
          fetchAdminOrders(),
          api.get('/users'),
        ])
        setOrders(orderResponse.orders || [])
        setUsers(usersResponse.data.users || [])
      }
    } catch {
      toast.error('Unable to load data')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const productTotalValue = useMemo(
    () => products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0),
    [products],
  )

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [orders],
  )

  const handleCreateProduct = async (event) => {
    event.preventDefault()
    setCreatingProduct(true)
    try {
      await createAdminProduct({
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock || 0),
        images: productForm.imageUrl ? [productForm.imageUrl] : [],
      })
      toast.success('Product created')
      setProductForm(defaultProductForm)
      loadAllData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create product')
    } finally {
      setCreatingProduct(false)
    }
  }

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await api.put(`/products/${productId}`, { stock: Number(newStock) })
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Number(newStock) } : p)))
      toast.success('Stock updated')
    } catch {
      toast.error('Unable to update stock')
    }
  }

  const handleUpdatePrice = async (productId, newPrice) => {
    try {
      await api.put(`/products/${productId}`, { price: Number(newPrice) })
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, price: Number(newPrice) } : p)))
      toast.success('Price updated')
    } catch {
      toast.error('Unable to update price')
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast.success('Product removed')
    } catch {
      toast.error('Unable to remove product')
    }
  }

  const handleSaveSettings = async () => {
    try {
      toast.success('Settings saved')
    } catch {
      toast.error('Unable to save settings')
    }
  }

  const chartData = useMemo(() => {
    const last6 = orders.slice(-6).reverse()
    return last6.map((order) => ({
      label: order.id?.slice(0, 8) || 'Order',
      value: order.totalAmount || 0,
    }))
  }, [orders])

  const salesByStatus = useMemo(() => {
    const counts = {}
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1
    })
    return counts
  }, [orders])

  if (!isAdmin) {
    const quickCategories = ['All', 'Toothpaste', 'Electronics', 'Home & Kitchen']
    const brands = ['Any', 'Brand1', 'Brand2', 'Brand3']
    const priceRanges = ['Any', 'Under $25', '$25-$50', '$50-$100']
    const sortOptions = ['Best rating', 'Lowest price', 'Newest', 'Most popular']
    const [searchParams] = useSearchParams()

    const filteredProducts = useMemo(() => {
      let result = [...products]
      if (userSelectedCategory !== 'All') {
        result = result.filter((product) => product.category === userSelectedCategory)
      }
      if (userSelectedBrand !== 'Any') {
        result = result.filter((product) => product.brand === userSelectedBrand)
      }
      if (userSelectedPrice !== 'Any') {
        result = result.filter((product) => product.priceRange === userSelectedPrice)
      }
      if (userSearchTerm.trim()) {
        const query = userSearchTerm.toLowerCase()
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.shop || '').toLowerCase().includes(query),
        )
      }
      if (userInStock) {
        result = result.filter((product) => product.inStock)
      }
      if (userInStorePickup) {
        result = result.filter((product) => product.inStorePickup)
      }
      if (userSameDayDelivery) {
        result = result.filter((product) => product.sameDayDelivery)
      }
      switch (userSelectedSort) {
        case 'Lowest price':
          result.sort((a, b) => a.price - b.price)
          break
        case 'Newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'Most popular':
          result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
          break
        default:
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      }
      return result
    }, [products, userSearchTerm, userSelectedCategory, userSelectedBrand, userSelectedPrice, userSelectedSort, userInStock, userInStorePickup, userSameDayDelivery])

    const userPageCount = Math.max(1, Math.ceil(filteredProducts.length / userProductsPerPage))
    const userPagedProducts = useMemo(() => {
      const validPage = Math.min(Math.max(userCurrentPage, 1), userPageCount)
      const start = (validPage - 1) * userProductsPerPage
      return filteredProducts.slice(start, start + userProductsPerPage)
    }, [filteredProducts, userCurrentPage, userPageCount])

    const clearUserFilters = () => {
      setUserSelectedCategory('All')
      setUserSelectedBrand('Any')
      setUserSelectedPrice('Any')
      setUserSelectedSort('Best rating')
      setUserSearchTerm('')
      setUserInStock(false)
      setUserInStorePickup(false)
      setUserSameDayDelivery(false)
      setUserCurrentPage(1)
    }

    return (
      <div className="flex gap-6">
        <aside className="absolute left-0 top-0 w-72 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-primary-strong">Filters</h3>
            </div>

            <div className="mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium text-sm">Quick Category</h3>
              <div className="flex flex-wrap gap-1.5">
                {quickCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setUserSelectedCategory(category)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      userSelectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium text-sm">Brand</h3>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setUserSelectedBrand(brand)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      userSelectedBrand === brand ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'
                    }`}
                  >
                    {brand === 'Any' ? 'Any brand' : brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium text-sm">Price Range</h3>
              <div className="flex flex-wrap gap-1.5">
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setUserSelectedPrice(range)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      userSelectedPrice === range ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'
                    }`}
                  >
                    {range === 'Any' ? 'Any' : range}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium text-sm">Sort by</h3>
              <select
                value={userSelectedSort}
                onChange={(e) => setUserSelectedSort(e.target.value)}
                className="w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium text-sm">Availability</h3>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-between text-sm">
                  <span>In stock</span>
                  <input type="checkbox" checked={userInStock} onChange={(e) => setUserInStock(e.target.checked)} className="rounded" />
                </label>
                <label className="flex cursor-pointer items-center justify-between text-sm">
                  <span>In-store pickup</span>
                  <input type="checkbox" checked={userInStorePickup} onChange={(e) => setUserInStorePickup(e.target.checked)} className="rounded" />
                </label>
                <label className="flex cursor-pointer items-center justify-between text-sm">
                  <span>Same-day delivery</span>
                  <input type="checkbox" checked={userSameDayDelivery} onChange={(e) => setUserSameDayDelivery(e.target.checked)} className="rounded" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <button type="button" onClick={clearUserFilters} className="w-full rounded-lg border py-1.5 text-sm hover:bg-gray-50">
                Clear all
              </button>
              <button type="button" className="w-full rounded-lg bg-primary py-1.5 text-sm text-white hover:opacity-90">
                Show {filteredProducts.length} results
              </button>
            </div>
          </div>
        </aside>

        <main className="ml-80 flex-1 space-y-6 pb-10">
          <section>
            <span className="section-kicker">Products</span>
            <h1 className="mt-2 text-3xl font-bold text-primary-strong">Browse our catalog</h1>
            <p className="mt-2 text-lg text-slate-600">Find the best products at great prices.</p>
          </section>

          {loading ? (
            <p className="text-slate-500">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No products match the current filters.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-strong">All Products</h2>
                <span className="text-sm text-slate-500">{filteredProducts.length} items</span>
              </div>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {userPagedProducts.map((product) => (
                  <div key={product.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    {product.badge && (
                      <span className="mb-2 inline-block rounded-full bg-primary px-2 py-1 text-xs text-white">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-40 w-full rounded-lg object-cover mb-3"
                    />
                     <h3 className="mb-1 font-medium">{product.name}</h3>
                     <p className="mb-2 text-sm text-gray-600">{product.shop || 'SnapMart'}</p>
                     <div className="mb-3 flex items-center gap-2">
                       <div className="flex items-center">
                         <FiStar className="fill-current text-yellow-500" />
                         <span className="ml-1 text-sm">{product.rating ?? 0}</span>
                       </div>
                       <span className="text-xs text-gray-400">({(product.reviews ?? 0).toLocaleString()})</span>
                     </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Rs: {product.price}</span>
                      <button
                        type="button"
                        onClick={() => {
                          api.post('/cart', { productId: product.id, quantity: 1 }).then(() => {
                            toast.success('Added to cart')
                          }).catch(() => {
                            toast.error('Unable to add to cart')
                          })
                        }}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
                      >
                        <FiShoppingCart className="inline mr-1" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Page {userCurrentPage} of {userPageCount}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUserCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={userCurrentPage === 1}
                    className="rounded-lg border p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiChevronLeft />
                  </button>
                  {Array.from({ length: userPageCount }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setUserCurrentPage(page)}
                      className={`h-10 w-10 rounded-lg ${userCurrentPage === page ? 'bg-primary text-white' : 'border hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setUserCurrentPage((prev) => Math.min(prev + 1, userPageCount))}
                    disabled={userCurrentPage === userPageCount}
                    className="rounded-lg border p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex gap-6">
      <aside className="absolute left-0 top-0 w-52 flex-shrink-0 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        {adminSidebar.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSection(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                activeSection === item.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </aside>

      <main className="ml-60 flex-1 space-y-8 pb-12">
        {activeSection === 'dashboard' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="section-kicker">Admin dashboard</span>
                <h1 className="mt-2 text-3xl font-bold text-primary-strong sm:text-4xl">
                  Welcome back{user?.name ? `, ${user.name}` : ''}.
                </h1>
              </div>
              <button type="button" className="text-sm text-slate-600 hover:text-primary" onClick={loadAllData}>
                <FiRefreshCw className="inline mr-1" /> Refresh
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Products</p>
                <p className="mt-2 text-4xl font-bold text-primary-strong">{products.length}</p>
                <p className="mt-1 text-sm text-slate-500">Total catalog items</p>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Sales</p>
                <p className="mt-2 text-4xl font-bold text-primary-strong">{formatNumber(orders.length)}</p>
                <p className="mt-1 text-sm text-slate-500">All time orders</p>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Revenue</p>
                <p className="mt-2 text-4xl font-bold text-primary-strong">{formatCurrency(totalRevenue)}</p>
                <p className="mt-1 text-sm text-slate-500">Total sales value</p>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Customers</p>
                <p className="mt-2 text-4xl font-bold text-primary-strong">{formatNumber(users.length)}</p>
                <p className="mt-1 text-sm text-slate-500">Registered users</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary-strong mb-3">Sales Overview</h3>
                <SimpleBarChart data={chartData} width={600} height={220} />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-primary-strong mb-3">Orders by Status</h3>
                {Object.entries(salesByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize text-slate-600">{status}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (count / Math.max(orders.length, 1)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-primary-strong w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-slate-400">No orders yet.</p>}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-primary-strong mb-3">Inventory Value</h3>
              <p className="text-3xl font-bold text-primary">{formatCurrency(productTotalValue)}</p>
              <p className="text-sm text-slate-500 mt-1">Total value of all products in stock</p>
            </div>
          </section>
        )}

        {activeSection === 'users' && (
          <section className="space-y-4">
            <span className="section-kicker">Users</span>
            <h1 className="text-3xl font-bold text-primary-strong">User management</h1>
            {loading ? (
              <p className="text-slate-500">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="pb-3 font-semibold text-slate-500">User</th>
                      <th className="pb-3 font-semibold text-slate-500">Email</th>
                      <th className="pb-3 font-semibold text-slate-500">Role</th>
                      <th className="pb-3 font-semibold text-slate-500">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 font-medium text-primary-strong">{u.name || 'N/A'}</td>
                        <td className="py-3 text-slate-600">{u.email || 'N/A'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="py-8 text-center text-slate-400">No users found.</p>}
              </div>
            )}
          </section>
        )}

        {activeSection === 'products' && (
          <section className="space-y-5">
            <span className="section-kicker">Products</span>
            <h1 className="text-3xl font-bold text-primary-strong">Product catalog</h1>

            <div className="p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-primary-strong">Add new product</h2>
              <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleCreateProduct}>
                <input
                  className="input-field sm:col-span-2"
                  name="name"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <textarea
                  className="input-field sm:col-span-2 resize-y min-h-[100px]"
                  name="description"
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <input
                  className="input-field"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
                <input
                  className="input-field"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                />
                <input
                  className="input-field sm:col-span-2"
                  name="imageUrl"
                  placeholder="Image URL"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                />
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary" disabled={creatingProduct}>
                    {creatingProduct ? 'Creating...' : 'Create product'} <FiArrowRight className="inline ml-1" />
                  </button>
                </div>
              </form>
            </div>

            <div>
              {loading ? (
                <p className="text-slate-500">Loading products...</p>
              ) : products.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="pb-3 font-semibold text-slate-500">Product</th>
                        <th className="pb-3 font-semibold text-slate-500 w-32">Price</th>
                        <th className="pb-3 font-semibold text-slate-500 w-32">Stock</th>
                        <th className="pb-3 font-semibold text-slate-500 w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 font-medium text-primary-strong">{product.name}</td>
                          <td className="py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={product.price}
                              onChange={(e) => handleUpdatePrice(product.id, e.target.value)}
                              className="w-24 rounded border border-slate-300 px-2 py-1.5 text-sm"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={product.stock ?? 0}
                              onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                              className="w-24 rounded border border-slate-300 px-2 py-1.5 text-sm"
                            />
                          </td>
                          <td className="py-3">
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700 transition text-sm"
                            >
                              <FiTrash2 className="inline mr-1" /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-slate-400">No products yet. Add your first product above.</p>
              )}
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section className="space-y-6">
            <span className="section-kicker">Settings</span>
            <h1 className="text-3xl font-bold text-primary-strong">Admin settings</h1>

            <div className="p-6 border border-slate-200 space-y-5">
              <h2 className="text-xl font-bold text-primary-strong flex items-center gap-2">
                <FiLock className="h-5 w-5" /> Account Info
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Display Name</label>
                  <input
                    className="input-field w-full"
                    value={settingsForm.displayName}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <input
                    className="input-field w-full"
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border border-slate-200 space-y-5">
              <h2 className="text-xl font-bold text-primary-strong flex items-center gap-2">
                <FiShield className="h-5 w-5" /> Password
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
                  <input
                    className="input-field w-full"
                    type="password"
                    value={settingsForm.currentPassword}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                  <input
                    className="input-field w-full"
                    type="password"
                    value={settingsForm.newPassword}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
                  <input
                    className="input-field w-full"
                    type="password"
                    value={settingsForm.confirmPassword}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border border-slate-200 space-y-5">
              <h2 className="text-xl font-bold text-primary-strong">Visibility & Access</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Store Visibility</label>
                  <select
                    className="input-field w-full"
                    value={settingsForm.visibility}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, visibility: e.target.value }))}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Admin Access Level</label>
                  <select
                    className="input-field w-full"
                    value={settingsForm.visibility}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, visibility: e.target.value }))}
                  >
                    <option value="full">Full Access</option>
                    <option value="limited">Limited Access</option>
                    <option value="read-only">Read Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border border-slate-200 space-y-5">
              <h2 className="text-xl font-bold text-primary-strong">Dashboard Settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Auto-refresh interval</label>
                  <select
                    className="input-field w-full"
                    value={settingsForm.dashboardRefresh}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, dashboardRefresh: e.target.value }))}
                  >
                    <option value="0">Disabled</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Theme</label>
                  <select
                    className="input-field w-full"
                    value={settingsForm.theme}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, theme: e.target.value }))}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="btn-primary px-6 py-2.5 text-sm" onClick={handleSaveSettings}>
                <FiSave className="inline mr-1" /> Save Settings
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}