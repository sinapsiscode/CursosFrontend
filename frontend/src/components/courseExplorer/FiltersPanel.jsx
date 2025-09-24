import {
  COURSE_EXPLORER_STYLES,
  COURSE_EXPLORER_MESSAGES,
  AREAS,
  LEVELS,
  DURATIONS,
  PRICES
} from '../../constants/courseExplorerConstants.jsx'
import FilterGroup from './FilterGroup'

const FiltersPanel = ({
  filters,
  activeFiltersCount,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div className={COURSE_EXPLORER_STYLES.filters.container}>
      <div className={COURSE_EXPLORER_STYLES.filters.header}>
        <h3 className={COURSE_EXPLORER_STYLES.filters.title}>
          {COURSE_EXPLORER_MESSAGES.filtersTitle}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className={COURSE_EXPLORER_STYLES.filters.clearButton}
          >
            {COURSE_EXPLORER_MESSAGES.clearFilters.replace('{count}', activeFiltersCount)}
          </button>
        )}
      </div>

      <div className={COURSE_EXPLORER_STYLES.filters.grid}>
        <FilterGroup
          label={COURSE_EXPLORER_MESSAGES.filterLabels.area}
          options={AREAS}
          selectedValue={filters.area}
          onFilterChange={(value) => onFilterChange('area', value)}
        />

        <FilterGroup
          label={COURSE_EXPLORER_MESSAGES.filterLabels.level}
          options={LEVELS}
          selectedValue={filters.level}
          onFilterChange={(value) => onFilterChange('level', value)}
        />

        <FilterGroup
          label={COURSE_EXPLORER_MESSAGES.filterLabels.duration}
          options={DURATIONS}
          selectedValue={filters.duration}
          onFilterChange={(value) => onFilterChange('duration', value)}
        />

        <FilterGroup
          label={COURSE_EXPLORER_MESSAGES.filterLabels.price}
          options={PRICES}
          selectedValue={filters.price}
          onFilterChange={(value) => onFilterChange('price', value)}
        />
      </div>
    </div>
  )
}

export default FiltersPanel