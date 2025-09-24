import { LEARNING_PATHS_STYLES, LEARNING_PATHS_MESSAGES } from '../../constants/learningPathsConstants.jsx'

const LearningPathsHeader = () => {
  return (
    <div className={LEARNING_PATHS_STYLES.header.container}>
      <h1 className={LEARNING_PATHS_STYLES.header.title}>
        {LEARNING_PATHS_MESSAGES.header.title}
      </h1>
      <p className={LEARNING_PATHS_STYLES.header.subtitle}>
        {LEARNING_PATHS_MESSAGES.header.subtitle}
      </p>
    </div>
  )
}

export default LearningPathsHeader