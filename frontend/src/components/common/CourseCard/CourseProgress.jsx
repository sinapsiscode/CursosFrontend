import { CARD_STYLES } from '../../../constants/courseConstants'

const CourseProgress = ({ progress }) => {
  if (!progress.percentage || progress.percentage <= 0) return null

  return (
    <div className={CARD_STYLES.progressContainer}>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">Progreso</span>
        <span className="text-accent">{progress.percentage}%</span>
      </div>
      <div className={CARD_STYLES.progressBar}>
        <div
          className={CARD_STYLES.progressFill}
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default CourseProgress