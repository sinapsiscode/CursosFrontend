import { PROFILE_STYLES, PROFILE_MESSAGES } from '../../constants/profileConstants.jsx'

const EmptyGallery = () => {
  return (
    <div className={PROFILE_STYLES.gallery.empty.container}>
      <div className={PROFILE_STYLES.gallery.empty.icon}>
        {PROFILE_MESSAGES.gallery.empty.icon}
      </div>
      <h3 className={PROFILE_STYLES.gallery.empty.title}>
        {PROFILE_MESSAGES.gallery.empty.title}
      </h3>
      <p className={PROFILE_STYLES.gallery.empty.subtitle}>
        {PROFILE_MESSAGES.gallery.empty.subtitle}
      </p>
    </div>
  )
}

export default EmptyGallery