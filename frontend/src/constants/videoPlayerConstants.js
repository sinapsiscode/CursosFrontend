export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export const STUDY_TIME_INTERVAL = 60000 // 1 minuto en milisegundos
export const CONTROLS_HIDE_DELAY = 3000 // 3 segundos para ocultar controles

export const VIDEO_PLAYER_STYLES = {
  container: 'relative bg-black rounded-lg overflow-hidden group',
  video: 'w-full aspect-video',
  playOverlay: 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50',
  playButton: 'w-20 h-20 bg-accent rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors',
  playIcon: 'w-8 h-8 text-background ml-1',
  controls: 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300',
  controlsVisible: 'opacity-100',
  controlsHidden: 'opacity-0',
  progressBar: 'w-full h-2 bg-gray-700 rounded-full cursor-pointer',
  progressFill: 'h-full bg-accent rounded-full transition-all',
  controlsRow: 'flex items-center justify-between',
  leftControls: 'flex items-center space-x-4',
  rightControls: 'flex items-center space-x-4',
  controlButton: 'text-white hover:text-accent transition-colors',
  timeDisplay: 'text-white text-sm',
  speedButton: 'text-white hover:text-accent transition-colors text-sm',
  speedMenu: 'absolute bottom-full right-0 mb-2 bg-surface rounded-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity',
  speedOption: 'block w-full text-left px-3 py-1 text-sm rounded hover:bg-gray-700 transition-colors',
  speedOptionActive: 'text-accent',
  speedOptionInactive: 'text-white',
  volumeContainer: 'flex items-center space-x-2',
  volumeIcon: 'w-5 h-5 text-white',
  volumeSlider: 'w-20 accent-accent',
  lessonInfo: 'absolute top-4 left-4 bg-black bg-opacity-75 rounded-lg p-3',
  lessonTitle: 'text-white font-medium text-sm',
  courseTitle: 'text-gray-300 text-xs'
}

export const ICONS = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
  previousLesson: 'M6 6h2v12H6zm3.5 6l8.5 6V6z',
  nextLesson: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
  volume: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
}

export const DEFAULT_VALUES = {
  volume: 1,
  playbackRate: 1,
  defaultVideoSrc: '/demo-video.mp4'
}

export const ARIA_LABELS = {
  playPause: 'Reproducir/Pausar',
  previousLesson: 'Lección anterior',
  nextLesson: 'Siguiente lección',
  volume: 'Control de volumen',
  speed: 'Velocidad de reproducción',
  fullscreen: 'Pantalla completa',
  pictureInPicture: 'Picture in Picture',
  progressBar: 'Barra de progreso del video'
}