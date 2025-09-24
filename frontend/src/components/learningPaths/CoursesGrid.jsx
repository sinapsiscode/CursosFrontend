import { CourseCard } from '../common'
import { LEARNING_PATHS_STYLES } from '../../constants/learningPathsConstants.jsx'

const CoursesGrid = ({ courses }) => {
  if (courses.length === 0) return null

  return (
    <div className={LEARNING_PATHS_STYLES.courses.grid}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          variant="medium"
        />
      ))}
    </div>
  )
}

export default CoursesGrid