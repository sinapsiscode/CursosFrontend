import { CARD_STYLES } from '../../../constants/courseConstants'

const CourseTitle = ({ title }) => {
  return (
    <h3 className={CARD_STYLES.title}>
      {title}
    </h3>
  )
}

export default CourseTitle