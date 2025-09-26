export interface StudentAnalytics {
  overview?: {
    total_assignments?: number;
    completed_assignments?: number;
    pending_assignments?: number;
    graded_assignments?: number;
    completion_rate?: number;
  };
  performance?: {
    overall_percentage?: number;
    average_grade?: number;
    total_points_earned?: number;
    total_points_possible?: number;
    highest_grade?: number;
    lowest_grade?: number;
    late_submissions?: number;
  };
  engagement?: {
    participation_rate?: number;
    punctuality_rate?: number;
  };
}

export interface ChartData {
  assignmentStatus: { name: string; value: number; color: string }[];
  myGradeDistribution: { name: string; value: number }[];
}

export interface StudentData {
  student_analytics?: StudentAnalytics;
  my_grades?: any[];
  my_coursework?: any[];
  my_submissions?: any[];
  classmates?: any[];
  coursework_limitation?: {
    message: string;
    explanation: string;
    available_alternatives: string[];
    why_limited: string;
  };
}

export interface StudentOverviewProps {
  analytics: StudentAnalytics;
  chartData: ChartData | null;
}

export interface StudentAssignmentsProps {
  studentData: StudentData;
}

export interface StudentGradesProps {
  studentData: StudentData;
  chartData: ChartData | null;
  analytics: StudentAnalytics;
}

export interface StudentClassmatesProps {
  studentData: StudentData;
}
