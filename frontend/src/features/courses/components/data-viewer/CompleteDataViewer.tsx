import { useState } from 'react'
import type { CompleteDataViewerProps, TabType } from '../../types/dataViewer'
import { DataViewerHeader } from './DataViewerHeader'
import { TabNavigation } from './TabNavigation'
import { tabsConfig } from './tabsConfig'

export function CompleteDataViewer({ courseId }: CompleteDataViewerProps) {
  const [activeSection, setActiveSection] = useState<TabType>('overview')
  const [showRawData, setShowRawData] = useState(false)

  const activeTab = tabsConfig.find(tab => tab.id === activeSection)
  const ActiveTabComponent = activeTab?.component

  return (
    <div className="complete-data-viewer">
      <DataViewerHeader 
        showRawData={showRawData}
        onToggleRawData={() => setShowRawData(!showRawData)}
      />

      <TabNavigation 
        activeTab={activeSection}
        onTabChange={setActiveSection}
        tabs={tabsConfig}
      />

      <div className="tab-content">
        {ActiveTabComponent && (
          <ActiveTabComponent courseId={courseId} />
        )}
      </div>
    </div>
  )
}
