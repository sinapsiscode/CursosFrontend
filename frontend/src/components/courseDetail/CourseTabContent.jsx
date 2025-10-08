import CourseContent from './CourseContent'
import CourseAbout from './CourseAbout'
import CourseReviews from './CourseReviews'

const CourseTabContent = ({
  activeTab,
  course,
  safeProgress,
  isAuthenticated,
  isUserEnrolled,
  user,
  courseReviewStats,
  reviews,
  formatDuration,
  onLessonClick,
  navigate,
  canReview,
  onShowReviewForm
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {activeTab === 'temario' && (
        <CourseContent
          course={course}
          safeProgress={safeProgress}
          isAuthenticated={isAuthenticated}
          formatDuration={formatDuration}
          onLessonClick={onLessonClick}
        />
      )}

      {activeTab === 'sobre' && (
        <CourseAbout
          course={course}
          isAuthenticated={isAuthenticated}
          navigate={navigate}
        />
      )}

      {activeTab === 'reseñas' && (
        <CourseReviews
          course={course}
          courseReviewStats={courseReviewStats}
          reviews={reviews}
          isAuthenticated={isAuthenticated}
          isUserEnrolled={isUserEnrolled}
          user={user}
          canReview={canReview}
          onShowReviewForm={onShowReviewForm}
        />
      )}
    </div>
  )
}

export default CourseTabContent