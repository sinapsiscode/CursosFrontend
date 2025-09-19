import { VIDEO_PLAYER_STYLES, PLAYBACK_RATES, ARIA_LABELS } from '../../../constants/videoPlayerConstants'

const SpeedControl = ({ playbackRate, onPlaybackRateChange }) => {
  return (
    <div className="relative group">
      <button
        className={VIDEO_PLAYER_STYLES.speedButton}
        aria-label={ARIA_LABELS.speed}
      >
        {playbackRate}x
      </button>
      <div className={VIDEO_PLAYER_STYLES.speedMenu}>
        <div className="space-y-1">
          {PLAYBACK_RATES.map(rate => (
            <button
              key={rate}
              onClick={() => onPlaybackRateChange(rate)}
              className={`${VIDEO_PLAYER_STYLES.speedOption} ${
                playbackRate === rate
                  ? VIDEO_PLAYER_STYLES.speedOptionActive
                  : VIDEO_PLAYER_STYLES.speedOptionInactive
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpeedControl