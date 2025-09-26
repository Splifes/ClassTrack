export type TabType = 'overview' | 'materials' | 'announcements' | 'coursework' | 'students' | 'submissions'

export interface CompleteDataViewerProps {
  courseId: string
}

export interface TabConfig {
  id: TabType
  label: string
  icon: string
  component: React.ComponentType<{ courseId: string }>
}

export interface DataViewerHeaderProps {
  showRawData: boolean
  onToggleRawData: () => void
}
