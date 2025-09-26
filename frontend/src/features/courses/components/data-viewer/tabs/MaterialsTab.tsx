import { api } from '../../../../../services/api'
import { TabContent } from '../../../../../components/course/TabContent'

interface MaterialsTabProps {
  courseId: string
}

export function MaterialsTab({ courseId }: MaterialsTabProps) {
  return (
    <TabContent
      courseId={courseId}
      fetchData={api.getCourseMaterials}
      tabName="Materiales"
      renderData={(data) => (
        <div>
          <h5>📄 Materiales del Curso</h5>
          <p>Contenido de Materiales - {data?.length || 0} elementos</p>
          {/* TODO: Implementar renderizado específico de materiales */}
        </div>
      )}
    />
  )
}
