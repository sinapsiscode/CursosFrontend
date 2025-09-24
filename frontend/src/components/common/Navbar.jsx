import { NAVBAR_STYLES } from '../../constants/navbarConstants.jsx'
import { useNavbar } from '../../hooks/useNavbar'
import NavbarLogo from './Navbar/NavbarLogo'
import NavbarSearch from './Navbar/NavbarSearch'
import NavbarUserSection from './Navbar/NavbarUserSection'

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    selectedArea,
    searchQuery,
    showUserMenu,
    setSearchQuery,
    handleSearch,
    toggleUserMenu,
    closeUserMenu,
    navigateAndClose,
    handleLogout,
    handleLogin,
    handleRegister
  } = useNavbar()

  return (
    <nav className={NAVBAR_STYLES.nav}>
      <div className={NAVBAR_STYLES.container}>
        <div className={NAVBAR_STYLES.content}>
          <NavbarLogo selectedArea={selectedArea} />

          <NavbarSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />

          <NavbarUserSection
            isAuthenticated={isAuthenticated}
            user={user}
            showUserMenu={showUserMenu}
            onToggleUserMenu={toggleUserMenu}
            navigateAndClose={navigateAndClose}
            handleLogout={handleLogout}
            onCloseUserMenu={closeUserMenu}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        </div>
      </div>

      {showUserMenu && (
        <div
          className={NAVBAR_STYLES.overlay}
          onClick={closeUserMenu}
        />
      )}
    </nav>
  )
}

export default Navbar