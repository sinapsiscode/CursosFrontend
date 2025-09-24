import { MY_COURSES_STYLES, MY_COURSES_MESSAGES } from '../../constants/myCoursesConstants.jsx'

const EmptyState = ({ filter, emptyMessage, onExplore }) => {
  return (
    <div className={MY_COURSES_STYLES.empty.container}>
      <div className={MY_COURSES_STYLES.empty.icon}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className={MY_COURSES_STYLES.empty.title}>
        {emptyMessage.title}
      </h3>
      <p className={MY_COURSES_STYLES.empty.subtitle}>
        {emptyMessage.subtitle}
      </p>
      {filter === 'all' && (
        <button
          onClick={onExplore}
          className={MY_COURSES_STYLES.empty.button}
        >
          {MY_COURSES_MESSAGES.empty.exploreButton}
        </button>
      )}
    </div>
  )
}

export default EmptyState