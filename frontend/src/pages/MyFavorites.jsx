import { LoadingSpinner } from '../components/common'
import { useMyFavorites } from '../hooks/useMyFavorites'
import { MY_FAVORITES_STYLES } from '../constants/myFavoritesConstants.jsx'
import MyFavoritesHeader from '../components/myFavorites/MyFavoritesHeader'
import StatsGrid from '../components/myFavorites/StatsGrid'
import FilterControls from '../components/myFavorites/FilterControls'
import CourseCard from '../components/myFavorites/CourseCard'
import QuickActions from '../components/myFavorites/QuickActions'
import SuggestionsSection from '../components/myFavorites/SuggestionsSection'
import EmptyState from '../components/myFavorites/EmptyState'

const MyFavorites = () => {
  const {
    favorites,
    suggestions,
    selectedArea,
    sortBy,
    loading,
    stats,
    setSelectedArea,
    setSortBy,
    handleRemoveFavorite,
    handleAddSuggestion,
    handleEnrollInCourse,
    handleEnrollInAll,
    handleDownloadList,
    handleShareList,
    handleClearAll,
    navigateToExplore
  } = useMyFavorites()


  if (loading) {
    return (
      <div className={MY_FAVORITES_STYLES.container}>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className={MY_FAVORITES_STYLES.container}>
      <div className={MY_FAVORITES_STYLES.maxWidth}>

        <MyFavoritesHeader />

        <StatsGrid stats={stats} />

        <FilterControls
          selectedArea={selectedArea}
          sortBy={sortBy}
          onAreaChange={setSelectedArea}
          onSortChange={setSortBy}
        />

        {favorites.length > 0 ? (
          <>
            <div className={MY_FAVORITES_STYLES.courseGrid}>
              {favorites.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onRemoveFavorite={handleRemoveFavorite}
                  onEnrollInCourse={handleEnrollInCourse}
                />
              ))}
            </div>

            <QuickActions
              onEnrollInAll={handleEnrollInAll}
              onDownloadList={handleDownloadList}
              onShareList={handleShareList}
              onClearAll={handleClearAll}
              favoritesCount={favorites.length}
            />
          </>
        ) : (
          <EmptyState onExplore={navigateToExplore} />
        )}

        <SuggestionsSection
          suggestions={suggestions}
          onAddToFavorites={handleAddSuggestion}
        />

      </div>
    </div>
  )
}

export default MyFavorites