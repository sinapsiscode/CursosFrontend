import { useState, useRef, useEffect, useCallback } from 'react'
import { useProgressStore } from '../store'
import {
  setupVideoEventListeners,
  handleControlsVisibility,
  calculateSeekTime,
  toggleFullscreen,
  togglePictureInPicture
} from '../utils/videoPlayerUtils'
import {
  STUDY_TIME_INTERVAL,
  CONTROLS_HIDE_DELAY,
  DEFAULT_VALUES
} from '../constants/videoPlayerConstants'

export const useVideoPlayer = (onLessonComplete) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(DEFAULT_VALUES.volume)
  const [playbackRate, setPlaybackRate] = useState(DEFAULT_VALUES.playbackRate)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPictureInPicture, setIsPictureInPicture] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState(null)

  const { addStudyTime } = useProgressStore()

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }, [])

  const handleDurationChange = useCallback(() => {
    const video = videoRef.current
    if (video) {
      setDuration(video.duration)
    }
  }, [])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    if (onLessonComplete) {
      onLessonComplete()
    }
  }, [onLessonComplete])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const cleanup = setupVideoEventListeners(video, {
      onTimeUpdate: handleTimeUpdate,
      onDurationChange: handleDurationChange,
      onPlay: handlePlay,
      onPause: handlePause,
      onEnded: handleEnded
    })

    return cleanup
  }, [handleTimeUpdate, handleDurationChange, handlePlay, handlePause, handleEnded])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        addStudyTime(1)
      }
    }, STUDY_TIME_INTERVAL)

    return () => clearInterval(interval)
  }, [isPlaying, addStudyTime])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }, [isPlaying])

  const handleSeek = useCallback((e) => {
    const video = videoRef.current
    if (!video) return

    const seekTime = calculateSeekTime(e, duration)
    video.currentTime = seekTime
  }, [duration])

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }, [])

  const handlePlaybackRateChange = useCallback((rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }, [])

  const handleFullscreen = useCallback(() => {
    toggleFullscreen(videoRef.current, setIsFullscreen)
  }, [])

  const handlePictureInPicture = useCallback(() => {
    togglePictureInPicture(videoRef.current, isPictureInPicture, setIsPictureInPicture)
  }, [isPictureInPicture])

  const handleMouseMove = useCallback(() => {
    handleControlsVisibility(
      isPlaying,
      setShowControls,
      controlsTimeout,
      setControlsTimeout,
      CONTROLS_HIDE_DELAY
    )
  }, [isPlaying, controlsTimeout])

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isFullscreen,
    showControls,
    isPictureInPicture,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleFullscreen,
    handlePictureInPicture,
    handleMouseMove
  }
}