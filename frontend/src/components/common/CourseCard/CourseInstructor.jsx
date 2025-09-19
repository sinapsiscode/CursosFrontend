import { CARD_STYLES } from '../../../constants/courseConstants'

const CourseInstructor = ({ instructor }) => {
  return (
    <p className={CARD_STYLES.instructor}>
      {instructor}
    </p>
  )
}

export default CourseInstructor