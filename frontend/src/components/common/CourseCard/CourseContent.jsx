import { CARD_STYLES } from '../../../constants/courseConstants'
import CourseTitle from './CourseTitle'
import CourseInstructor from './CourseInstructor'
import CourseTags from './CourseTags'
import CourseRating from './CourseRating'
import CourseProgress from './CourseProgress'
import CoursePrice from './CoursePrice'

const CourseContent = ({ course, showProgress, progress }) => {
  return (
    <div className={CARD_STYLES.content}>
      <CourseTitle title={course.title} />
      <CourseInstructor instructor={course.instructor} />
      <CourseTags area={course.area} level={course.level} />
      <CourseRating rating={course.rating} students={course.students} />
      {showProgress && <CourseProgress progress={progress} />}
      <CoursePrice course={course} />
    </div>
  )
}

export default CourseContent