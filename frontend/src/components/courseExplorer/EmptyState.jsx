import {
  COURSE_EXPLORER_STYLES,
  COURSE_EXPLORER_MESSAGES,
  COURSE_EXPLORER_ICONS
} from '../../constants/courseExplorerConstants.jsx'

const EmptyState = ({
  onClearFilters
}) => {
  return (
    <div className={COURSE_EXPLORER_STYLES.emptyState.container}>
      <div className={COURSE_EXPLORER_STYLES.emptyState.icon}>
        {COURSE_EXPLORER_ICONS.emptySearch}
      </div>
      <h3 className={COURSE_EXPLORER_STYLES.emptyState.title}>
        {COURSE_EXPLORER_MESSAGES.emptyState.title}
      </h3>
      <p className={COURSE_EXPLORER_STYLES.emptyState.subtitle}>
        {COURSE_EXPLORER_MESSAGES.emptyState.subtitle}
      </p>
      <button
        onClick={onClearFilters}
        className={COURSE_EXPLORER_STYLES.emptyState.button}
      >
        {COURSE_EXPLORER_MESSAGES.emptyState.buttonText}
      </button>
    </div>
  )
}

export default EmptyState