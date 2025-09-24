import { LEARNING_PATHS_STYLES, LEARNING_PATHS_MESSAGES } from '../../constants/learningPathsConstants.jsx'

const StatsGrid = ({ stats, onNavigateToFavorites }) => {
  return (
    <div className={LEARNING_PATHS_STYLES.stats.grid}>
      <div className={LEARNING_PATHS_STYLES.stats.card}>
        <div className={`${LEARNING_PATHS_STYLES.stats.number} text-accent`}>
          {stats.totalCourses}
        </div>
        <div className={LEARNING_PATHS_STYLES.stats.label}>
          {LEARNING_PATHS_MESSAGES.stats.available}
        </div>
      </div>

      <div
        className={LEARNING_PATHS_STYLES.stats.cardClickable}
        onClick={onNavigateToFavorites}
      >
        <div className={`${LEARNING_PATHS_STYLES.stats.number} text-red-500`}>
          {stats.favoritesCount}
        </div>
        <div className={LEARNING_PATHS_STYLES.stats.label}>
          {LEARNING_PATHS_MESSAGES.stats.wishlist}
        </div>
        <div className={LEARNING_PATHS_STYLES.stats.clickHint}>
          {LEARNING_PATHS_MESSAGES.stats.clickToView}
        </div>
      </div>

      <div className={LEARNING_PATHS_STYLES.stats.card}>
        <div className={`${LEARNING_PATHS_STYLES.stats.number} text-green-500`}>
          {stats.filteredCount}
        </div>
        <div className={LEARNING_PATHS_STYLES.stats.label}>
          {LEARNING_PATHS_MESSAGES.stats.shown}
        </div>
      </div>
    </div>
  )
}

export default StatsGrid