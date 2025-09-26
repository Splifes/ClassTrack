import type { TabType, TabConfig } from '../../types/dataViewer'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  tabs: TabConfig[]
}

export function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
  return (
    <ul className="nav nav-pills mb-4">
      {tabs.map((tab) => (
        <li key={tab.id} className="nav-item">
          <button 
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
