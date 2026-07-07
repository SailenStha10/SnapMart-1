import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext()

const readStoredUser = () => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  const setSession = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      setSession,
      login: setSession,
      logout,
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
