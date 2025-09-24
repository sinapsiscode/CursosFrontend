import CourseCard from '../common/CourseCard'
import { HOME_STYLES } from '../../constants/homeConstants.jsx'

const CoursesGrid = ({ courses, onNavigateToCourse }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className={HOME_STYLES.courses.noResults}>
        No hay cursos disponibles
      </div>
    )
  }

  return (
    <div className={HOME_STYLES.courses.grid}>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={() => onNavigateToCourse(course.id)}
        />
      ))}
    </div>
  )
}

export default CoursesGrid