import api from './api'

export async function fetchAdminProducts() {
  const { data } = await api.get('/products')
  return data.products || []
}

export async function createAdminProduct(payload) {
  const { data } = await api.post('/products', payload)
  return data.product
}

export async function updateAdminProduct(productId, payload) {
  const { data } = await api.put(`/products/${productId}`, payload)
  return data.product
}

export async function fetchAdminOrders() {
  const { data } = await api.get('/orders')
  return {
    orders: data.orders || [],
    summary: data.summary || {
      totalOrders: 0,
      paidPayments: 0,
      failedPayments: 0,
      deliveredOrders: 0,
      activeDeliveries: 0,
    },
  }
}

export async function fetchAdminUsers() {
  const { data } = await api.get('/admin/users')
  return data.users || []
}

export async function fetchAdminStats() {
  const { data } = await api.get('/admin/stats')
  return data || {}
}

export async function getAdminSettings() {
  const { data } = await api.get('/admin/settings')
  return data.settings || null
}

export async function updateAdminSettings(payload) {
  const { data } = await api.put('/admin/settings', payload)
  return data.settings || null
}
