import { LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'

const LessonHeader = ({
  lesson,
  course,
  currentIndex,
  onNavigateToCourse
}) => {
  return (
    <div className={LESSON_VIEW_STYLES.header.container}>
      <button
        onClick={onNavigateToCourse}
        className={LESSON_VIEW_STYLES.header.backButton}
      >
        <svg className={LESSON_VIEW_STYLES.header.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>{LESSON_VIEW_MESSAGES.navigation.backToCourse}</span>
      </button>

      <h1 className={LESSON_VIEW_STYLES.header.title}>
        {lesson.title}
      </h1>
      <p className={LESSON_VIEW_STYLES.header.info}>
        {LESSON_VIEW_MESSAGES.lessonInfo.lessonPrefix} {currentIndex + 1} {LESSON_VIEW_MESSAGES.lessonInfo.of} {course.lessons.length} • {course.title}
      </p>
    </div>
  )
}

export default LessonHeader