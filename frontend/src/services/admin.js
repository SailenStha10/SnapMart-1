import api from './api'

export async function fetchAdminProducts() {
  const { data } = await api.get('/products')
  return data.products || []
}

export async function createAdminProduct(payload) {
  const { data } = await api.post('/products', payload)
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
