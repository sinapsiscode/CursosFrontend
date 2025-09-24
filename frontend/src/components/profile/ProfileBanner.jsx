import { PROFILE_STYLES, PROFILE_MESSAGES } from '../../constants/profileConstants.jsx'

const ProfileBanner = ({
  profileButtons,
  advertisingConfig,
  onBannerClick
}) => {
  if (profileButtons?.showBanner === false) {
    return null
  }

  return (
    <div className={PROFILE_STYLES.banner.container}>
      <div className={PROFILE_STYLES.banner.wrapper}>
        <div className={PROFILE_STYLES.banner.content}>
          <div className={PROFILE_STYLES.banner.icon}>
            <span className={PROFILE_STYLES.banner.iconEmoji}>🎓</span>
          </div>
          <div className={PROFILE_STYLES.banner.textSection}>
            <h3 className={PROFILE_STYLES.banner.title}>
              {advertisingConfig?.bannerTitle || PROFILE_MESSAGES.banner.defaultTitle}
            </h3>
            <p className={PROFILE_STYLES.banner.subtitle}>
              {PROFILE_MESSAGES.banner.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onBannerClick}
          className={PROFILE_STYLES.banner.button}
        >
          {profileButtons?.bannerButtonText || PROFILE_MESSAGES.banner.defaultButton}
        </button>
      </div>
    </div>
  )
}

export default ProfileBanner