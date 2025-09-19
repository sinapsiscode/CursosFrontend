import {
  COURSE_MANAGEMENT_STYLES,
  COURSE_MANAGEMENT_LABELS
} from '../../../constants/courseManagementConstants'

const CourseTableHeader = () => {
  return (
    <thead>
      <tr className={COURSE_MANAGEMENT_STYLES.tableHeader}>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCell}>
          {COURSE_MANAGEMENT_LABELS.headers.course}
        </th>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCell}>
          {COURSE_MANAGEMENT_LABELS.headers.instructor}
        </th>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCellCenter}>
          {COURSE_MANAGEMENT_LABELS.headers.area}
        </th>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCellCenter}>
          {COURSE_MANAGEMENT_LABELS.headers.level}
        </th>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCellCenter}>
          {COURSE_MANAGEMENT_LABELS.headers.duration}
        </th>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCellCenter}>
          {COURSE_MANAGEMENT_LABELS.headers.price}
        </th>
        <th className={COURSE_MANAGEMENT_STYLES.tableHeaderCellCenter}>
          {COURSE_MANAGEMENT_LABELS.headers.actions}
        </th>
      </tr>
    </thead>
  )
}

export default CourseTableHeader