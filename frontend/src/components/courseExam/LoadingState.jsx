import { EXAM_STYLES, EXAM_MESSAGES } from '../../constants/courseExamConstants.jsx'

const LoadingState = () => {
  return (
    <div className={EXAM_STYLES.container}>
      <div className="flex items-center justify-center">
        <div className="text-white">{EXAM_MESSAGES.loading}</div>
      </div>
    </div>
  )
}

export default LoadingState