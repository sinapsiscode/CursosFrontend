import { VIDEO_PLAYER_STYLES, ICONS } from '../../../constants/videoPlayerConstants'

const PlayOverlay = ({ isPlaying, onTogglePlay }) => {
  if (isPlaying) return null

  return (
    <div className={VIDEO_PLAYER_STYLES.playOverlay}>
      <button
        onClick={onTogglePlay}
        className={VIDEO_PLAYER_STYLES.playButton}
        aria-label="Reproducir video"
      >
        <svg className={VIDEO_PLAYER_STYLES.playIcon} fill="currentColor" viewBox="0 0 24 24">
          <path d={ICONS.play} />
        </svg>
      </button>
    </div>
  )
}

export default PlayOverlay