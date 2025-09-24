import { LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'

const LessonNotes = () => {
  return (
    <div>
      <textarea
        className={LESSON_VIEW_STYLES.notes.textarea}
        placeholder={LESSON_VIEW_MESSAGES.tabs.notes.placeholder}
      />
      <button className={LESSON_VIEW_STYLES.notes.saveButton}>
        {LESSON_VIEW_MESSAGES.tabs.notes.saveButton}
      </button>
    </div>
  )
}

export default LessonNotes