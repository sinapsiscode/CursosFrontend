import { ENROLLMENT_STYLES } from '../../../constants/enrollmentConstants'
import { formatCourseDetails } from '../../../utils/enrollmentUtils'

const CourseInfo = ({ course }) => {
  return (
    <div className={ENROLLMENT_STYLES.courseInfoCard}>
      <h4 className={ENROLLMENT_STYLES.courseTitle}>{course.title}</h4>
      <p className={ENROLLMENT_STYLES.courseDetails}>
        {formatCourseDetails(course)}
      </p>
    </div>
  )
}

export default CourseInfo