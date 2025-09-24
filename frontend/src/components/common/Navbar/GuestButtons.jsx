import { NAVBAR_STYLES, NAVBAR_TEXTS } from '../../../constants/navbarConstants.jsx'

const GuestButtons = ({ onLogin, onRegister }) => {
  return (
    <div className={NAVBAR_STYLES.guestButtons}>
      <button
        onClick={onLogin}
        className={NAVBAR_STYLES.loginButton}
      >
        {NAVBAR_TEXTS.guestButtons.login}
      </button>
      <button
        onClick={onRegister}
        className={NAVBAR_STYLES.registerButton}
      >
        {NAVBAR_TEXTS.guestButtons.register}
      </button>
    </div>
  )
}

export default GuestButtons