import {
  usePhotoManagement,
  useProfileLinks,
  useProfileButtons,
  useAdvertisingConfig
} from '../../hooks/adminPhotos'
import {
  PhotoHeader,
  PhotoStats,
  PhotoGrid,
  PhotoForm,
  LinksModal,
  ButtonsModal,
  AdvertisingModal
} from '../../components/AdminPhotos'

const AdminPhotos = () => {
  const photoManagement = usePhotoManagement()
  const profileLinks = useProfileLinks()
  const profileButtons = useProfileButtons()
  const advertisingConfig = useAdvertisingConfig()

  return (
    <div className="space-y-6">
      <PhotoHeader
        onConfigAdvertising={advertisingConfig.handleOpenAdvertisingModal}
        onConfigLinks={profileLinks.handleOpenLinksModal}
        onConfigButtons={profileButtons.handleOpenButtonsModal}
        onAddPhoto={() => photoManagement.setShowAddModal(true)}
      />

      <PhotoStats photos={photoManagement.profilePhotos} />

      <PhotoGrid
        photos={photoManagement.profilePhotos}
        onEdit={photoManagement.handleEdit}
        onDelete={photoManagement.handleDelete}
        onToggleStatus={photoManagement.togglePhotoStatus}
        onAddPhoto={() => photoManagement.setShowAddModal(true)}
      />

      <PhotoForm
        show={photoManagement.showAddModal}
        editingPhoto={photoManagement.editingPhoto}
        formData={photoManagement.formData}
        setFormData={photoManagement.setFormData}
        onSubmit={photoManagement.handleSubmit}
        onClose={photoManagement.handleCloseModal}
      />

      <LinksModal
        show={profileLinks.showLinksModal}
        formData={profileLinks.linksFormData}
        setFormData={profileLinks.setLinksFormData}
        onSubmit={profileLinks.handleSaveLinks}
        onClose={() => profileLinks.setShowLinksModal(false)}
      />

      <ButtonsModal
        show={profileButtons.showButtonsModal}
        formData={profileButtons.buttonsFormData}
        setFormData={profileButtons.setButtonsFormData}
        onSubmit={profileButtons.handleSaveButtons}
        onClose={() => profileButtons.setShowButtonsModal(false)}
      />

      <AdvertisingModal
        show={advertisingConfig.showAdvertisingModal}
        formData={advertisingConfig.advertisingFormData}
        setFormData={advertisingConfig.setAdvertisingFormData}
        onSubmit={advertisingConfig.handleSaveAdvertising}
        onClose={() => advertisingConfig.setShowAdvertisingModal(false)}
      />
    </div>
  )
}

export default AdminPhotos
