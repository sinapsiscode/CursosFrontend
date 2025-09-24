import { PROFILE_STYLES } from '../../constants/profileConstants.jsx'

const PhotoModal = ({ photo, onClose, formatDate }) => {
  if (!photo) return null

  return (
    <div className={PROFILE_STYLES.modal.backdrop} onClick={onClose}>
      <div className={PROFILE_STYLES.modal.container} onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className={PROFILE_STYLES.modal.header}>
          <h3 className={PROFILE_STYLES.modal.title}>{photo.title}</h3>
          <button
            onClick={onClose}
            className={PROFILE_STYLES.modal.closeButton}
          >
            <svg className={PROFILE_STYLES.modal.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Imagen */}
        <div className={PROFILE_STYLES.modal.content}>
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className={PROFILE_STYLES.modal.image}
          />

          {/* Descripción */}
          {photo.description && (
            <div className={PROFILE_STYLES.modal.description}>
              <p className={PROFILE_STYLES.modal.descriptionText}>{photo.description}</p>
            </div>
          )}

          {/* Fecha si existe */}
          {photo.date && (
            <div className={PROFILE_STYLES.modal.date}>
              <span className={PROFILE_STYLES.modal.dateText}>
                📅 {formatDate(photo.date)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhotoModal