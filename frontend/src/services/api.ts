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
  courseName?: string
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

export interface CourseMaterial {
  id: string;
  title: string;
  description?: string;
  state: string;
  creationTime: string;
  updateTime: string;
  alternateLink: string;
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
    return this.request<User>('/api/users/me')
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' })
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    const response = await this.request<{ courses: Course[] }>('/api/courses/')
    return response.courses
  }

  async getAllCourses(): Promise<Course[]> {
    const response = await this.request<{ courses: Course[] }>('/api/courses/all');
    return response.courses;
  }

  async getTeachingCourses(): Promise<Course[]> {
    const response = await this.request<{ courses: Course[] }>('/api/courses/teaching');
    return response.courses;
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

  // Historical data for timeline and stats
  async getCourseAnnouncements(courseId: string): Promise<any[]> {
    const response = await this.request<{ announcements: any[] }>(`/api/courses/${courseId}/announcements`)
    return response.announcements
  }

  async getCourseTimeline(courseId: string, days: number = 30): Promise<any[]> {
    const response = await this.request<{ timeline: any[] }>(`/api/courses/${courseId}/timeline?days=${days}`)
    return response.timeline
  }

  // Complete course data with analytics
  async getCompleteCoursData(courseId: string): Promise<any> {
    return this.request<any>(`/api/courses/${courseId}/complete-data`)
  }

  // Student-specific view of course data
  async getStudentViewData(courseId: string): Promise<any> {
    return this.request<any>(`/api/courses/${courseId}/student-view`)
  }

  // Check permissions for a course
  async getCoursePermissions(courseId: string): Promise<any> {
    return this.request<any>(`/api/courses/${courseId}/permissions`)
  }

  async getCourseInsights(courseId: string): Promise<any> {
    return this.request<any>(`/api/courses/${courseId}/insights`);
  }

  // New granular data fetching
    async getCourseMaterials(courseId: string): Promise<CourseMaterial[]> {
    const response = await this.request<{ materials: CourseMaterial[] }>(`/api/courses/${courseId}/materials`);
    return response.materials || [];
  }

  async getCourseTopics(courseId: string): Promise<any> {
    return this.request<any>(`/api/courses/${courseId}/topics`)
  }

  async getStreamTimeline(): Promise<any> {
    return this.request<any>('/api/courses/stream-timeline')
  }

  // WhatsApp Verification
  async sendWhatsAppVerification(phoneNumber: string): Promise<any> {
    return this.request<any>('/api/notifications/whatsapp/send-verification', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  async verifyWhatsAppCode(code: string): Promise<any> {
    return this.request<any>('/api/notifications/whatsapp/verify-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Dashboards
  async getStudentDashboardData(): Promise<any> {
    return this.request<any>('/api/dashboards/student');
  }

  async getStudentDashboardComplete(): Promise<any> {
    return this.request<any>('/api/dashboards/student-complete');
  }

  async getCoordinatorAnalytics(): Promise<any> {
    return this.request<any>('/api/courses/coordinator/analytics');
  }

  async getTeacherDashboardComplete(): Promise<any> {
    return this.request<any>('/api/dashboards/teacher-complete');
  }
  async getTeacherDashboardDebug(): Promise<any> {
    return this.request<any>('/api/dashboards/teacher-debug');
  }

  async getTeacherDashboard(): Promise<any> {
    return this.request<any>('/api/dashboards/teacher-complete');
  }
}

export const api = new ApiService()
