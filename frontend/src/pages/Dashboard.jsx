import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { createAdminProduct, fetchAdminOrders, fetchAdminProducts } from '../services/admin'

const adminActions = [
  { icon: FiPlusCircle, title: 'Add product', text: 'Create a new catalog item without leaving your dashboard.', href: '#add-product' },
  { icon: FiPackage, title: 'Product details', text: 'Review live catalog inventory, pricing, and stock levels.', href: '#products' },
  { icon: FiUsers, title: 'Manage user orders', text: 'Track recent orders and keep fulfillment moving.', href: '#orders' },
  { icon: FiCreditCard, title: 'Check payments', text: 'Monitor paid, unpaid, and failed transactions quickly.', href: '#payments' },
  { icon: FiTruck, title: 'Goods delivered', text: 'Review shipped and delivered goods at a glance.', href: '#deliveries' },
]

const userActions = [
  { icon: FiShoppingBag, title: 'Browse products', text: 'Jump back into the catalog and add items to cart.', href: '/products' },
  { icon: FiActivity, title: 'Check cart', text: 'Review your shopping list and move to checkout.', href: '/cart' },
]

const defaultProductForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
}

const emptyOrderSummary = {
  totalOrders: 0,
  paidPayments: 0,
  failedPayments: 0,
  deliveredOrders: 0,
  activeDeliveries: 0,
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatDate = (value) => {
  if (!value) {
    return 'No date available'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  failed: 'bg-rose-100 text-rose-700',
  paid: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-slate-200 text-slate-700',
}

const getStatusClassName = (status) => statusClasses[status] || 'bg-slate-100 text-slate-700'

const StatCard = ({ title, value, helper, icon: Icon }) => (
  <article className="card-soft p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-bold text-primary-strong">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{helper}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
        <Icon />
      </div>
    </div>
  </article>
)

export default function Dashboard() {
  const { user, isAdmin } = useAuth()

  const [productForm, setProductForm] = useState(defaultProductForm)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [orderSummary, setOrderSummary] = useState(emptyOrderSummary)
  const [loadingAdminData, setLoadingAdminData] = useState(true)
  const [refreshingAdminData, setRefreshingAdminData] = useState(false)
  const [creatingProduct, setCreatingProduct] = useState(false)

  const loadAdminData = useCallback(async ({ silent = false } = {}) => {
    if (!isAdmin) {
      return
    }

    if (silent) {
      setRefreshingAdminData(true)
    } else {
      setLoadingAdminData(true)
    }

    try {
      const [nextProducts, orderResponse] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminOrders(),
      ])

      setProducts(nextProducts)
      setOrders(orderResponse.orders)
      setOrderSummary(orderResponse.summary)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load admin dashboard data')
    } finally {
      setLoadingAdminData(false)
      setRefreshingAdminData(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

  const adminStats = useMemo(
    () => [
      {
        title: 'Product catalog',
        value: products.length,
        helper: 'Live products currently visible in your store.',
        icon: FiPackage,
      },
      {
        title: 'User orders',
        value: orderSummary.totalOrders,
        helper: 'Recent orders now visible from the admin route.',
        icon: FiUsers,
      },
      {
        title: 'Paid payments',
        value: orderSummary.paidPayments,
        helper: 'Transactions marked as paid.',
        icon: FiCreditCard,
      },
      {
        title: 'Goods delivered',
        value: orderSummary.deliveredOrders,
        helper: 'Orders already delivered successfully.',
        icon: FiTruck,
      },
    ],
    [orderSummary, products.length],
  )

  const deliveryStats = useMemo(
    () => [
      {
        title: 'Processing',
        value: orders.filter((order) => order.status === 'processing').length,
      },
      {
        title: 'Shipped',
        value: orders.filter((order) => order.status === 'shipped').length,
      },
      {
        title: 'Delivered',
        value: orders.filter((order) => order.status === 'delivered').length,
      },
    ],
    [orders],
  )

  const handleProductFieldChange = (event) => {
    const { name, value } = event.target
    setProductForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

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

      toast.success('Product created successfully')
      setProductForm(defaultProductForm)
      loadAdminData({ silent: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create product')
    } finally {
      setCreatingProduct(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card p-6 sm:p-8">
          <span className="section-kicker">Your dashboard</span>
          <h1 className="mt-4 text-3xl font-bold text-primary-strong sm:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ''}.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            This area gives you a quick way back into shopping, checkout, and account activity.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Email</p>
              <p className="mt-1 font-semibold text-primary-strong">{user?.email || 'Not available'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Role</p>
              <p className="mt-1 font-semibold uppercase tracking-wide text-primary-strong">{user?.role || 'user'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">
              Continue shopping <FiArrowRight />
            </Link>
            <Link to="/" className="btn-secondary">
              Back to home
            </Link>
          </div>
        </section>

        <aside className="space-y-4">
          {userActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.href}
                className="card-soft block p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-strong">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.text}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </aside>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <span className="section-kicker">Admin dashboard</span>
            <h1 className="mt-4 text-3xl font-bold text-primary-strong sm:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ''}.
            </h1>
            <p className="mt-3 text-slate-600">
              This is your private SnapMart control center for add product, product details, manage user orders,
              payment checks, and delivered goods tracking.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={() => loadAdminData({ silent: true })} disabled={refreshingAdminData}>
              {refreshingAdminData ? 'Refreshing...' : 'Refresh data'} <FiRefreshCw />
            </button>
            <Link to="/products" className="btn-primary">
              Open storefront <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.68fr_0.32fr]">
        <div className="space-y-6">
          <section id="add-product" className="card p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="section-kicker">Add product</span>
                <h2 className="mt-4 text-2xl font-bold text-primary-strong">Create a new catalog item</h2>
                <p className="mt-3 text-slate-600">
                  Add products directly from your dashboard and publish them into the live catalog.
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white">
                <FiPlusCircle />
              </div>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreateProduct}>
              <input
                className="input-field md:col-span-2"
                name="name"
                placeholder="Product name"
                value={productForm.name}
                onChange={handleProductFieldChange}
                required
              />
              <textarea
                className="input-field md:col-span-2 min-h-[132px] resize-y"
                name="description"
                placeholder="Description"
                value={productForm.description}
                onChange={handleProductFieldChange}
              />
              <input
                className="input-field"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={handleProductFieldChange}
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
                onChange={handleProductFieldChange}
              />
              <input
                className="input-field md:col-span-2"
                name="imageUrl"
                placeholder="Image URL"
                value={productForm.imageUrl}
                onChange={handleProductFieldChange}
              />
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-primary" disabled={creatingProduct}>
                  {creatingProduct ? 'Creating product...' : 'Create product'} <FiArrowRight />
                </button>
                <p className="text-sm text-slate-500">Admin-only action protected by your account role.</p>
              </div>
            </form>
          </section>

          <section id="products" className="card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="section-kicker">Product details</span>
                <h2 className="mt-4 text-2xl font-bold text-primary-strong">Live product overview</h2>
              </div>
              <p className="text-sm text-slate-500">{products.length} items</p>
            </div>

            {loadingAdminData ? (
              <p className="mt-6 text-slate-500">Loading catalog data...</p>
            ) : products.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {products.slice(0, 6).map((product) => (
                  <article key={product.id} className="card-soft p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-strong">{product.name}</h3>
                        <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                          {product.description || 'No description added yet.'}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        Stock {product.stock ?? 0}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500">
                      <span>{formatCurrency(product.price)}</span>
                      <span>{product.slug || 'Slug pending'}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-500">No products found yet. Add your first product from the form above.</p>
            )}
          </section>

          <section id="orders" className="card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="section-kicker">Manage user orders</span>
                <h2 className="mt-4 text-2xl font-bold text-primary-strong">Recent customer orders</h2>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {orderSummary.totalOrders} total
              </span>
            </div>

            {loadingAdminData ? (
              <p className="mt-6 text-slate-500">Loading order activity...</p>
            ) : orders.length ? (
              <div className="mt-6 space-y-4">
                {orders.slice(0, 6).map((order) => (
                  <article key={order.id} className="card-soft p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-strong">{order.customerName}</h3>
                        <p className="mt-1 text-sm text-slate-500">{order.customerEmail}</p>
                        <p className="mt-2 text-sm text-slate-500">Order ID: {order.id}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClassName(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClassName(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Items</p>
                        <p className="mt-1 font-semibold text-primary-strong">{order.itemCount}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
                        <p className="mt-1 font-semibold text-primary-strong">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Placed</p>
                        <p className="mt-1 font-semibold text-primary-strong">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-500">No orders found yet. New customer checkouts will appear here.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-white">
                <FiShield />
              </div>
              <div>
                <p className="section-kicker">Private area</p>
                <h2 className="mt-2 text-2xl font-bold text-primary-strong">Admin access enabled</h2>
              </div>
            </div>
            <p className="mt-4 text-slate-600">
              Use these shortcuts to jump between the core admin actions you asked for.
            </p>

            <div className="mt-5 space-y-3">
              {adminActions.map((action) => {
                const Icon = action.icon
                return (
                  <a key={action.title} href={action.href} className="card-soft block p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-primary-strong">{action.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{action.text}</p>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>

          <section id="payments" className="card p-6">
            <span className="section-kicker">Check payments</span>
            <h2 className="mt-4 text-2xl font-bold text-primary-strong">Payment snapshot</h2>
            <div className="mt-5 space-y-3">
              <div className="card-soft p-4">
                <p className="text-sm font-semibold text-slate-500">Paid payments</p>
                <p className="mt-2 text-3xl font-bold text-primary-strong">{orderSummary.paidPayments}</p>
              </div>
              <div className="card-soft p-4">
                <p className="text-sm font-semibold text-slate-500">Failed payments</p>
                <p className="mt-2 text-3xl font-bold text-primary-strong">{orderSummary.failedPayments}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                Payments are summarized from the live order records exposed by the admin orders endpoint.
              </div>
            </div>
          </section>

          <section id="deliveries" className="card p-6">
            <span className="section-kicker">Goods delivered</span>
            <h2 className="mt-4 text-2xl font-bold text-primary-strong">Delivery flow</h2>
            <div className="mt-5 grid gap-3">
              {deliveryStats.map((stat) => (
                <div key={stat.title} className="card-soft flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                    <p className="mt-1 text-2xl font-bold text-primary-strong">{stat.value}</p>
                  </div>
                  <FiCheckCircle className="text-xl text-emerald-600" />
                </div>
              ))}
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                Active deliveries in motion: {orderSummary.activeDeliveries}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
