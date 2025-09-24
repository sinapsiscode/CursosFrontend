import { useCourseExplorer } from '../hooks/useCourseExplorer'
import { COURSE_EXPLORER_STYLES } from '../constants/courseExplorerConstants.jsx'
import ExplorerHeader from '../components/courseExplorer/ExplorerHeader'
import SearchBar from '../components/courseExplorer/SearchBar'
import FiltersPanel from '../components/courseExplorer/FiltersPanel'
import CoursesGrid from '../components/courseExplorer/CoursesGrid'
import EmptyState from '../components/courseExplorer/EmptyState'
import LoadingState from '../components/courseExplorer/LoadingState'

const CourseExplorer = () => {
  const {
    filteredCourses,
    filters,
    viewMode,
    searchQuery,
    loading,
    activeFiltersCount,
    hasResults,
    coursesCount,
    handleFilterChange,
    clearAllFilters,
    handleViewModeChange,
    handleSearchChange,
    getViewModeClass,
    getCourseCardVariant
  } = useCourseExplorer()

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className={COURSE_EXPLORER_STYLES.container}>
      <div className={COURSE_EXPLORER_STYLES.maxWidth}>
        {/* Header */}
        <ExplorerHeader
          coursesCount={coursesCount}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Filters */}
        <FiltersPanel
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
        />

        {/* Results */}
        {hasResults ? (
          <CoursesGrid
            courses={filteredCourses}
            viewModeClass={getViewModeClass()}
            courseCardVariant={getCourseCardVariant()}
          />
        ) : (
          <EmptyState
            onClearFilters={clearAllFilters}
          />
        )}
      </div>
    </div>
  )
}

export default CourseExplorer