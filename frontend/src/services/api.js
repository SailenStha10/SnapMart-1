import axios from 'axios'
scrum34

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',


const AUTH_ENDPOINTS = ['/auth/login', '/auth/register']

const resolveBaseURL = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  return envBaseUrl || '/api'
}

const api = axios.create({
  baseURL: resolveBaseURL(),
 main
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url || ''
    const isAuthRequest = AUTH_ENDPOINTS.some((endpoint) => requestUrl.includes(endpoint))
    const hasStoredSession = Boolean(localStorage.getItem('token'))

    if (status === 401 && hasStoredSession && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
