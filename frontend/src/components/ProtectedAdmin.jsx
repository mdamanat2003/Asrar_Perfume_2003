import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  let user = null
  try { user = userStr ? JSON.parse(userStr) : null } catch (e) { user = null }

  if (!token || !user || !user.isAdmin) {
    return <Navigate to="/admin-login" replace />
  }
  return children
}
