import { useCallback } from 'react'
import { useAuthStore, useUIStore } from '../store'
import { apiService } from '../services/api'
import { whatsappService } from '../services/whatsappService'
import { REGISTER_MESSAGES } from '../constants/authConstants'

export const useRegisterModal = (validateForm, resetForm) => {
  const { login } = useAuthStore()
  const { closeModal, showToast, setLoading, isLoading } = useUIStore()

  const handleSubmit = useCallback(async (e, formData) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading('global', true)

      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        selectedArea: formData.selectedArea
      }

      const response = await apiService.register(userData)

      if (response.success) {
        login(response.user)
        closeModal('register')
        showToast(REGISTER_MESSAGES.SUCCESS(response.user.name), 'success')

        // WhatsApp Lead Generation
        whatsappService.triggerUserRegistration({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          selectedArea: response.user.selectedArea
        })

        resetForm()
      } else {
        showToast(response.error || REGISTER_MESSAGES.ERROR, 'error')
      }
    } catch (error) {
      console.error('Register error:', error)
      showToast(REGISTER_MESSAGES.CONNECTION_ERROR, 'error')
    } finally {
      setLoading('global', false)
    }
  }, [validateForm, resetForm, login, closeModal, showToast, setLoading])

  const handleClose = useCallback(() => {
    closeModal('register')
    resetForm()
  }, [closeModal, resetForm])

  const handleSwitchToLogin = useCallback(() => {
    closeModal('register')
    setTimeout(() => {
      useUIStore.getState().openModal('login')
    }, 100)
  }, [closeModal])

  return {
    handleSubmit,
    handleClose,
    handleSwitchToLogin,
    isLoading: isLoading('global')
  }
}