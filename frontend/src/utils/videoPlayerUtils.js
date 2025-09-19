export const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const calculateProgress = (currentTime, duration) => {
  if (!duration || duration === 0) return 0
  return (currentTime / duration) * 100
}

export const calculateSeekTime = (event, duration) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  return pos * duration
}

export const toggleFullscreen = (element, setIsFullscreen) => {
  if (!document.fullscreenElement) {
    element?.requestFullscreen()
    setIsFullscreen(true)
  } else {
    document.exitFullscreen()
    setIsFullscreen(false)
  }
}

export const togglePictureInPicture = async (videoElement, isPictureInPicture, setIsPictureInPicture) => {
  if (!isPictureInPicture) {
    try {
      await videoElement?.requestPictureInPicture()
      setIsPictureInPicture(true)
    } catch (error) {
      console.error('Picture-in-Picture not supported:', error)
    }
  } else {
    document.exitPictureInPicture()
    setIsPictureInPicture(false)
  }
}

export const setupVideoEventListeners = (video, handlers) => {
  if (!video) return () => {}

  const {
    onTimeUpdate,
    onDurationChange,
    onPlay,
    onPause,
    onEnded
  } = handlers

  video.addEventListener('timeupdate', onTimeUpdate)
  video.addEventListener('durationchange', onDurationChange)
  video.addEventListener('play', onPlay)
  video.addEventListener('pause', onPause)
  video.addEventListener('ended', onEnded)

  return () => {
    video.removeEventListener('timeupdate', onTimeUpdate)
    video.removeEventListener('durationchange', onDurationChange)
    video.removeEventListener('play', onPlay)
    video.removeEventListener('pause', onPause)
    video.removeEventListener('ended', onEnded)
  }
}

export const handleControlsVisibility = (
  isPlaying,
  setShowControls,
  controlsTimeout,
  setControlsTimeout,
  hideDelay = 3000
) => {
  setShowControls(true)

  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }

  const timeout = setTimeout(() => {
    if (isPlaying) {
      setShowControls(false)
    }
  }, hideDelay)

  setControlsTimeout(timeout)
}

export const getVideoSource = (lesson, defaultSrc) => {
  return lesson?.videoUrl || defaultSrc
}