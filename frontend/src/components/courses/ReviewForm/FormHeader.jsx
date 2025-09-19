import { FORM_LABELS, FORM_STYLES } from '../../../constants/reviewConstants'

const FormHeader = ({ courseTitle }) => {
  return (
    <div className={FORM_STYLES.header}>
      <h3 className={FORM_STYLES.title}>
        {FORM_LABELS.title}
      </h3>
      <p className={FORM_STYLES.subtitle}>
        {courseTitle}
      </p>
    </div>
  )
}

export default FormHeader