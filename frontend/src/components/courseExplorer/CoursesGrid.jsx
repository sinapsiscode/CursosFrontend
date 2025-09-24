import { CourseCard } from '../common'

const CoursesGrid = ({
  courses,
  viewModeClass,
  courseCardVariant
}) => {
  return (
    <div className={viewModeClass}>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          variant={courseCardVariant}
        />
      ))}
    </div>
  )
}

export default CoursesGrid