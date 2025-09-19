import { NAVBAR_STYLES, NAVBAR_TEXTS } from '../../../constants/navbarConstants'
import { isAdmin } from '../../../utils/navbarUtils'

const UserMenuDropdown = ({ user, menuActions }) => {
  const menuItems = [
    { key: 'profile', label: NAVBAR_TEXTS.userMenuItems.profile, action: menuActions.profile },
    { key: 'courses', label: NAVBAR_TEXTS.userMenuItems.courses, action: menuActions.courses },
    { key: 'certificates', label: NAVBAR_TEXTS.userMenuItems.certificates, action: menuActions.certificates },
    { key: 'loyalty', label: NAVBAR_TEXTS.userMenuItems.loyalty, action: menuActions.loyalty }
  ]

  return (
    <div className={NAVBAR_STYLES.userMenu}>
      {menuItems.map(item => (
        <button
          key={item.key}
          onClick={item.action}
          className={NAVBAR_STYLES.menuItem}
        >
          {item.label}
        </button>
      ))}

      {isAdmin(user) && (
        <>
          <hr className={NAVBAR_STYLES.menuDivider} />
          <button
            onClick={menuActions.admin}
            className={NAVBAR_STYLES.menuItem}
          >
            {NAVBAR_TEXTS.userMenuItems.admin}
          </button>
        </>
      )}

      <hr className={NAVBAR_STYLES.menuDivider} />
      <button
        onClick={menuActions.logout}
        className={NAVBAR_STYLES.menuItem}
      >
        {NAVBAR_TEXTS.userMenuItems.logout}
      </button>
    </div>
  )
}

export default UserMenuDropdown