import type { TabConfig } from '../../types/dataViewer'
import { OverviewTab } from './tabs/OverviewTab'
import { MaterialsTab } from './tabs/MaterialsTab'
import { AnnouncementsTab } from './tabs/AnnouncementsTab'

export const tabsConfig: TabConfig[] = [
  {
    id: 'overview',
    label: 'Resumen',
    icon: '📊',
    component: OverviewTab
  },
  {
    id: 'materials',
    label: 'Materiales',
    icon: '📄',
    component: MaterialsTab
  },
  {
    id: 'announcements',
    label: 'Anuncios',
    icon: '📢',
    component: AnnouncementsTab
  },
  {
    id: 'coursework',
    label: 'Tareas',
    icon: '📚',
    component: OverviewTab // TODO: Crear CourseworkTab
  },
  {
    id: 'students',
    label: 'Estudiantes',
    icon: '👥',
    component: OverviewTab // TODO: Crear StudentsTab
  },
  {
    id: 'submissions',
    label: 'Entregas',
    icon: '📝',
    component: OverviewTab // TODO: Crear SubmissionsTab
  }
]
