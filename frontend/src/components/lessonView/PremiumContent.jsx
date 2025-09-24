import { LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'

const PremiumContent = ({ onNavigateToCourse }) => {
  return (
    <div className={LESSON_VIEW_STYLES.premium.container}>
      <div className={LESSON_VIEW_STYLES.premium.content}>
        <div className={LESSON_VIEW_STYLES.premium.icon}>🔒</div>
        <h2 className={LESSON_VIEW_STYLES.premium.title}>
          {LESSON_VIEW_MESSAGES.premium.title}
        </h2>
        <p className={LESSON_VIEW_STYLES.premium.subtitle}>
          {LESSON_VIEW_MESSAGES.premium.subtitle}
        </p>
        <button
          onClick={onNavigateToCourse}
          className={LESSON_VIEW_STYLES.premium.button}
        >
          {LESSON_VIEW_MESSAGES.premium.backButton}
        </button>
      </div>
    </div>
  )
}

export default PremiumContent