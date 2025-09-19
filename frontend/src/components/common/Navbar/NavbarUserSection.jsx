import { NAVBAR_STYLES } from '../../../constants/navbarConstants'
import NotificationCenter from '../NotificationCenter'
import UserMenu from './UserMenu'
import GuestButtons from './GuestButtons'

const NavbarUserSection = ({
  isAuthenticated,
  user,
  showUserMenu,
  onToggleUserMenu,
  navigateAndClose,
  handleLogout,
  onCloseUserMenu,
  onLogin,
  onRegister
}) => {
  return (
    <div className={NAVBAR_STYLES.userSection}>
      {isAuthenticated ? (
        <>
          <NotificationCenter />
          <UserMenu
            user={user}
            showUserMenu={showUserMenu}
            onToggleMenu={onToggleUserMenu}
            navigateAndClose={navigateAndClose}
            handleLogout={handleLogout}
            onCloseMenu={onCloseUserMenu}
          />
        </>
      ) : (
        <GuestButtons
          onLogin={onLogin}
          onRegister={onRegister}
        />
      )}
    </div>
  )
}

export default NavbarUserSection