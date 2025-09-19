import { VIDEO_PLAYER_STYLES, ARIA_LABELS } from '../../../constants/videoPlayerConstants'

const FullscreenButton = ({ onToggleFullscreen }) => {
  return (
    <button
      onClick={onToggleFullscreen}
      className={VIDEO_PLAYER_STYLES.controlButton}
      aria-label={ARIA_LABELS.fullscreen}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    </button>
  )
}

export default FullscreenButton