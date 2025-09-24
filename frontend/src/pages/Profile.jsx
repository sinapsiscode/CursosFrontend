import { LoadingSpinner } from '../components/common'
import { useProfile } from '../hooks/useProfile'
import { PROFILE_STYLES } from '../constants/profileConstants.jsx'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileBanner from '../components/profile/ProfileBanner'
import WhatsAppButton from '../components/profile/WhatsAppButton'
import PhotoGallery from '../components/profile/PhotoGallery'
import PhotoModal from '../components/profile/PhotoModal'
import AuthMessage from '../components/profile/AuthMessage'

const Profile = () => {
  const {
    user,
    isAuthenticated,
    selectedArea,
    loading,
    selectedPhoto,
    profilePhotos,
    profileLinks,
    profileButtons,
    advertisingConfig,
    openPhotoModal,
    closePhotoModal,
    handleProUpgrade,
    handleWhatsAppClick,
    handleBannerClick,
    getAreaColors,
    getAreaName,
    formatPhotoDate
  } = useProfile()

  if (!isAuthenticated) {
    return <AuthMessage />
  }

  if (loading) {
    return (
      <div className={PROFILE_STYLES.loading.container}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const areaColors = getAreaColors()

  return (
    <div className={PROFILE_STYLES.container}>
      <div className={PROFILE_STYLES.maxWidth}>

        <ProfileHeader
          user={user}
          selectedArea={selectedArea}
          areaColors={areaColors}
          profileButtons={profileButtons}
          profileLinks={profileLinks}
          onProUpgrade={handleProUpgrade}
          getAreaName={getAreaName}
        />

        <ProfileBanner
          profileButtons={profileButtons}
          advertisingConfig={advertisingConfig}
          onBannerClick={handleBannerClick}
        />

        <WhatsAppButton
          profileButtons={profileButtons}
          onWhatsAppClick={handleWhatsAppClick}
        />

        <PhotoGallery
          profilePhotos={profilePhotos}
          onPhotoClick={openPhotoModal}
        />

        <PhotoModal
          photo={selectedPhoto}
          onClose={closePhotoModal}
          formatDate={formatPhotoDate}
        />

      </div>
    </div>
  )
}

export default Profile