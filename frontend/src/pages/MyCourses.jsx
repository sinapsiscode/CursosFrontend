import { LoadingSpinner } from '../components/common'
import { useMyCourses } from '../hooks/useMyCourses'
import { MY_COURSES_STYLES } from '../constants/myCoursesConstants.jsx'
import MyCoursesHeader from '../components/myCourses/MyCoursesHeader'
import StatsGrid from '../components/myCourses/StatsGrid'
import FilterControls from '../components/myCourses/FilterControls'
import CourseCard from '../components/myCourses/CourseCard'
import EmptyState from '../components/myCourses/EmptyState'

const MyCourses = () => {
  const {
    loading,
    filteredCourses,
    filter,
    sortBy,
    stats,
    emptyMessage,
    getProgressColor,
    getProgressText,
    formatDuration,
    handleContinueCourse,
    handleDownloadCertificate,
    handleFilterChange,
    handleSortChange,
    navigateToExplore
  } = useMyCourses()

  if (loading) {
    return (
      <div className={MY_COURSES_STYLES.loading.container}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className={MY_COURSES_STYLES.container}>
      <div className={MY_COURSES_STYLES.maxWidth}>

        <MyCoursesHeader />

        <StatsGrid stats={stats} />

        <FilterControls
          filter={filter}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {/* Course List */}
        {filteredCourses.length > 0 ? (
          <div className={MY_COURSES_STYLES.courses.grid}>
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                getProgressColor={getProgressColor}
                getProgressText={getProgressText}
                formatDuration={formatDuration}
                onContinueCourse={handleContinueCourse}
                onDownloadCertificate={handleDownloadCertificate}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            filter={filter}
            emptyMessage={emptyMessage}
            onExplore={navigateToExplore}
          />
        )}

      </div>
    </div>
  )
}

export default MyCourses