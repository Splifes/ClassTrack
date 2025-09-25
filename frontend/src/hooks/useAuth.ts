import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { User, UserRole, hasPermission, getUserRoleFromEmail } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await api.getCurrentUser()
      
      // Add role detection if not provided by backend
      const userWithRole: User = {
        ...userData,
        role: userData.role || getUserRoleFromEmail(userData.email)
      }
      
      setUser(userWithRole)
    } catch (err: any) {
      setError(err.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      setUser(null)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const login = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
  }

  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role })
    }
  }

  const checkPermission = (permission: string) => {
    if (!user) return false
    return hasPermission(user.role, permission as any)
  }

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    userRole: user?.role,
    login,
    logout,
    checkAuth,
    setRole,
    checkPermission
  }
}
