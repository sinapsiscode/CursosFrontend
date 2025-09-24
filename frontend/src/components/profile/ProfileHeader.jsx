import { PROFILE_STYLES, PROFILE_MESSAGES, DEFAULT_URLS } from '../../constants/profileConstants.jsx'

const ProfileHeader = ({
  user,
  selectedArea,
  areaColors,
  profileButtons,
  profileLinks,
  onProUpgrade,
  getAreaName
}) => {
  return (
    <div className={PROFILE_STYLES.header.container}>
      <div className={PROFILE_STYLES.header.wrapper}>
        {/* Logo de la empresa */}
        <div className={PROFILE_STYLES.header.logoContainer}>
          <div className={PROFILE_STYLES.header.logo}>
            <img
              src={DEFAULT_URLS.logoImage}
              alt="Logo Empresa"
              className={PROFILE_STYLES.header.logoImage}
            />
          </div>
          <div className={`${PROFILE_STYLES.header.logoBadge} ${areaColors.bg}`}>
            🏢
          </div>
        </div>

        {/* Info del usuario */}
        <div className={PROFILE_STYLES.header.infoSection}>
          <h1 className={PROFILE_STYLES.header.name}>
            {user?.name || PROFILE_MESSAGES.header.defaultName}
          </h1>
          <p className={PROFILE_STYLES.header.email}>
            {user?.email || PROFILE_MESSAGES.header.defaultEmail}
          </p>

          <div className={PROFILE_STYLES.header.badges}>
            <div className={`${areaColors.bg} ${PROFILE_STYLES.header.areaBadge}`}>
              {getAreaName(selectedArea)}
            </div>

            {/* Botón Subir a Pro - condicional */}
            {profileButtons?.showProButton !== false && (
              <button
                onClick={onProUpgrade}
                className={PROFILE_STYLES.header.proButton}
              >
                <span>👑</span>
                <span>{profileButtons?.proButtonText || PROFILE_MESSAGES.header.proUpgradeButton}</span>
              </button>
            )}

            {/* Otros tipos de suscripción que no sean expert */}
            {user?.subscription?.type && user.subscription.type.toLowerCase() !== 'expert' && (
              <div className={PROFILE_STYLES.header.subscriptionBadge}>
                {user.subscription.type.toUpperCase()}
              </div>
            )}
          </div>

          {/* Información básica */}
          <div className={PROFILE_STYLES.header.areaInfo}>
            <div className={`${areaColors.bg} ${PROFILE_STYLES.header.areaInfoBadge}`}>
              {PROFILE_MESSAGES.header.areaPrefix} {getAreaName(selectedArea)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader