import { NAVBAR_STYLES, LOGO_CONFIG } from '../../../constants/navbarConstants.jsx'
import { getAreaColorClass, capitalizeArea } from '../../../utils/navbarUtils'

const NavbarLogo = ({ selectedArea }) => {
  return (
    <div className={NAVBAR_STYLES.logoSection}>
      <div className={NAVBAR_STYLES.logoContainer}>
        <div className="flex items-center gap-3">
          {/* Logo imagen */}
          <img
            src="/logo.png"
            alt="METSEL Logo"
            className="h-10 w-10 object-contain rounded-lg"
          />
          {/* Texto de marca */}
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