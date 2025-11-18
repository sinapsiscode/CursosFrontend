import { useState, useEffect } from 'react'
import { useAdminStore, useUIStore } from '../../store'
import { samplePhotos, initialFormState } from '../../data/adminPhotos'

/**
 * Hook for managing photo CRUD operations
 */
export const usePhotoManagement = () => {
  const {
    profilePhotos,
    addProfilePhoto,
    updateProfilePhoto,
    deleteProfilePhoto,
  } = useAdminStore()
  const { showToast } = useUIStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [formData, setFormData] = useState(initialFormState.photo)

  useEffect(() => {
    loadProfilePhotos()
  }, [])

  const loadProfilePhotos = () => {
    try {
      const storedPhotos = JSON.parse(localStorage.getItem('profile_photos') || '[]')
      if (storedPhotos.length > 0 && profilePhotos.length === 0) {
        useAdminStore.getState().setProfilePhotos(storedPhotos)
      } else if (storedPhotos.length === 0 && profilePhotos.length === 0) {
        useAdminStore.getState().setProfilePhotos(samplePhotos)
        localStorage.setItem('profile_photos', JSON.stringify(samplePhotos))
        console.log('📸 Fotos de muestra inicializadas')
      }
    } catch (error) {
      console.error('Error loading profile photos from localStorage:', error)
    }
  }

  const savePhotosToStorage = (photos) => {
    try {
      localStorage.setItem('profile_photos', JSON.stringify(photos))
    } catch (error) {
      console.error('Error saving profile photos to localStorage:', error)
    }
  }

  const resetForm = () => {
    setFormData(initialFormState.photo)
    setEditingPhoto(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      showToast('El título es obligatorio', 'error')
      return
    }

    if (!formData.imageUrl.trim()) {
      showToast('La URL de la imagen es obligatoria', 'error')
      return
    }

    try {
      if (editingPhoto) {
        updateProfilePhoto(editingPhoto.id, formData)
        const updatedPhotos = useAdminStore.getState().profilePhotos
        savePhotosToStorage(updatedPhotos)
        showToast('Foto actualizada exitosamente', 'success')
        console.log('📸 Foto actualizada:', formData.title)
      } else {
        addProfilePhoto(formData)
        const updatedPhotos = useAdminStore.getState().profilePhotos
        savePhotosToStorage(updatedPhotos)
        showToast('Foto agregada exitosamente', 'success')
        console.log('📸 Nueva foto agregada:', formData.title)
      }

      resetForm()
      setShowAddModal(false)
    } catch (error) {
      console.error('Error saving photo:', error)
      showToast('Error al guardar la foto', 'error')
    }
  }

  const handleEdit = (photo) => {
    setEditingPhoto(photo)
    setFormData({
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.imageUrl,
      date: photo.date || '',
      active: photo.active !== false
    })
    setShowAddModal(true)
  }

  const handleDelete = (photoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      deleteProfilePhoto(photoId)
      const updatedPhotos = useAdminStore.getState().profilePhotos
      savePhotosToStorage(updatedPhotos)
      showToast('Foto eliminada exitosamente', 'success')
      console.log('🗑️ Foto eliminada con ID:', photoId)
    }
  }

  const togglePhotoStatus = (photo) => {
    updateProfilePhoto(photo.id, { active: !photo.active })
    const updatedPhotos = useAdminStore.getState().profilePhotos
    savePhotosToStorage(updatedPhotos)
    showToast(
      `Foto ${photo.active ? 'desactivada' : 'activada'} exitosamente`,
      'success'
    )
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  return {
    // State
    profilePhotos,
    showAddModal,
    setShowAddModal,
    editingPhoto,
    formData,
    setFormData,

    // Actions
    handleSubmit,
    handleEdit,
    handleDelete,
    togglePhotoStatus,
    handleCloseModal,
  }
}
