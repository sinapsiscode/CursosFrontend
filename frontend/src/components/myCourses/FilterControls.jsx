import { COURSE_FILTERS, SORT_OPTIONS, MY_COURSES_STYLES } from '../../constants/myCoursesConstants.jsx'

const FilterControls = ({ filter, sortBy, onFilterChange, onSortChange }) => {
  return (
    <div className={MY_COURSES_STYLES.filters.container}>
      <div className={MY_COURSES_STYLES.filters.filtersSection}>
        <div className={MY_COURSES_STYLES.filters.filtersList}>
          {COURSE_FILTERS.map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => onFilterChange(filterOption.key)}
              className={`${MY_COURSES_STYLES.filters.filterButton} ${
                filter === filterOption.key
                  ? MY_COURSES_STYLES.filters.filterButtonActive
                  : MY_COURSES_STYLES.filters.filterButtonInactive
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className={MY_COURSES_STYLES.filters.sortSection}>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={MY_COURSES_STYLES.filters.sortSelect}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterControls