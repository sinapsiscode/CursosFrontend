import { useCallback } from 'react'
import { useAuthStore, useUIStore } from '../store'
import { apiService } from '../services/api'
import { LOGIN_MESSAGES, DEMO_PASSWORD } from '../constants/authConstants'

export const useLoginModal = (validateForm, resetForm, setFormValues) => {
  const { login } = useAuthStore()
  const { closeModal, showToast, setLoading, isLoading } = useUIStore()

  const handleSubmit = useCallback(async (e, formData) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading('global', true)

      const response = await apiService.login(formData.email, formData.password)

      if (response.success) {
        login(response.user)
        closeModal('login')
        showToast(LOGIN_MESSAGES.SUCCESS(response.user.name), 'success')
        resetForm()
      } else {
        showToast(response.error || LOGIN_MESSAGES.ERROR, 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast(LOGIN_MESSAGES.CONNECTION_ERROR, 'error')
    } finally {
      setLoading('global', false)
    }
  }, [validateForm, resetForm, login, closeModal, showToast, setLoading])

  const handleClose = useCallback(() => {
    closeModal('login')
    resetForm()
  }, [closeModal, resetForm])

  const handleQuickLogin = useCallback(async (userEmail) => {
    setFormValues({
      email: userEmail,
      password: DEMO_PASSWORD
    })

    // Automatically submit after setting demo data
    setTimeout(() => {
      const mockEvent = { preventDefault: () => {} }
      const formData = { email: userEmail, password: DEMO_PASSWORD }
      handleSubmit(mockEvent, formData)
    }, 100)
  }, [setFormValues, handleSubmit])

  const handleSwitchToRegister = useCallback(() => {
    closeModal('login')
    setTimeout(() => {
      useUIStore.getState().openModal('register')
    }, 100)
  }, [closeModal])

  return {
    handleSubmit,
    handleClose,
    handleQuickLogin,
    handleSwitchToRegister,
    isLoading: isLoading('global')
  }
}