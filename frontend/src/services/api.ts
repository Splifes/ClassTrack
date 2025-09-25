const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  role?: string // Will be typed as UserRole in auth types
}

export interface Course {
  id: string
  name: string
  section?: string
  description?: string
  courseState: string
  creationTime: string
  updateTime: string
  ownerId: string
  room?: string
}

export interface Student {
  courseId: string
  userId: string
  profile: {
    id: string
    name: {
      fullName: string
      givenName: string
      familyName: string
    }
    emailAddress: string
    photoUrl?: string
  }
}

export interface Teacher {
  courseId: string
  userId: string
  profile: {
    id: string
    name: {
      fullName: string
      givenName: string
      familyName: string
    }
    emailAddress: string
    photoUrl?: string
  }
}

export interface CourseWork {
  id: string
  title: string
  description?: string
  state: string
  creationTime: string
  updateTime: string
  dueDate?: {
    year: number
    month: number
    day: number
  }
  dueTime?: {
    hours: number
    minutes: number
  }
}

export interface Submission {
  id: string
  userId: string
  courseId: string
  courseWorkId: string
  state: string
  creationTime: string
  updateTime: string
  late: boolean
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/auth/me')
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' })
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    const response = await this.request<{ courses: Course[] }>('/api/courses')
    return response.courses
  }

  async getCourse(courseId: string): Promise<Course> {
    return this.request<Course>(`/api/courses/${courseId}`)
  }

  async getCourseStudents(courseId: string): Promise<Student[]> {
    const response = await this.request<{ students: Student[] }>(`/api/courses/${courseId}/students`)
    return response.students
  }

  async getCourseTeachers(courseId: string): Promise<Teacher[]> {
    const response = await this.request<{ teachers: Teacher[] }>(`/api/courses/${courseId}/teachers`)
    return response.teachers
  }

  async getCoursework(courseId: string): Promise<CourseWork[]> {
    const response = await this.request<{ coursework: CourseWork[] }>(`/api/courses/${courseId}/coursework`)
    return response.coursework
  }

  async getSubmissions(courseId: string, courseworkId: string): Promise<Submission[]> {
    const response = await this.request<{ submissions: Submission[] }>(`/api/courses/${courseId}/coursework/${courseworkId}/submissions`)
    return response.submissions
  }

  // Students
  async getAllStudents(): Promise<Student[]> {
    const response = await this.request<{ students: Student[] }>('/api/students')
    return response.students
  }
}

export const api = new ApiService()
