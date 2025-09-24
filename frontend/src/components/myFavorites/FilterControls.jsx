import { AREAS, SORT_OPTIONS, MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const FilterControls = ({ selectedArea, sortBy, onAreaChange, onSortChange }) => {
  return (
    <div className={MY_FAVORITES_STYLES.filters.container}>
      <div className={MY_FAVORITES_STYLES.filters.header}>
        <div className={MY_FAVORITES_STYLES.filters.filtersSection}>
          <div className={MY_FAVORITES_STYLES.filters.filtersList}>
            {AREAS.map(area => (
              <button
                key={area}
                onClick={() => onAreaChange(area)}
                className={`${MY_FAVORITES_STYLES.filters.filterButton} ${
                  selectedArea === area
                    ? MY_FAVORITES_STYLES.filters.filterButtonActive
                    : MY_FAVORITES_STYLES.filters.filterButtonInactive
                }`}
              >
                {MY_FAVORITES_MESSAGES.filters[area]}
              </button>
            ))}
          </div>
        </div>

        <div className={MY_FAVORITES_STYLES.filters.sortSection}>
          <span className={MY_FAVORITES_STYLES.filters.sortLabel}>
            {MY_FAVORITES_MESSAGES.sortBy}
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={MY_FAVORITES_STYLES.filters.sortSelect}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterControls