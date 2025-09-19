import { VIDEO_PLAYER_STYLES } from '../../../constants/videoPlayerConstants'
import { formatTime } from '../../../utils/videoPlayerUtils'

const TimeDisplay = ({ currentTime, duration }) => {
  return (
    <div className={VIDEO_PLAYER_STYLES.timeDisplay}>
      {formatTime(currentTime)} / {formatTime(duration)}
    </div>
  )
}

export default TimeDisplay