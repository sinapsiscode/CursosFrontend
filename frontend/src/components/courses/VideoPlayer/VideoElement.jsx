import { VIDEO_PLAYER_STYLES, DEFAULT_VALUES } from '../../../constants/videoPlayerConstants'
import { getVideoSource } from '../../../utils/videoPlayerUtils'

const VideoElement = ({ videoRef, course, lesson, onMouseMove, onTogglePlay }) => {
  const videoSrc = getVideoSource(lesson, DEFAULT_VALUES.defaultVideoSrc)

  return (
    <video
      ref={videoRef}
      className={VIDEO_PLAYER_STYLES.video}
      onMouseMove={onMouseMove}
      onClick={onTogglePlay}
      poster={course?.thumbnail}
    >
      <source src={videoSrc} type="video/mp4" />
      Tu navegador no soporta el elemento video.
    </video>
  )
}

export default VideoElement