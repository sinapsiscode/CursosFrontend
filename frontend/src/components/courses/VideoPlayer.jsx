import { useState, useRef, useEffect } from 'react'
import { useProgressStore } from '../../store'

const VideoPlayer = ({ 
  course, 
  lesson, 
  onLessonComplete,
  onNextLesson,
  onPreviousLesson,
  hasNext = false,
  hasPrevious = false 
}) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPictureInPicture, setIsPictureInPicture] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState(null)

  const { addStudyTime } = useProgressStore()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      if (onLessonComplete) {
        onLessonComplete()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onLessonComplete])

  useEffect(() => {
    // Agregar tiempo de estudio cada minuto
    const interval = setInterval(() => {
      if (isPlaying) {
        addStudyTime(1) // 1 minuto
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [isPlaying, addStudyTime])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const togglePictureInPicture = async () => {
    if (!isPictureInPicture) {
      try {
        await videoRef.current?.requestPictureInPicture()
        setIsPictureInPicture(true)
      } catch (error) {
        console.error('Picture-in-Picture not supported:', error)
      }
    } else {
      document.exitPictureInPicture()
      setIsPictureInPicture(false)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
    
    setControlsTimeout(timeout)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        onMouseMove={handleMouseMove}
        onClick={togglePlay}
        poster={course?.thumbnail}
      >
        {/* En una aplicación real, aquí iría la URL del video */}
        <source src={lesson?.videoUrl || '/demo-video.mp4'} type="video/mp4" />
        Tu navegador no soporta el elemento video.
      </video>

      {/* Overlay de carga/pausa */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-accent rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            <svg className="w-8 h-8 text-background ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Controles de video */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Barra de progreso */}
        <div className="mb-4">
          <div 
            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Controles izquierda */}
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-accent transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Lección anterior */}
            {hasPrevious && (
              <button
                onClick={onPreviousLesson}
                className="text-white hover:text-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
            )}

            {/* Siguiente lección */}
            {hasNext && (
              <button
                onClick={onNextLesson}
                className="text-white hover:text-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            )}

            {/* Tiempo */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Controles derecha */}
          <div className="flex items-center space-x-4">
            {/* Velocidad de reproducción */}
            <div className="relative group">
              <button className="text-white hover:text-accent transition-colors text-sm">
                {playbackRate}x
              </button>
              <div className="absolute bottom-full right-0 mb-2 bg-surface rounded-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <div className="space-y-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-gray-700 transition-colors ${
                        playbackRate === rate ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Volumen */}
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-accent"
              />
            </div>

            {/* Picture in Picture */}
            <button
              onClick={togglePictureInPicture}
              className="text-white hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4z" />
              </svg>
            </button>

            {/* Pantalla completa */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info de la lección */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 rounded-lg p-3">
        <h3 className="text-white font-medium text-sm">{lesson?.title}</h3>
        <p className="text-gray-300 text-xs">{course?.title}</p>
      </div>
    </div>
  )
}

export default VideoPlayer