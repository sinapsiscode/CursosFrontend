import { VIDEO_PLAYER_STYLES, ARIA_LABELS } from '../../../constants/videoPlayerConstants'
import { calculateProgress } from '../../../utils/videoPlayerUtils'

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const progressPercentage = calculateProgress(currentTime, duration)

  return (
    <div className="mb-4">
      <div
        className={VIDEO_PLAYER_STYLES.progressBar}
        onClick={onSeek}
        role="slider"
        aria-label={ARIA_LABELS.progressBar}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progressPercentage}
      >
        <div
          className={VIDEO_PLAYER_STYLES.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar