import { VIDEO_PLAYER_STYLES } from '../../../constants/videoPlayerConstants'
import ProgressBar from './ProgressBar'
import PlayPauseButton from './PlayPauseButton'
import LessonNavigationButtons from './LessonNavigationButtons'
import TimeDisplay from './TimeDisplay'
import SpeedControl from './SpeedControl'
import VolumeControl from './VolumeControl'
import PictureInPictureButton from './PictureInPictureButton'
import FullscreenButton from './FullscreenButton'

const VideoControls = ({
  showControls,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  hasPrevious,
  hasNext,
  onSeek,
  onTogglePlay,
  onPreviousLesson,
  onNextLesson,
  onVolumeChange,
  onPlaybackRateChange,
  onTogglePictureInPicture,
  onToggleFullscreen
}) => {
  const controlsClass = `${VIDEO_PLAYER_STYLES.controls} ${
    showControls || !isPlaying
      ? VIDEO_PLAYER_STYLES.controlsVisible
      : VIDEO_PLAYER_STYLES.controlsHidden
  }`

  return (
    <div className={controlsClass}>
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      <div className={VIDEO_PLAYER_STYLES.controlsRow}>
        <div className={VIDEO_PLAYER_STYLES.leftControls}>
          <PlayPauseButton
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
          />

          <LessonNavigationButtons
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPreviousLesson={onPreviousLesson}
            onNextLesson={onNextLesson}
          />

          <TimeDisplay
            currentTime={currentTime}
            duration={duration}
          />
        </div>

        <div className={VIDEO_PLAYER_STYLES.rightControls}>
          <SpeedControl
            playbackRate={playbackRate}
            onPlaybackRateChange={onPlaybackRateChange}
          />

          <VolumeControl
            volume={volume}
            onVolumeChange={onVolumeChange}
          />

          <PictureInPictureButton
            onTogglePictureInPicture={onTogglePictureInPicture}
          />

          <FullscreenButton
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>
      </div>
    </div>
  )
}

export default VideoControls