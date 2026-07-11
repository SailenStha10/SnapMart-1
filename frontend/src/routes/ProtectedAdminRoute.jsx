import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { user, token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}
