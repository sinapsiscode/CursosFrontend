import {
  COURSE_MANAGEMENT_STYLES,
  COURSE_MANAGEMENT_LABELS
} from '../../../constants/courseManagementConstants'

const CourseHeader = ({ showCreateForm, onToggleCreateForm }) => {
  return (
    <div className={COURSE_MANAGEMENT_STYLES.header}>
      <h3 className={COURSE_MANAGEMENT_STYLES.title}>
        {COURSE_MANAGEMENT_LABELS.title}
      </h3>
      <button
        onClick={onToggleCreateForm}
        className={COURSE_MANAGEMENT_STYLES.createButton}
      >
        {showCreateForm ? COURSE_MANAGEMENT_LABELS.cancelButton : COURSE_MANAGEMENT_LABELS.createButton}
      </button>
    </div>
  )
}

export default CourseHeader