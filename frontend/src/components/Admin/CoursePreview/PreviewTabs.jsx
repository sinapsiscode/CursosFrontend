import { PREVIEW_TABS } from '../../../constants/formConstants'

const PreviewTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-700 mb-6">
      <nav className="flex space-x-8 -mb-px">
        {PREVIEW_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default PreviewTabs