import {
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS
} from '../../../constants/courseEnrollmentManagementConstants'

const EnrollmentHeader = ({
  filterArea,
  areas,
  onFilterChange,
  onRevertChanges
}) => {
  return (
    <div className={ENROLLMENT_STYLES.header}>
      <h3 className={ENROLLMENT_STYLES.headerTitle}>
        {ENROLLMENT_LABELS.pageTitle}
      </h3>
      <div className={ENROLLMENT_STYLES.headerControls}>
        <select
          value={filterArea}
          onChange={(e) => onFilterChange(e.target.value)}
          className={ENROLLMENT_STYLES.areaSelect}
        >
          <option value="all">{ENROLLMENT_LABELS.filterAllAreas}</option>
          {areas.map(area => (
            <option key={area.key} value={area.key}>
              {area.icon} {area.name}
            </option>
          ))}
        </select>
        <button
          onClick={onRevertChanges}
          className={ENROLLMENT_STYLES.revertButton}
          title={ENROLLMENT_LABELS.revertChanges}
        >
          {ENROLLMENT_LABELS.revertChanges}
        </button>
      </div>
    </div>
  )
}

export default EnrollmentHeader