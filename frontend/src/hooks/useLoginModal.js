import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUIStore } from '../store'
import { LOGIN_MESSAGES, DEMO_PASSWORD } from '../constants/authConstants'
import { isAdmin } from '../constants/roleIds'

export const useLoginModal = (validateForm, resetForm, setFormValues) => {
  const { login } = useAuth()
  const { closeModal, showToast } = useUIStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (e, formData) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)

      const result = await login(formData.email, formData.password)

      if (result.success) {
        closeModal('login')
        showToast(LOGIN_MESSAGES.SUCCESS(result.usuario.nombre), 'success')
        resetForm()

        // Redirigir según el rol del usuario
        const targetRoute = isAdmin(result.usuario.rolId) ? '/admin' : '/home'

        setTimeout(() => {
          navigate(targetRoute)
        }, 100)
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || error.message || LOGIN_MESSAGES.ERROR
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [validateForm, resetForm, login, closeModal, showToast, navigate])

  const handleClose = useCallback(() => {
    closeModal('login')
    resetForm()
  }, [closeModal, resetForm])

  const handleQuickLogin = useCallback(async (userEmail, userPassword) => {
    // Usar la contraseña del usuario específico
    const password = userPassword || DEMO_PASSWORD

    setFormValues({
      email: userEmail,
      password: password
    })

    // Automatically submit after setting demo data
    setTimeout(() => {
      const mockEvent = { preventDefault: () => {} }
      const formData = { email: userEmail, password: password }
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
    isLoading
  }
}