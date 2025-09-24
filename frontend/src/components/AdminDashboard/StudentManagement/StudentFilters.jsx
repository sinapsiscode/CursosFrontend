import {
  STATUS_LABELS,
  STUDENT_STYLES,
  STUDENT_LABELS,
  STUDENT_ICONS
} from '../../../constants/studentManagementConstants.jsx'

const StudentFilters = ({
  searchTerm,
  filterStatus,
  filteredStudents,
  onSearchChange,
  onStatusChange
}) => {
  const resultCount = filteredStudents.length
  const resultLabel = resultCount === 1
    ? STUDENT_LABELS.resultsCount.singular
    : STUDENT_LABELS.resultsCount.plural

  return (
    <div className={STUDENT_STYLES.filtersCard}>
      <div className={STUDENT_STYLES.filtersContainer}>
        <div className={STUDENT_STYLES.filtersGroup}>
          {/* Search */}
          <div className={STUDENT_STYLES.searchContainer}>
            <input
              type="text"
              placeholder={STUDENT_LABELS.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={STUDENT_STYLES.searchInput}
            />
            {STUDENT_ICONS.search}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={STUDENT_STYLES.statusSelect}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={STUDENT_STYLES.resultsCount}>
          {resultCount} {resultLabel}
        </div>
      </div>
    </div>
  )
}

export default StudentFilters