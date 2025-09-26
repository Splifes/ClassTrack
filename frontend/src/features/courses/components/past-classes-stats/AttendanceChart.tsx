import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui'
import { BarChart } from '../../../../shared/components/charts/BarChart'
import type { AttendanceChartProps } from '../../types/pastClassesStats'

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Asistencia (Últimas 8 Clases)</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart 
          data={data}
          title=""
          yAxisKey="value"
          color="#28a745"
          height={250}
        />
      </CardContent>
    </Card>
  )
}
