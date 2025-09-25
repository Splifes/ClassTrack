export type UserRole = 'student' | 'teacher' | 'coordinator'

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  role: UserRole
  // Additional properties based on role
  permissions?: string[]
  courses?: string[] // Course IDs the user has access to
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface RolePermissions {
  canViewAllStudents: boolean
  canViewAllCourses: boolean
  canExportData: boolean
  canManageAttendance: boolean
  canViewReports: boolean
  canReceiveNotifications: boolean
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  student: {
    canViewAllStudents: false,
    canViewAllCourses: false,
    canExportData: false,
    canManageAttendance: false,
    canViewReports: false,
    canReceiveNotifications: true,
  },
  teacher: {
    canViewAllStudents: false, // Only students in their courses
    canViewAllCourses: false, // Only their courses
    canExportData: true, // Only their course data
    canManageAttendance: true,
    canViewReports: true, // Only their course reports
    canReceiveNotifications: true,
  },
  coordinator: {
    canViewAllStudents: true,
    canViewAllCourses: true,
    canExportData: true,
    canManageAttendance: true,
    canViewReports: true,
    canReceiveNotifications: true,
  },
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

export function getUserRoleFromEmail(email: string): UserRole {
  // Simple heuristic - in real app this would come from backend/database
  if (email.includes('coordinator') || email.includes('admin')) {
    return 'coordinator'
  }
  if (email.includes('teacher') || email.includes('profesor')) {
    return 'teacher'
  }
  return 'student'
}
