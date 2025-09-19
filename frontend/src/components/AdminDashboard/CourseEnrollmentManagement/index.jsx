import { useCourseEnrollmentManagement } from '../../../hooks/useCourseEnrollmentManagement'
import { ENROLLMENT_STYLES } from '../../../constants/courseEnrollmentManagementConstants'
import EnrollmentHeader from './EnrollmentHeader'
import EnrollmentSummary from './EnrollmentSummary'
import EnrollmentTable from './EnrollmentTable'
import StudentsModal from './StudentsModal'

const CourseEnrollmentManagement = ({ loadDashboardData }) => {
  const enrollmentProps = useCourseEnrollmentManagement()

  return (
    <div className={ENROLLMENT_STYLES.container}>
      <EnrollmentHeader
        filterArea={enrollmentProps.filterArea}
        areas={enrollmentProps.areas}
        onFilterChange={enrollmentProps.handleFilterChange}
        onRevertChanges={() => enrollmentProps.handleRevertChanges(loadDashboardData)}
      />

      <EnrollmentSummary
        enrollmentData={enrollmentProps.enrollmentData}
      />

      <EnrollmentTable
        {...enrollmentProps}
      />

      <StudentsModal
        {...enrollmentProps}
      />
    </div>
  )
}

export default CourseEnrollmentManagement