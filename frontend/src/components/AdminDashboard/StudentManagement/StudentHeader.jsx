import {
  STUDENT_STYLES,
  STUDENT_LABELS
} from '../../../constants/studentManagementConstants.jsx'

const StudentHeader = () => {
  return (
    <div className={STUDENT_STYLES.header}>
      <h1 className={STUDENT_STYLES.title}>{STUDENT_LABELS.title}</h1>
      <p className={STUDENT_STYLES.subtitle}>
        {STUDENT_LABELS.subtitle}
      </p>
    </div>
  )
}

export default StudentHeader