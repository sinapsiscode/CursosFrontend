import { AREA_COLORS, COURSE_DETAIL_CONFIG } from '../../constants/courseDetailConstants'

const CourseTabs = ({ activeTab, setActiveTab, course }) => {
  const areaColors = AREA_COLORS[course.area] || {}

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {COURSE_DETAIL_CONFIG.tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? `${areaColors.border} ${areaColors.text}`
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default CourseTabs