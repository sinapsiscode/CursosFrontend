import { LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'

const LessonSidebar = ({
  course,
  lessonId,
  courseId,
  isAuthenticated,
  onNavigateToLesson
}) => {
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={LESSON_VIEW_STYLES.sidebar.container}>
      <h3 className={LESSON_VIEW_STYLES.sidebar.title}>
        {LESSON_VIEW_MESSAGES.sidebar.title}
      </h3>

      <div className={LESSON_VIEW_STYLES.sidebar.lessonsList}>
        {course.lessons.map((l, index) => (
          <button
            key={l.id}
            onClick={() => onNavigateToLesson(l.id)}
            className={`${LESSON_VIEW_STYLES.sidebar.lessonItem} ${
              l.id.toString() === lessonId
                ? LESSON_VIEW_STYLES.sidebar.lessonItemActive
                : LESSON_VIEW_STYLES.sidebar.lessonItemInactive
            }`}
          >
            <div className={LESSON_VIEW_STYLES.sidebar.lessonContent}>
              <div className={`${LESSON_VIEW_STYLES.sidebar.lessonNumber} ${
                l.id.toString() === lessonId
                  ? LESSON_VIEW_STYLES.sidebar.lessonNumberActive
                  : LESSON_VIEW_STYLES.sidebar.lessonNumberInactive
              }`}>
                {index + 1}
              </div>
              <div className={LESSON_VIEW_STYLES.sidebar.lessonInfo}>
                <p className={LESSON_VIEW_STYLES.sidebar.lessonTitle}>
                  {l.title}
                </p>
                <p className={LESSON_VIEW_STYLES.sidebar.lessonDuration}>
                  {formatDuration(l.duration)}
                </p>
              </div>
              {!l.isFree && !isAuthenticated && (
                <svg className={LESSON_VIEW_STYLES.sidebar.lockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LessonSidebar