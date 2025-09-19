import { useAuthStore } from '../../../store'
import { EVENT_STYLES, EVENT_LABELS, ICON_PATHS } from '../../../constants/eventDetailConstants'

const RegistrationButton = ({ isRegistering, onRegister }) => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className={EVENT_STYLES.registrationSection}>
      <button
        onClick={onRegister}
        disabled={isRegistering || !isAuthenticated}
        className={EVENT_STYLES.registerButton}
      >
        {isRegistering ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{EVENT_LABELS.registering}</span>
          </>
        ) : !isAuthenticated ? (
          <span>{EVENT_LABELS.loginRequired}</span>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.register} />
            </svg>
            <span>{EVENT_LABELS.registerFree}</span>
          </>
        )}
      </button>
    </div>
  )
}

export default RegistrationButton