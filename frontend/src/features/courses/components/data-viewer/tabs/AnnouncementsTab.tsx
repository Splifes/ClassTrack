import { api } from '../../../../../services/api'
import { TabContent } from '../../../../../components/course/TabContent'

interface AnnouncementsTabProps {
  courseId: string
}

export function AnnouncementsTab({ courseId }: AnnouncementsTabProps) {
  return (
    <TabContent
      courseId={courseId}
      fetchData={api.getCourseAnnouncements}
      tabName="Anuncios"
      renderData={(data) => (
        <div>
          <h5>📢 Anuncios del Curso</h5>
          <p>Contenido de Anuncios - {data?.length || 0} elementos</p>
          {/* TODO: Implementar renderizado específico de anuncios */}
        </div>
      )}
    />
  )
}
