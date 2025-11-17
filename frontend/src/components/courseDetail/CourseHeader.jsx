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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 md:gap-8">
          {/* Imagen */}
          <div className="w-full md:w-1/3">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover rounded-lg sm:rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center flex-wrap gap-2 mb-3 sm:mb-4">
              <span className={`${areaColors.bg} text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
                {course.area.charAt(0).toUpperCase() + course.area.slice(1)}
              </span>
              <span className={`${levelColor} text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
              {course.isNew && (
                <span className="bg-accent text-background text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold">
                  {COURSE_DETAIL_CONFIG.badges.new}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              {course.title}
            </h1>

            <p className="text-secondary text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="text-white font-medium">{course.rating}</span>
                <span className="text-secondary hidden sm:inline">({course.students?.toLocaleString()} {COURSE_DETAIL_CONFIG.labels.students})</span>
                <span className="text-secondary sm:hidden">({course.students?.toLocaleString()})</span>
              </div>
              <div className="text-secondary">
                {formatDuration(course.duration)}
              </div>
              <div className="text-secondary">
                {course.lessons?.length} {COURSE_DETAIL_CONFIG.labels.classes}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <div className="text-2xl font-bold text-white">
                <span className="text-accent">Gratis</span>
              </div>

              {/* Puntos de fidelización */}
              {course.points && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-purple-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <span className="text-purple-400 text-base sm:text-lg">🏆</span>
                  <div>
                    <span className="text-purple-400 text-xs sm:text-sm block">{COURSE_DETAIL_CONFIG.labels.earnPoints}</span>
                    <span className="text-purple-300 font-bold text-sm sm:text-base">
                      {course.points || 100} {COURSE_DETAIL_CONFIG.labels.points}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleFavoriteToggle}
                className={`p-2 sm:p-2.5 md:p-3 rounded-lg border-2 transition-colors flex-shrink-0 ${
                  isFavorite
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-600 text-white hover:border-red-500 hover:text-red-500'
                }`}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
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
                  className="bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-green-700 transition-colors flex items-center gap-1.5 sm:gap-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">{COURSE_DETAIL_CONFIG.labels.accessCourse}</span>
                  <span className="sm:hidden">Acceder</span>
                </button>
              )}
            </div>

            {/* Botón de Examen */}
            {courseExam && isAuthenticated && isUserEnrolled && (
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={onShowExamInfo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{COURSE_DETAIL_CONFIG.labels.takeExam}</span>
                </button>
                <div className="mt-2 sm:mt-3 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-purple-300 text-center">
                    <span className="font-semibold">{COURSE_DETAIL_CONFIG.messages.getDiscount}</span> {COURSE_DETAIL_CONFIG.messages.examDiscountInfo}
                    <span className="text-purple-400 font-bold"> {COURSE_DETAIL_CONFIG.messages.discountPercent}</span> {COURSE_DETAIL_CONFIG.messages.basedOnScore}
                  </p>
                  <div className="mt-2 text-[10px] sm:text-xs text-gray-400 text-center">
                    • {COURSE_DETAIL_CONFIG.messages.discountStructure.high}<br/>
                    • {COURSE_DETAIL_CONFIG.messages.discountStructure.medium}<br/>
                    • {COURSE_DETAIL_CONFIG.messages.discountStructure.low}
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje informativo para usuarios no inscritos */}
            {courseExam && isAuthenticated && !isUserEnrolled && (
              <div className="mt-4 sm:mt-6 bg-gray-800 border border-gray-600 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3 text-gray-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">{COURSE_DETAIL_CONFIG.messages.examAvailable}</p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {COURSE_DETAIL_CONFIG.messages.enrollToTakeExam}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Progreso si está en curso */}
            {safeProgress.percentage > 0 && (
              <div className="mt-4 sm:mt-6">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-secondary">Tu progreso</span>
                  <span className="text-accent font-medium">{safeProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-accent h-2 sm:h-3 rounded-full transition-all"
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