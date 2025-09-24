import { LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'

const LessonDescription = ({ lesson }) => {
  return (
    <div className={LESSON_VIEW_STYLES.description.container}>
      <p className={LESSON_VIEW_STYLES.description.text}>
        {lesson.description || LESSON_VIEW_MESSAGES.tabs.description.empty}
      </p>
    </div>
  )
}

export default LessonDescription