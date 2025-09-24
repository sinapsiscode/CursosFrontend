import { NAVBAR_STYLES, NAVBAR_TEXTS } from '../../../constants/navbarConstants.jsx'
import { useUserMenuActions } from '../../../hooks/useNavbar'
import { isAdmin } from '../../../utils/navbarUtils'
import UserMenuButton from './UserMenuButton'
import UserMenuDropdown from './UserMenuDropdown'

const UserMenu = ({ user, showUserMenu, onToggleMenu, navigateAndClose, handleLogout, onCloseMenu }) => {
  const menuActions = useUserMenuActions(navigateAndClose, handleLogout)

  return (
    <div className="relative">
      <UserMenuButton
        user={user}
        showUserMenu={showUserMenu}
        onToggle={onToggleMenu}
      />

      {showUserMenu && (
        <UserMenuDropdown
          user={user}
          menuActions={menuActions}
          onClose={onCloseMenu}
        />
      )}
    </div>
  )
}

export default UserMenu