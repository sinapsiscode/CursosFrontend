import { VIDEO_PLAYER_STYLES, ARIA_LABELS } from '../../../constants/videoPlayerConstants'

const PictureInPictureButton = ({ onTogglePictureInPicture }) => {
  return (
    <button
      onClick={onTogglePictureInPicture}
      className={VIDEO_PLAYER_STYLES.controlButton}
      aria-label={ARIA_LABELS.pictureInPicture}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4z"
        />
      </svg>
    </button>
  )
}

export default PictureInPictureButton