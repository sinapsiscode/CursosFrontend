import { PROFILE_STYLES, PROFILE_MESSAGES } from '../../constants/profileConstants.jsx'

const PhotoCard = ({ photo, onClick }) => {
  return (
    <div className={PROFILE_STYLES.gallery.card} onClick={onClick}>
      <img
        src={photo.imageUrl}
        alt={photo.title}
        className={PROFILE_STYLES.gallery.image}
      />
      <div className={PROFILE_STYLES.gallery.overlay}>
        <div className={PROFILE_STYLES.gallery.overlayContent}>
          <div className={PROFILE_STYLES.gallery.overlayIcon}>
            <svg className={PROFILE_STYLES.gallery.overlayIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
          <p className={PROFILE_STYLES.gallery.overlayText}>
            {PROFILE_MESSAGES.gallery.viewDetails}
          </p>
        </div>
      </div>

      {/* Overlay con información */}
      <div className={PROFILE_STYLES.gallery.infoOverlay}>
        <h3 className={PROFILE_STYLES.gallery.infoTitle}>{photo.title}</h3>
        {photo.description && (
          <p className={PROFILE_STYLES.gallery.infoDescription}>{photo.description}</p>
        )}
      </div>
    </div>
  )
}

export default PhotoCard