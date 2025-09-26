import { useState, useEffect } from 'react'
import { User, UserRole } from '../types/auth'

// Mock user for development/testing
const createMockUser = (role: UserRole): User => ({
  id: `mock-user-${role}`,
  email: `${role}@classtrack.dev`,
  name: role === 'student' ? 'Ana García' : 
        role === 'teacher' ? 'Prof. Carlos López' : 
        'Coord. María Rodríguez',
  picture: `https://ui-avatars.com/api/?name=${role}&background=0ea5e9&color=fff`,
  role
})

export function useMockAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-login with student role in development
  useEffect(() => {
    if (import.meta.env.VITE_APP_ENV === 'development') {
      const savedRole = localStorage.getItem('mock-user-role') as UserRole || 'student'
      setUser(createMockUser(savedRole))
    }
  }, [])

  const login = () => {
    setLoading(true)
    setTimeout(() => {
      const defaultRole = 'student'
      setUser(createMockUser(defaultRole))
      localStorage.setItem('mock-user-role', defaultRole)
      setLoading(false)
    }, 1000) // Simulate loading
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mock-user-role')
    localStorage.clear()
    sessionStorage.clear()
    // Force page reload to clear all state
    window.location.href = '/'
  }

  const setRole = (role: UserRole) => {
    const mockUser = createMockUser(role)
    setUser(mockUser)
    localStorage.setItem('mock-user-role', role)
  }

  const checkPermission = (permission: string) => {
    // Mock permissions - always return true for development
    return true
  }

  return {
    user,
    loading,
    error: null,
    isAuthenticated: !!user,
    userRole: user?.role,
    login,
    logout,
    checkAuth: () => Promise.resolve(),
    setRole,
    checkPermission
  }
}
