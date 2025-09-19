import { VIDEO_PLAYER_STYLES, ICONS, ARIA_LABELS } from '../../../constants/videoPlayerConstants'

const PlayPauseButton = ({ isPlaying, onTogglePlay }) => {
  return (
    <button
      onClick={onTogglePlay}
      className={VIDEO_PLAYER_STYLES.controlButton}
      aria-label={ARIA_LABELS.playPause}
    >
      {isPlaying ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d={ICONS.pause} />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d={ICONS.play} />
        </svg>
      )}
    </button>
  )
}

export default PlayPauseButton