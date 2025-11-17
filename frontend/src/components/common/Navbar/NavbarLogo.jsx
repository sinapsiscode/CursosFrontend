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
            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain rounded-lg flex-shrink-0"
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