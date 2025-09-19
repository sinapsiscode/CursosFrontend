import {
  VIEW_MODES,
  VIEW_MODE_LABELS,
  STUDENT_STYLES,
  STUDENT_LABELS,
  STUDENT_ICONS
} from '../../../constants/studentManagementConstants'

const ViewModeSelector = ({
  viewMode,
  selectedCourseId,
  courses,
  onViewModeChange,
  onCourseChange
}) => {
  return (
    <div className={STUDENT_STYLES.viewModeCard}>
      <div className={STUDENT_STYLES.viewModeContainer}>
        <div className={STUDENT_STYLES.viewModeTabs}>
          <button
            onClick={() => onViewModeChange(VIEW_MODES.ALL)}
            className={`${STUDENT_STYLES.viewModeTab} ${
              viewMode === VIEW_MODES.ALL
                ? STUDENT_STYLES.viewModeTabActive
                : STUDENT_STYLES.viewModeTabInactive
            }`}
          >
            {STUDENT_ICONS.users}
            {VIEW_MODE_LABELS[VIEW_MODES.ALL]}
          </button>
          <button
            onClick={() => onViewModeChange(VIEW_MODES.COURSE)}
            className={`${STUDENT_STYLES.viewModeTab} ${
              viewMode === VIEW_MODES.COURSE
                ? STUDENT_STYLES.viewModeTabActive
                : STUDENT_STYLES.viewModeTabInactive
            }`}
          >
            {STUDENT_ICONS.courses}
            {VIEW_MODE_LABELS[VIEW_MODES.COURSE]}
          </button>
        </div>

        {viewMode === VIEW_MODES.COURSE && (
          <select
            value={selectedCourseId}
            onChange={(e) => onCourseChange(e.target.value)}
            className={STUDENT_STYLES.courseSelect}
          >
            <option value="">{STUDENT_LABELS.courseSelectPlaceholder}</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.area})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

export default ViewModeSelector