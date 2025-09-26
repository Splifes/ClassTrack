import { api } from './api';

// --- Interfaces for Course Insights ---

export interface HeaderStats {
  student_average: number;
  class_average: number;
}

export interface TimelinePoint {
  date: string;
  score: number;
  title: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string | null;
  state: 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'MISSING';
  late: boolean;
  grade: number | null;
  maxPoints: number | null;
}

export interface CourseInsights {
  header_stats: HeaderStats;
  timeline: TimelinePoint[];
  assignments: Assignment[];
  suggestions: string[];
}

/**
 * Fetches detailed insights for a specific student in a course.
 * @param courseId The ID of the course.
 * @returns A promise that resolves to the course insights data.
 */
export const getCourseInsights = async (courseId: string): Promise<CourseInsights> => {
  try {
    // Use the new method from the api service instance
    const data = await api.getCourseInsights(courseId);
    return data as CourseInsights;
  } catch (error) {
    console.error(`Failed to fetch insights for course ${courseId}:`, error);
    throw error;
  }
};
