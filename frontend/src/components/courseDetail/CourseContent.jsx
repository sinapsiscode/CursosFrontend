import { COURSE_DETAIL_CONFIG } from '../../constants/courseDetailConstants'

const CourseContent = ({
  course,
  safeProgress,
  isAuthenticated,
  formatDuration,
  onLessonClick
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">
        {COURSE_DETAIL_CONFIG.labels.courseContent} ({course.lessons?.length} {COURSE_DETAIL_CONFIG.labels.classes})
      </h3>

      {course.lessons?.map((lesson, index) => (
        <div
          key={lesson.id}
          className={`bg-surface rounded-lg p-4 cursor-pointer transition-colors ${
            lesson.isFree || isAuthenticated
              ? 'hover:bg-gray-700'
              : 'opacity-60'
          }`}
          onClick={() => onLessonClick(lesson)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                safeProgress.completedLessons.includes(lesson.id)
                  ? 'bg-accent text-background'
                  : 'bg-gray-700 text-white'
              }`}>
                {safeProgress.completedLessons.includes(lesson.id) ? '✓' : index + 1}
              </div>

              <div>
                <h4 className="text-white font-medium">{lesson.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-secondary">
                  <span>{formatDuration(lesson.duration)}</span>
                  {lesson.isFree && (
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                      {COURSE_DETAIL_CONFIG.badges.free}
                    </span>
                  )}
                  {lesson.materials && lesson.materials.length > 0 && (
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{lesson.materials.length} {COURSE_DETAIL_CONFIG.labels.materials}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!lesson.isFree && !isAuthenticated && (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}

              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseContent