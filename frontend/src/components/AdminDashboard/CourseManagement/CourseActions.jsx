import {
  COURSE_MANAGEMENT_STYLES,
  COURSE_MANAGEMENT_LABELS,
  COURSE_MANAGEMENT_ICONS
} from '../../../constants/courseManagementConstants.jsx'

const CourseActions = ({ course, onPreview, onEdit, onDelete }) => {
  const handleOpenInNewTab = () => {
    window.open(`/course/${course.id}`, '_blank')
  }

  return (
    <div className={COURSE_MANAGEMENT_STYLES.actionButtons}>
      {/* Botón Preview */}
      <button
        onClick={() => onPreview(course)}
        className={`${COURSE_MANAGEMENT_STYLES.actionButton} ${COURSE_MANAGEMENT_STYLES.previewButton}`}
        title={COURSE_MANAGEMENT_LABELS.actions.preview}
      >
        {COURSE_MANAGEMENT_ICONS.preview}
        <span className={COURSE_MANAGEMENT_STYLES.tooltip}>
          {COURSE_MANAGEMENT_LABELS.actions.preview}
        </span>
      </button>

      {/* Botón Open */}
      <button
        onClick={handleOpenInNewTab}
        className={`${COURSE_MANAGEMENT_STYLES.actionButton} ${COURSE_MANAGEMENT_STYLES.openButton}`}
        title={COURSE_MANAGEMENT_LABELS.actions.open}
      >
        {COURSE_MANAGEMENT_ICONS.open}
        <span className={COURSE_MANAGEMENT_STYLES.tooltip}>
          {COURSE_MANAGEMENT_LABELS.actions.open}
        </span>
      </button>

      {/* Botón Edit */}
      <button
        onClick={() => onEdit(course)}
        className={`${COURSE_MANAGEMENT_STYLES.actionButton} ${COURSE_MANAGEMENT_STYLES.editButton}`}
        title={COURSE_MANAGEMENT_LABELS.actions.edit}
      >
        Editar
      </button>

      {/* Botón Delete */}
      <button
        onClick={() => onDelete(course)}
        className={`${COURSE_MANAGEMENT_STYLES.actionButton} ${COURSE_MANAGEMENT_STYLES.deleteButton}`}
        title={COURSE_MANAGEMENT_LABELS.actions.delete}
      >
        {COURSE_MANAGEMENT_ICONS.delete}
      </button>
    </div>
  )
}

export default CourseActions