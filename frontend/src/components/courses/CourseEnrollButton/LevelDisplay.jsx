import { ENROLLMENT_STYLES, ENROLLMENT_TEXTS } from '../../../constants/enrollmentConstants'

const LevelDisplay = ({ levelConfig }) => {
  return (
    <div className={ENROLLMENT_STYLES.levelSection}>
      <p className={ENROLLMENT_STYLES.levelLabel}>
        {ENROLLMENT_TEXTS.currentLevel}
      </p>
      <div className={ENROLLMENT_STYLES.levelContainer}>
        <span className={ENROLLMENT_STYLES.levelIcon}>
          {levelConfig.icon}
        </span>
        <span
          className={ENROLLMENT_STYLES.levelName}
          style={{ color: levelConfig.color }}
        >
          {levelConfig.name}
        </span>
      </div>
    </div>
  )
}

export default LevelDisplay