import { MY_COURSES_STYLES, MY_COURSES_MESSAGES } from '../../constants/myCoursesConstants.jsx'

const MyCoursesHeader = () => {
  return (
    <div className={MY_COURSES_STYLES.header.container}>
      <h1 className={MY_COURSES_STYLES.header.title}>
        {MY_COURSES_MESSAGES.header.title}
      </h1>
      <p className={MY_COURSES_STYLES.header.subtitle}>
        {MY_COURSES_MESSAGES.header.subtitle}
      </p>
    </div>
  )
}

export default MyCoursesHeader