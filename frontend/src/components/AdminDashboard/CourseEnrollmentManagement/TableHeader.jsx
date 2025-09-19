import {
  SORT_OPTIONS,
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS
} from '../../../constants/courseEnrollmentManagementConstants'

const TableHeader = ({ sortBy, onSort, getSortIndicator }) => {
  return (
    <thead>
      <tr className={ENROLLMENT_STYLES.tableHeader}>
        <th
          className={ENROLLMENT_STYLES.tableHeaderCell}
          onClick={() => onSort(SORT_OPTIONS.TITLE)}
        >
          {ENROLLMENT_LABELS.tableHeaders.course} {getSortIndicator(SORT_OPTIONS.TITLE)}
        </th>
        <th
          className={ENROLLMENT_STYLES.tableHeaderCell}
          onClick={() => onSort(SORT_OPTIONS.AREA)}
        >
          {ENROLLMENT_LABELS.tableHeaders.area} {getSortIndicator(SORT_OPTIONS.AREA)}
        </th>
        <th
          className={ENROLLMENT_STYLES.tableHeaderCellCenter}
          onClick={() => onSort(SORT_OPTIONS.ENROLLED_STUDENTS)}
        >
          {ENROLLMENT_LABELS.tableHeaders.enrolled} {getSortIndicator(SORT_OPTIONS.ENROLLED_STUDENTS)}
        </th>
        <th
          className={ENROLLMENT_STYLES.tableHeaderCellCenter}
          onClick={() => onSort(SORT_OPTIONS.VIEWS)}
        >
          {ENROLLMENT_LABELS.tableHeaders.views} {getSortIndicator(SORT_OPTIONS.VIEWS)}
        </th>
        <th
          className={ENROLLMENT_STYLES.tableHeaderCellCenter}
          onClick={() => onSort(SORT_OPTIONS.ENROLLMENT_RATE)}
        >
          {ENROLLMENT_LABELS.tableHeaders.rate} {getSortIndicator(SORT_OPTIONS.ENROLLMENT_RATE)}
        </th>
        <th className={ENROLLMENT_STYLES.tableHeaderCellFixed}>
          {ENROLLMENT_LABELS.tableHeaders.realStudents}
        </th>
        <th className={ENROLLMENT_STYLES.tableHeaderCellFixed}>
          {ENROLLMENT_LABELS.tableHeaders.actions}
        </th>
      </tr>
    </thead>
  )
}

export default TableHeader