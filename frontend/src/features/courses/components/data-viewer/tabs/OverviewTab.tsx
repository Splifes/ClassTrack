import { Card, CardContent, CardHeader, CardTitle } from '../../../../../shared/components/ui'

interface OverviewTabProps {
  courseId: string
}

export function OverviewTab({ courseId }: OverviewTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Resumen del Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Selecciona una pestaña para ver los detalles del curso.</p>
        <div className="mt-3">
          <small className="text-muted">Course ID: {courseId}</small>
        </div>
      </CardContent>
    </Card>
  )
}
