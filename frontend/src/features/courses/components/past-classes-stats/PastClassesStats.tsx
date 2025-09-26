import { usePastClassesData } from '../../hooks/usePastClassesData'
import { StatsSummary } from './StatsSummary'
import { AttendanceChart } from './AttendanceChart'
import { ClassesHistoryTable } from './ClassesHistoryTable'

interface PastClassesStatsProps {
  courseId: string
  maxClasses?: number
}

export function PastClassesStats({ courseId, maxClasses = 10 }: PastClassesStatsProps) {
  const { pastClasses, stats, attendanceChartData } = usePastClassesData(courseId, maxClasses)

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <StatsSummary stats={stats} />
      </div>
      
      <div className="col-md-8 mb-4">
        <AttendanceChart data={attendanceChartData} />
      </div>
      
      <div className="col-12">
        <ClassesHistoryTable classes={pastClasses} />
      </div>
    </div>
  )
}
