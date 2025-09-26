export interface ClassSession {
  id: string;
  date: string;
  topic: string;
  attendance: number;
  totalStudents: number;
  materials: number;
  assignments: number;
  averageEngagement: number;
}

export interface ClassStats {
  totalClasses: number;
  avgAttendance: number;
  attendanceRate: number;
  totalMaterials: number;
  totalAssignments: number;
  avgEngagement: number;
}

export interface AttendanceChartData {
  name: string;
  value: number;
  percentage: number;
}

export interface StatsSummaryProps {
  stats: ClassStats;
}

export interface AttendanceChartProps {
  data: AttendanceChartData[];
}

export interface ClassesHistoryTableProps {
  classes: ClassSession[];
}
