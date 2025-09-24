import { PROFILE_STYLES, PROFILE_MESSAGES } from '../../constants/profileConstants.jsx'
import PhotoCard from './PhotoCard'
import EmptyGallery from './EmptyGallery'

const PhotoGallery = ({ profilePhotos, onPhotoClick }) => {
  return (
    <div className={PROFILE_STYLES.gallery.section}>
      <h2 className={PROFILE_STYLES.gallery.title}>
        {PROFILE_MESSAGES.gallery.title}
      </h2>

      {profilePhotos && profilePhotos.length > 0 ? (
        <div className={PROFILE_STYLES.gallery.grid}>
          {profilePhotos.map((photo, index) => (
            <PhotoCard
              key={index}
              photo={photo}
              onClick={() => onPhotoClick(photo)}
            />
          ))}
        </div>
      ) : (
        <EmptyGallery />
      )}
    </div>
  )
}

export default PhotoGallery