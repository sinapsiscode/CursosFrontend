import { PROFILE_STYLES, PROFILE_MESSAGES } from '../../constants/profileConstants.jsx'

const AuthMessage = () => {
  return (
    <div className={PROFILE_STYLES.authMessage.container}>
      <div className={PROFILE_STYLES.authMessage.content}>
        <h2 className={PROFILE_STYLES.authMessage.title}>
          {PROFILE_MESSAGES.auth.loginRequired}
        </h2>
        <button className={PROFILE_STYLES.authMessage.button}>
          {PROFILE_MESSAGES.auth.loginButton}
        </button>
      </div>
    </div>
  )
}

export default AuthMessage