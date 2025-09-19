import { NAVBAR_STYLES, LOGO_CONFIG } from '../../../constants/navbarConstants'
import { getAreaColorClass, capitalizeArea } from '../../../utils/navbarUtils'

const NavbarLogo = ({ selectedArea }) => {
  return (
    <div className={NAVBAR_STYLES.logoSection}>
      <div className={NAVBAR_STYLES.logoContainer}>
        <div className={NAVBAR_STYLES.logoIcon}>
          <span className={NAVBAR_STYLES.logoText}>{LOGO_CONFIG.text}</span>
        </div>
        <span className={NAVBAR_STYLES.brandText}>{LOGO_CONFIG.brandName}</span>
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