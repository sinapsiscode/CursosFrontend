import { LEARNING_PATHS_STYLES, LEARNING_PATHS_MESSAGES } from '../../constants/learningPathsConstants.jsx'

const AuthRequired = ({ onNavigateToLogin }) => {
  return (
    <div className={LEARNING_PATHS_STYLES.auth.container}>
      <div className={LEARNING_PATHS_STYLES.auth.card}>
        <div className={LEARNING_PATHS_STYLES.auth.icon}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className={LEARNING_PATHS_STYLES.auth.title}>
          {LEARNING_PATHS_MESSAGES.auth.title}
        </h2>
        <p className={LEARNING_PATHS_STYLES.auth.subtitle}>
          {LEARNING_PATHS_MESSAGES.auth.subtitle}
        </p>
        <button
          onClick={onNavigateToLogin}
          className={LEARNING_PATHS_STYLES.auth.button}
        >
          {LEARNING_PATHS_MESSAGES.auth.loginButton}
        </button>
      </div>
    </div>
  )
}

export default AuthRequired