const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-700 bg-background">
      <nav className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-accent text-accent bg-surface'
                : 'text-gray-400 hover:text-white hover:bg-surface/50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default TabNavigation