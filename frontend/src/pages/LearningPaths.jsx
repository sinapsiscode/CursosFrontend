import { LoadingSpinner } from '../components/common'
import { useLearningPaths } from '../hooks/useLearningPaths'
import { LEARNING_PATHS_STYLES } from '../constants/learningPathsConstants.jsx'
import LearningPathsHeader from '../components/learningPaths/LearningPathsHeader'
import StatsGrid from '../components/learningPaths/StatsGrid'
import FiltersPanel from '../components/learningPaths/FiltersPanel'
import CoursesGrid from '../components/learningPaths/CoursesGrid'
import EmptyState from '../components/learningPaths/EmptyState'
import AuthRequired from '../components/learningPaths/AuthRequired'

const LearningPaths = () => {
  const {
    loading,
    isAuthenticated,
    courses,
    filterArea,
    showOnlyFavorites,
    stats,
    areas,
    handleAreaFilter,
    handleFavoritesToggle,
    navigateToLogin,
    navigateToFavorites
  } = useLearningPaths()

  if (loading) {
    return (
      <div className={LEARNING_PATHS_STYLES.loading}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthRequired onNavigateToLogin={navigateToLogin} />
  }

  return (
    <div className={LEARNING_PATHS_STYLES.container}>
      <div className={LEARNING_PATHS_STYLES.maxWidth}>

        <LearningPathsHeader />

        <StatsGrid
          stats={stats}
          onNavigateToFavorites={navigateToFavorites}
        />

        <FiltersPanel
          areas={areas}
          filterArea={filterArea}
          showOnlyFavorites={showOnlyFavorites}
          favoritesCount={stats.favoritesCount}
          onAreaFilter={handleAreaFilter}
          onFavoritesToggle={handleFavoritesToggle}
          onNavigateToFavorites={navigateToFavorites}
        />

        {courses.length > 0 ? (
          <CoursesGrid courses={courses} />
        ) : (
          <EmptyState
            showOnlyFavorites={showOnlyFavorites}
            onShowAllCourses={handleFavoritesToggle}
          />
        )}

      </div>
    </div>
  )
}

export default LearningPaths