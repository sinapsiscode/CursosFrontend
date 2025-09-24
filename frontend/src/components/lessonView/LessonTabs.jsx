import { LESSON_TABS, LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'
import LessonDescription from './LessonDescription'
import LessonMaterials from './LessonMaterials'
import LessonNotes from './LessonNotes'

const LessonTabs = ({ lesson, activeTab, onTabChange }) => {
  return (
    <div className={LESSON_VIEW_STYLES.tabs.container}>
      <div className={LESSON_VIEW_STYLES.tabs.tabsHeader}>
        <nav className={LESSON_VIEW_STYLES.tabs.tabsList}>
          {LESSON_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${LESSON_VIEW_STYLES.tabs.tab} ${
                activeTab === tab.id
                  ? LESSON_VIEW_STYLES.tabs.tabActive
                  : LESSON_VIEW_STYLES.tabs.tabInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className={LESSON_VIEW_STYLES.tabs.content}>
        {activeTab === 'descripcion' && (
          <LessonDescription lesson={lesson} />
        )}

        {activeTab === 'materiales' && (
          <LessonMaterials lesson={lesson} />
        )}

        {activeTab === 'notas' && (
          <LessonNotes />
        )}
      </div>
    </div>
  )
}

export default LessonTabs