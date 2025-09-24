import { LEARNING_PATHS_STYLES, LEARNING_PATHS_MESSAGES } from '../../constants/learningPathsConstants.jsx'

const FiltersPanel = ({
  areas,
  filterArea,
  showOnlyFavorites,
  favoritesCount,
  onAreaFilter,
  onFavoritesToggle,
  onNavigateToFavorites
}) => {
  return (
    <div className={LEARNING_PATHS_STYLES.filters.container}>
      <div className={LEARNING_PATHS_STYLES.filters.wrapper}>
        {/* Area Filters */}
        <div className={LEARNING_PATHS_STYLES.filters.areaFilters}>
          {areas.map(area => (
            <button
              key={area.id}
              onClick={() => onAreaFilter(area.id)}
              className={`${LEARNING_PATHS_STYLES.filters.areaButton} ${
                filterArea === area.id
                  ? `${area.color} ${LEARNING_PATHS_STYLES.filters.areaButtonActive}`
                  : LEARNING_PATHS_STYLES.filters.areaButtonInactive
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>

        <div className={LEARNING_PATHS_STYLES.filters.rightSection}>
          {/* Favorites Toggle */}
          <button
            onClick={onFavoritesToggle}
            className={`${LEARNING_PATHS_STYLES.filters.favoritesButton} ${
              showOnlyFavorites
                ? LEARNING_PATHS_STYLES.filters.favoritesButtonActive
                : LEARNING_PATHS_STYLES.filters.favoritesButtonInactive
            }`}
          >
            <svg
              className={LEARNING_PATHS_STYLES.filters.icon}
              fill={showOnlyFavorites ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>
              {showOnlyFavorites
                ? LEARNING_PATHS_MESSAGES.filters.onlyFavorites
                : LEARNING_PATHS_MESSAGES.filters.showFavorites
              }
            </span>
          </button>

          {/* My Favorites Button */}
          {favoritesCount > 0 && (
            <button
              onClick={onNavigateToFavorites}
              className={LEARNING_PATHS_STYLES.filters.myListButton}
            >
              <svg className={LEARNING_PATHS_STYLES.filters.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>{LEARNING_PATHS_MESSAGES.filters.myList} ({favoritesCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FiltersPanel