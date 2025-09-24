import { EXAM_STYLES } from '../../constants/courseExamConstants.jsx'

const ExamProgressBar = ({ progress }) => {
  return (
    <div className="mb-6">
      <div className={EXAM_STYLES.content.progressBar}>
        <div
          className={EXAM_STYLES.content.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ExamProgressBar