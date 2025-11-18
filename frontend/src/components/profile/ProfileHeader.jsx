import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  // Debug: ver qué datos tiene el usuario
  console.log('👤 ProfileHeader - Datos del usuario:', {
    id: user?.id,
    nombre: user?.nombre,
    email: user?.email,
    avatar: user?.avatar,
    hasAvatar: !!user?.avatar
  })

  return (
    <div className={`${PROFILE_STYLES.header.container} relative`}>
      {/* Botón de Configuración */}
      <button
        onClick={() => navigate('/profile/settings')}
        className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600 z-10"
        title="Configuración del perfil"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <div className={PROFILE_STYLES.header.wrapper}>
        {/* Avatar del usuario */}
        <div className={PROFILE_STYLES.header.logoContainer}>
          <div className="w-32 h-32 rounded-full border-4 border-accent overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.nombre || user?.name || 'Usuario'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || user?.name || 'Usuario')}&background=random&size=128`
                }}
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || user?.name || 'Usuario')}&background=random&size=128`}
                alt={user?.nombre || user?.name || 'Usuario'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Info del usuario */}
        <div className={PROFILE_STYLES.header.infoSection}>
          <h1 className={PROFILE_STYLES.header.name}>
            {user?.nombre || user?.name || PROFILE_MESSAGES.header.defaultName}
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