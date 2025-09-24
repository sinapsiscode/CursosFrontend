import { NAVBAR_STYLES, NAVBAR_ICONS } from '../../../constants/navbarConstants.jsx'
import { getUserAvatar, getUserName } from '../../../utils/navbarUtils'

const UserMenuButton = ({ user, showUserMenu, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={NAVBAR_STYLES.userButton}
    >
      <img
        src={getUserAvatar(user)}
        alt={getUserName(user)}
        className={NAVBAR_STYLES.avatar}
      />
      <span className={NAVBAR_STYLES.userName}>{getUserName(user)}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {NAVBAR_ICONS.chevronDown}
      </svg>
    </button>
  )
}

export default UserMenuButton