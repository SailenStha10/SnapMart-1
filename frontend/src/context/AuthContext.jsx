import { createContext, useContext, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const setSession = (userData, tokenData) => {
    setUser(userData || null)
    setToken(tokenData || null)

    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }

    if (tokenData) {
      localStorage.setItem('token', tokenData)
    } else {
      localStorage.removeItem('token')
    }
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    setSession(data.user, data.token)
    return data
  }

  const signIn = async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    setSession(data.user, data.token)
    return data
  }

  const logout = () => {
    setSession(null, null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      setSession,
      login: setSession,
      register,
      signIn,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
