import { LEARNING_PATHS_STYLES, LEARNING_PATHS_MESSAGES } from '../../constants/learningPathsConstants.jsx'

const EmptyState = ({ showOnlyFavorites, onShowAllCourses }) => {
  const content = showOnlyFavorites
    ? LEARNING_PATHS_MESSAGES.empty.noFavorites
    : LEARNING_PATHS_MESSAGES.empty.noCourses

  return (
    <div className={LEARNING_PATHS_STYLES.empty.container}>
      <div className={LEARNING_PATHS_STYLES.empty.icon}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className={LEARNING_PATHS_STYLES.empty.title}>
        {content.title}
      </h3>
      <p className={LEARNING_PATHS_STYLES.empty.subtitle}>
        {content.subtitle}
      </p>
      {showOnlyFavorites && (
        <button
          onClick={onShowAllCourses}
          className={LEARNING_PATHS_STYLES.empty.button}
        >
          {content.button}
        </button>
      )}
    </div>
  )
}

export default EmptyState