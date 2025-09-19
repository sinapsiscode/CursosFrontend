import { VIDEO_PLAYER_STYLES, ICONS, ARIA_LABELS } from '../../../constants/videoPlayerConstants'

const VolumeControl = ({ volume, onVolumeChange }) => {
  return (
    <div className={VIDEO_PLAYER_STYLES.volumeContainer}>
      <svg className={VIDEO_PLAYER_STYLES.volumeIcon} fill="currentColor" viewBox="0 0 24 24">
        <path d={ICONS.volume} />
      </svg>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={onVolumeChange}
        className={VIDEO_PLAYER_STYLES.volumeSlider}
        aria-label={ARIA_LABELS.volume}
      />
    </div>
  )
}

export default VolumeControl