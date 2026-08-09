import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiSettings,
  FiUsers,
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { createAdminProduct, fetchAdminOrders, fetchAdminProducts, fetchAdminUsers, fetchAdminStats, getAdminSettings, updateAdminSettings } from '../services/admin'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { key: 'users', label: 'Users', icon: FiUsers },
  { key: 'products', label: 'Products', icon: FiPackage },
  { key: 'settings', label: 'Settings', icon: FiSettings },
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

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [settings, setSettings] = useState(null)
  const [loadingAdminData, setLoadingAdminData] = useState(true)
  const [creatingProduct, setCreatingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(defaultProductForm)

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return
    try {
      const [nextProducts, orderResponse] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminOrders(),
      ])
      const [nextUsers, nextStats, nextSettings] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminStats(),
        getAdminSettings(),
      ])
      setProducts(nextProducts || [])
      setOrders(orderResponse?.orders || [])
      setUsers(nextUsers || [])
      setStats(nextStats || {})
      setSettings(nextSettings || null)
    } catch {
      toast.error('Unable to load admin data')
    } finally {
      setLoadingAdminData(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

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
      loadAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create product')
    } finally {
      setCreatingProduct(false)
    }
  }

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await api.put(`/products/${productId}`, { stock: Number(newStock) })
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: Number(newStock) } : p)),
      )
      toast.success('Stock updated')
    } catch {
      toast.error('Unable to update stock')
    }
  }

  const handleUpdatePrice = async (productId, newPrice) => {
    try {
      await api.put(`/products/${productId}`, { price: Number(newPrice) })
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: Number(newPrice) } : p)),
      )
      toast.success('Price updated')
    } catch {
      toast.error('Unable to update price')
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast.success('Product removed')
    } catch {
      toast.error('Unable to remove product')
    }
  }

  const handleSaveSettings = async (payload) => {
    try {
      const updated = await updateAdminSettings(payload)
      setSettings(updated)
      toast.success('Settings updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to update settings')
    }
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <section>
          <span className="section-kicker">Your dashboard</span>
          <h1 className="mt-4 text-3xl font-bold text-primary-strong">
            Welcome back{user?.name ? `, ${user.name}` : ''}.
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">
              Continue shopping <FiArrowRight />
            </Link>
            <Link to="/" className="btn-secondary">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const orderSummary = {
    totalOrders: orders.length,
    paidPayments: 0,
    failedPayments: 0,
    deliveredOrders: 0,
    activeDeliveries: 0,
  }

  // build chart datasets
  const getLastNDays = (n = 7) => {
    const arr = []
    for (let i = n - 1; i >= 0; i -= 1) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      arr.push(d)
    }
    return arr
  }

  const salesData = React.useMemo(() => {
    const days = getLastNDays(7).map((d) => ({ date: d.toISOString().slice(0, 10), revenue: 0, orders: 0 }))
    const map = Object.fromEntries(days.map((d) => [d.date, d]))
    orders.forEach((o) => {
      const key = new Date(o.createdAt || o.created_at || o.created_at || o.created_at).toISOString().slice(0, 10)
      if (!map[key]) return
      map[key].revenue += Number(o.total || o.total_amount || 0)
      map[key].orders += 1
    })
    return Object.values(map)
  }, [orders])

  const productStockData = React.useMemo(() => {
    const inStock = products.filter((p) => (p.stock ?? 0) > 0).length
    const outStock = products.length - inStock
    return [
      { name: 'In stock', value: inStock },
      { name: 'Out of stock', value: outStock },
    ]
  }, [products])

  const usersByRole = React.useMemo(() => {
    const adminCount = users.filter((u) => u.role === 'admin').length
    const userCount = users.length - adminCount
    return [
      { name: 'Users', value: userCount },
      { name: 'Admins', value: adminCount },
    ]
  }, [users])

  return (
    <div className="flex gap-6">
      <aside className="w-52 flex-shrink-0 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSection(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                activeSection === item.key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </aside>

      <main className="flex-1 space-y-4">
        {activeSection === 'dashboard' && (
          <section>
            <div className="flex items-center justify-between">
              <div>
                <span className="section-kicker">Admin dashboard</span>
                <h1 className="mt-2 text-2xl font-bold text-primary-strong">
                  Welcome back{user?.name ? `, ${user.name}` : ''}.
                </h1>
              </div>
              <button type="button" className="text-sm text-slate-600 hover:text-primary" onClick={loadAdminData}>
                <FiRefreshCw className="inline mr-1" /> Refresh
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-500">Users</p>
                <p className="mt-1 text-2xl font-bold text-primary-strong">{stats.usersCount ?? users.length}</p>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-500">Products</p>
                <p className="mt-1 text-2xl font-bold text-primary-strong">{stats.productsCount ?? products.length}</p>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-500">Orders</p>
                <p className="mt-1 text-2xl font-bold text-primary-strong">{stats.ordersCount ?? orderSummary.totalOrders}</p>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-500">Revenue</p>
                <p className="mt-1 text-2xl font-bold text-primary-strong">{formatCurrency(stats.totalSales ?? 0)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="p-4 bg-white border rounded">
                <h3 className="text-sm font-medium text-slate-600">Revenue (last 7 days)</h3>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-white border rounded">
                <h3 className="text-sm font-medium text-slate-600">Orders (last 7 days)</h3>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#34D399" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-white border rounded">
                <h3 className="text-sm font-medium text-slate-600">Product stock</h3>
                <div className="mt-3 h-40 flex items-center justify-center">
                  <ResponsiveContainer width="80%" height="80%">
                    <PieChart>
                      <Pie data={productStockData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={60}>
                        {productStockData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#F97316'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-white border rounded">
                <h3 className="text-sm font-medium text-slate-600">Users</h3>
                <div className="mt-3 h-40 flex items-center justify-center">
                  <ResponsiveContainer width="80%" height="80%">
                    <PieChart>
                      <Pie data={usersByRole} dataKey="value" nameKey="name" innerRadius={30} outerRadius={60}>
                        {usersByRole.map((entry, index) => (
                          <Cell key={`cell2-${index}`} fill={index === 0 ? '#6366F1' : '#F43F5E'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'users' && (
          <section>
            <span className="section-kicker">Users</span>
            <h1 className="mt-2 text-2xl font-bold text-primary-strong">User management</h1>
            <p className="mt-3 text-slate-600">List of registered users.</p>

            <div className="mt-4">
              {loadingAdminData ? (
                <p className="text-slate-500">Loading users...</p>
              ) : users.length ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-2 font-medium text-slate-500">Name</th>
                      <th className="pb-2 font-medium text-slate-500">Email</th>
                      <th className="pb-2 font-medium text-slate-500">Role</th>
                      <th className="pb-2 font-medium text-slate-500">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100">
                        <td className="py-2 font-medium text-primary-strong">{u.name || '-'}</td>
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">{u.role || 'user'}</td>
                        <td className="py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-500">No users found.</p>
              )}
            </div>
          </section>
        )}

        {activeSection === 'products' && (
          <section>
            <span className="section-kicker">Products</span>
            <h1 className="mt-2 text-2xl font-bold text-primary-strong">Product catalog</h1>

            <div className="mt-4 p-3 border border-slate-200">
              <h2 className="text-lg font-semibold">Add product</h2>
              <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={handleCreateProduct}>
                <input
                  className="input-field sm:col-span-2"
                  name="name"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <textarea
                  className="input-field sm:col-span-2 resize-y min-h-[80px]"
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
                    {creatingProduct ? 'Creating...' : 'Create product'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4">
              {loadingAdminData ? (
                <p className="text-slate-500">Loading products...</p>
              ) : products.length ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-2 font-medium text-slate-500">Product</th>
                      <th className="pb-2 font-medium text-slate-500">Price</th>
                      <th className="pb-2 font-medium text-slate-500">Stock</th>
                      <th className="pb-2 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100">
                        <td className="py-2 font-medium text-primary-strong">{product.name}</td>
                        <td className="py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={product.price}
                            onChange={(e) => handleUpdatePrice(product.id, e.target.value)}
                            className="w-20 rounded border px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={product.stock ?? 0}
                            onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                            className="w-20 rounded border px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-500">No products yet.</p>
              )}
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section>
            <span className="section-kicker">Settings</span>
            <h1 className="mt-2 text-2xl font-bold text-primary-strong">Settings</h1>
            <p className="mt-3 text-slate-600">Update store settings and admin password.</p>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div className="card-soft p-4">
                <h2 className="font-semibold">Store settings</h2>
                <div className="mt-3 grid gap-3">
                  <label className="text-sm text-slate-600">Store name</label>
                  <input className="input-field" placeholder="Store name" value={settings?.storeName || ''} onChange={(e)=>setSettings((s)=>({...(s||{}),storeName:e.target.value}))} />

                  <label className="text-sm text-slate-600">Theme</label>
                  <select className="input-field w-48" value={settings?.theme || 'light'} onChange={(e)=>setSettings((s)=>({...(s||{}),theme:e.target.value}))}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>

                  <label className="text-sm text-slate-600">Visibility</label>
                  <select className="input-field w-48" value={settings?.visibility || 'public'} onChange={(e)=>setSettings((s)=>({...(s||{}),visibility:e.target.value}))}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>

                  <label className="text-sm text-slate-600">Admin access level</label>
                  <select className="input-field w-48" value={settings?.adminAccessLevel || 'full'} onChange={(e)=>setSettings((s)=>({...(s||{}),adminAccessLevel:e.target.value}))}>
                    <option value="full">Full</option>
                    <option value="limited">Limited</option>
                  </select>

                  <label className="text-sm text-slate-600">Auto refresh interval (seconds)</label>
                  <input className="input-field w-48" type="number" min="5" value={settings?.autoRefreshInterval ?? 30} onChange={(e)=>setSettings((s)=>({...(s||{}),autoRefreshInterval: Number(e.target.value)}))} />

                  <div>
                    <button className="btn-primary" onClick={()=>handleSaveSettings({storeName: settings?.storeName, theme: settings?.theme, visibility: settings?.visibility, adminAccessLevel: settings?.adminAccessLevel, autoRefreshInterval: settings?.autoRefreshInterval})}>Save settings</button>
                  </div>
                </div>
              </div>

              <div className="card-soft p-4">
                <h2 className="font-semibold">Change admin password</h2>
                <form className="mt-3 grid gap-3" onSubmit={async (e)=>{
                  e.preventDefault()
                  const fd = new FormData(e.target)
                  const payload = {
                    currentPassword: fd.get('currentPassword'),
                    newPassword: fd.get('newPassword'),
                    confirmNewPassword: fd.get('confirmNewPassword')
                  }
                  try {
                    await api.put('/user/change-password', payload)
                    toast.success('Password updated')
                    e.target.reset()
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Unable to update password')
                  }
                }}>
                  <input name="currentPassword" type="password" className="input-field" placeholder="Current password" required />
                  <input name="newPassword" type="password" className="input-field" placeholder="New password" required />
                  <input name="confirmNewPassword" type="password" className="input-field" placeholder="Confirm new password" required />
                  <div>
                    <button className="btn-primary" type="submit">Change password</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}