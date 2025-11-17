import { COURSE_DETAIL_CONFIG } from '../../constants/courseDetailConstants'
import { useUIStore } from '../../store'

const CourseReviews = ({
  course,
  courseReviewStats,
  reviews,
  isAuthenticated,
  isUserEnrolled,
  user,
  canReview,
  onShowReviewForm
}) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ))
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{COURSE_DETAIL_CONFIG.labels.studentReviews}</h3>
          {courseReviewStats && courseReviewStats.totalReviews > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(courseReviewStats.averageRating))}
                <span className="text-white font-medium ml-2">
                  {courseReviewStats.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-secondary">
                ({courseReviewStats.totalReviews} {courseReviewStats.totalReviews === 1 ? COURSE_DETAIL_CONFIG.labels.review : COURSE_DETAIL_CONFIG.labels.reviews})
              </span>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <button
            onClick={onShowReviewForm}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{COURSE_DETAIL_CONFIG.labels.writeReview}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              const { showLoginModal } = useUIStore.getState()
              showLoginModal()
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{COURSE_DETAIL_CONFIG.labels.writeReview}</span>
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      {courseReviewStats && courseReviewStats.totalReviews > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {courseReviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(courseReviewStats.averageRating))}
                </div>
                <p className="text-secondary text-sm">
                  {COURSE_DETAIL_CONFIG.labels.averageOf} {courseReviewStats.totalReviews} {COURSE_DETAIL_CONFIG.labels.reviews}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = courseReviewStats.ratingDistribution[stars] || 0
                const percentage = courseReviewStats.totalReviews > 0
                  ? (count / courseReviewStats.totalReviews) * 100
                  : 0
                return (
                  <div key={stars} className="flex items-center space-x-3">
                    <span className="text-sm text-white w-4">{stars}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-secondary w-12 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {review.userName?.charAt(0).toUpperCase() || COURSE_DETAIL_CONFIG.labels.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {review.userName || COURSE_DETAIL_CONFIG.labels.user}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-xs text-secondary">
                          {new Date(review.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {review.status === 'approved' && (
                  <span className="bg-green-900/30 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded">
                    {COURSE_DETAIL_CONFIG.labels.verified}
                  </span>
                )}
              </div>
              <p className="text-secondary leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="text-6xl mb-4">💬</div>
          <h4 className="text-xl font-semibold text-white mb-2">
            {COURSE_DETAIL_CONFIG.labels.noReviewsYet}
          </h4>
          <p className="text-secondary mb-6">
            {COURSE_DETAIL_CONFIG.labels.beFirstToReview}
          </p>
          {isAuthenticated && isUserEnrolled && canReview(user?.id, course.id) && (
            <button
              onClick={onShowReviewForm}
              className="bg-accent hover:bg-accent-hover text-background px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {COURSE_DETAIL_CONFIG.labels.writeFirstReview}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseReviews