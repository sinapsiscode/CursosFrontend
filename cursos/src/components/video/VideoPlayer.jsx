import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui'

const VideoPlayer = ({ 
  src, 
  poster, 
  onProgress, 
  onComplete, 
  onTimeUpdate,
  autoplay = false,
  nextLesson = null,
  previousLesson = null,
  lessonTitle = ''
}) => {
  const videoRef = useRef(null)
  const progressBarRef = useRef(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPiP, setIsPiP] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const [hasWatched75, setHasWatched75] = useState(false)
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const updateTime = () => {
      setCurrentTime(video.currentTime)
      
      // Track progress
      const progress = (video.currentTime / video.duration) * 100
      if (onProgress) onProgress(progress)
      
      // Mark as complete at 75%
      if (progress >= 75 && !hasWatched75) {
        setHasWatched75(true)
        if (onComplete) onComplete()
      }
      
      if (onTimeUpdate) onTimeUpdate(video.currentTime)
    }
    
    const updateBuffer = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferedProgress = (bufferedEnd / video.duration) * 100
        setBuffered(bufferedProgress)
      }
    }
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
      if (nextLesson) {
        setTimeout(() => {
          if (window.confirm('¿Continuar con la siguiente lección?')) {
            nextLesson()
          }
        }, 1000)
      }
    }
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('progress', updateBuffer)
    
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('progress', updateBuffer)
    }
  }, [onProgress, onComplete, onTimeUpdate, nextLesson, hasWatched75])
  
  useEffect(() => {
    let timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 3000)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])
  
  const togglePlay = () => {
    const video = videoRef.current
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleProgressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const video = videoRef.current
    video.currentTime = pos * video.duration
  }
  
  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    videoRef.current.volume = value
    setIsMuted(value === 0)
  }
  
  const toggleMute = () => {
    const video = videoRef.current
    if (isMuted) {
      video.volume = volume || 0.5
      setVolume(volume || 0.5)
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }
  
  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % rates.length
    const newRate = rates[nextIndex]
    setPlaybackRate(newRate)
    videoRef.current.playbackRate = newRate
  }
  
  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }
  
  const togglePiP = async () => {
    const video = videoRef.current
    try {
      if (!isPiP) {
        await video.requestPictureInPicture()
        setIsPiP(true)
      } else {
        await document.exitPictureInPicture()
        setIsPiP(false)
      }
    } catch (error) {
      console.error('PiP error:', error)
    }
  }
  
  const skip = (seconds) => {
    videoRef.current.currentTime += seconds
  }
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  const progressPercentage = (currentTime / duration) * 100 || 0

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
      />
      
      {/* Overlay Controls */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg font-semibold">{lessonTitle}</h3>
        </div>
        
        {/* Center Controls */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {/* Previous */}
            {previousLesson && (
              <button
                onClick={previousLesson}
                className="text-white hover:scale-110 transition-transform"
                title="Lección anterior"
              >
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
            )}
            
            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="text-white hover:scale-110 transition-transform"
              title="Retroceder 10s"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute -mt-6 text-xs">-10</span>
            </button>
            
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 backdrop-blur-sm transition-all hover:scale-110"
            >
              {isPlaying ? (
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="text-white hover:scale-110 transition-transform"
              title="Adelantar 10s"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute -mt-6 text-xs">+10</span>
            </button>
            
            {/* Next */}
            {nextLesson && (
              <button
                onClick={nextLesson}
                className="text-white hover:scale-110 transition-transform"
                title="Siguiente lección"
              >
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            ref={progressBarRef}
            className="relative h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
            onClick={handleProgressClick}
          >
            {/* Buffered */}
            <div 
              className="absolute h-full bg-white/20 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Progress */}
            <div 
              className="absolute h-full bg-accent rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Scrubber */}
            <div 
              className="absolute w-3 h-3 bg-white rounded-full -mt-1"
              style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-accent">
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
              
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white hover:text-accent">
                  {isMuted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-accent"
                />
              </div>
              
              {/* Time */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <button
                onClick={changePlaybackRate}
                className="text-white hover:text-accent text-sm font-medium"
              >
                {playbackRate}x
              </button>
              
              {/* PiP */}
              <button
                onClick={togglePiP}
                className="text-white hover:text-accent"
                title="Picture in Picture"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                </svg>
              </button>
              
              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-accent"
                title="Pantalla completa"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer