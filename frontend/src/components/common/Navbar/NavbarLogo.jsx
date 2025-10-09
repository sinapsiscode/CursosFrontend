import { NAVBAR_STYLES, LOGO_CONFIG } from '../../../constants/navbarConstants.jsx'
import { getAreaColorClass, capitalizeArea } from '../../../utils/navbarUtils'

const NavbarLogo = ({ selectedArea }) => {
  return (
    <div className={NAVBAR_STYLES.logoSection}>
      <div className={NAVBAR_STYLES.logoContainer}>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo imagen */}
          <img
            src="/logo.png"
            alt="CEOs UNI Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain rounded-lg flex-shrink-0"
          />
          {/* Texto de marca - más pequeño en móvil */}
          <span className={NAVBAR_STYLES.brandText}>{LOGO_CONFIG.brandName}</span>
        </div>
      </div>
      {selectedArea && (
        <div className={`${NAVBAR_STYLES.areaTag} ${getAreaColorClass(selectedArea)}`}>
          {capitalizeArea(selectedArea)}
        </div>
      )}
    </div>
  )
}

export default NavbarLogo