import { useVideoPlayer } from '../../hooks/useVideoPlayer'
import { VIDEO_PLAYER_STYLES } from '../../constants/videoPlayerConstants'
import VideoElement from './VideoPlayer/VideoElement'
import PlayOverlay from './VideoPlayer/PlayOverlay'
import VideoControls from './VideoPlayer/VideoControls'
import LessonInfo from './VideoPlayer/LessonInfo'

const VideoPlayer = ({
  course,
  lesson,
  onLessonComplete,
  onNextLesson,
  onPreviousLesson,
  hasNext = false,
  hasPrevious = false
}) => {
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    showControls,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleFullscreen,
    handlePictureInPicture,
    handleMouseMove
  } = useVideoPlayer(onLessonComplete)

  return (
    <div className={VIDEO_PLAYER_STYLES.container}>
      <VideoElement
        videoRef={videoRef}
        course={course}
        lesson={lesson}
        onMouseMove={handleMouseMove}
        onTogglePlay={togglePlay}
      />

      <PlayOverlay
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      <VideoControls
        showControls={showControls}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        playbackRate={playbackRate}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onSeek={handleSeek}
        onTogglePlay={togglePlay}
        onPreviousLesson={onPreviousLesson}
        onNextLesson={onNextLesson}
        onVolumeChange={handleVolumeChange}
        onPlaybackRateChange={handlePlaybackRateChange}
        onTogglePictureInPicture={handlePictureInPicture}
        onToggleFullscreen={handleFullscreen}
      />

      <LessonInfo
        lesson={lesson}
        course={course}
      />
    </div>
  )
}

export default VideoPlayer