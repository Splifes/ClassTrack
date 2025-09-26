import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types/auth'

interface RoleGuardProps {
  children: ReactNode
  allowed: UserRole[]
  fallback?: string
}

export function RoleGuard({ children, allowed, fallback = '/' }: RoleGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // TEMPORAL: Hardcodeado para permitir acceso durante desarrollo
  // TODO: Restaurar verificación de roles en producción
  /*
  if (!allowed.includes(user.role)) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          <p>Required roles: {allowed.join(', ')}</p>
          <p>Your role: {user.role}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.href = fallback}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  */

  // Mostrar advertencia visual de que el acceso está hardcodeado
  if (!allowed.includes(user.role)) {
    console.warn(`[DEV] Acceso hardcodeado: Usuario con rol '${user.role}' accediendo a página que requiere: ${allowed.join(', ')}`);
  }

  return <>{children}</>
}
