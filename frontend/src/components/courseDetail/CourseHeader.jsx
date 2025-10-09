import { AREA_COLORS, LEVEL_COLORS, COURSE_DETAIL_CONFIG } from '../../constants/courseDetailConstants'

const CourseHeader = ({
  course,
  isFavorite,
  safeProgress,
  isAuthenticated,
  isUserEnrolled,
  courseExam,
  formatDuration,
  handleFavoriteToggle,
  onEnrollSuccess,
  onShowExamInfo,
  navigate
}) => {
  const areaColors = AREA_COLORS[course.area] || {}
  const levelColor = LEVEL_COLORS[course.level] || 'bg-gray-500'

  return (
    <div className="bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="md:flex items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Imagen */}
          <div className="md:w-1/3">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="md:w-2/3">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`${areaColors.bg} text-white text-sm px-3 py-1 rounded-full`}>
                {course.area.charAt(0).toUpperCase() + course.area.slice(1)}
              </span>
              <span className={`${levelColor} text-white text-sm px-3 py-1 rounded-full`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
              {course.isNew && (
                <span className="bg-accent text-background text-sm px-3 py-1 rounded-full font-bold">
                  {COURSE_DETAIL_CONFIG.badges.new}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {course.title}
            </h1>

            <p className="text-text-secondary text-lg mb-6">
              {course.description}
            </p>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="text-white font-medium">{course.rating}</span>
                <span className="text-text-secondary">({course.students?.toLocaleString()} {COURSE_DETAIL_CONFIG.labels.students})</span>
              </div>
              <div className="text-text-secondary">
                {formatDuration(course.duration)}
              </div>
              <div className="text-text-secondary">
                {course.lessons?.length} {COURSE_DETAIL_CONFIG.labels.classes}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-white">
                <span className="text-accent">Gratis</span>
              </div>

              {/* Puntos de fidelización */}
              {course.points && (
                <div className="flex items-center gap-2 bg-purple-900/30 px-3 py-2 rounded-lg">
                  <span className="text-purple-400 text-lg">🏆</span>
                  <div>
                    <span className="text-purple-400 text-sm block">{COURSE_DETAIL_CONFIG.labels.earnPoints}</span>
                    <span className="text-purple-300 font-bold">
                      {course.points || 100} {COURSE_DETAIL_CONFIG.labels.points}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleFavoriteToggle}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  isFavorite
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-600 text-white hover:border-red-500 hover:text-red-500'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {isAuthenticated && isUserEnrolled && (
                <button
                  onClick={() => {
                    if (course.lessons && course.lessons.length > 0) {
                      navigate(`/course/${course.id}/lesson/${course.lessons[0].id}`)
                    } else {
                      navigate(`/course/${course.id}/lesson/1`)
                    }
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{COURSE_DETAIL_CONFIG.labels.accessCourse}</span>
                </button>
              )}
            </div>

            {/* Botón de Examen */}
            {courseExam && isAuthenticated && isUserEnrolled && (
              <div className="mt-6">
                <button
                  onClick={onShowExamInfo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{COURSE_DETAIL_CONFIG.labels.takeExam}</span>
                </button>
                <div className="mt-3 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-sm text-purple-300 text-center">
                    <span className="font-semibold">{COURSE_DETAIL_CONFIG.messages.getDiscount}</span> {COURSE_DETAIL_CONFIG.messages.examDiscountInfo}
                    <span className="text-purple-400 font-bold"> {COURSE_DETAIL_CONFIG.messages.discountPercent}</span> {COURSE_DETAIL_CONFIG.messages.basedOnScore}
                  </p>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    • {COURSE_DETAIL_CONFIG.messages.discountStructure.high}<br/>
                    • {COURSE_DETAIL_CONFIG.messages.discountStructure.medium}<br/>
                    • {COURSE_DETAIL_CONFIG.messages.discountStructure.low}
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje informativo para usuarios no inscritos */}
            {courseExam && isAuthenticated && !isUserEnrolled && (
              <div className="mt-6 bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">{COURSE_DETAIL_CONFIG.messages.examAvailable}</p>
                    <p className="text-sm text-gray-400">
                      {COURSE_DETAIL_CONFIG.messages.enrollToTakeExam}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Progreso si está en curso */}
            {safeProgress.percentage > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Tu progreso</span>
                  <span className="text-accent font-medium">{safeProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-accent h-3 rounded-full transition-all"
                    style={{ width: `${safeProgress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseHeader