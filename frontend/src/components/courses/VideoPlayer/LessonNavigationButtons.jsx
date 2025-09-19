import { VIDEO_PLAYER_STYLES, ICONS, ARIA_LABELS } from '../../../constants/videoPlayerConstants'

const LessonNavigationButtons = ({
  hasPrevious,
  hasNext,
  onPreviousLesson,
  onNextLesson
}) => {
  return (
    <>
      {hasPrevious && (
        <button
          onClick={onPreviousLesson}
          className={VIDEO_PLAYER_STYLES.controlButton}
          aria-label={ARIA_LABELS.previousLesson}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d={ICONS.previousLesson} />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNextLesson}
          className={VIDEO_PLAYER_STYLES.controlButton}
          aria-label={ARIA_LABELS.nextLesson}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d={ICONS.nextLesson} />
          </svg>
        </button>
      )}
    </>
  )
}

export default LessonNavigationButtons