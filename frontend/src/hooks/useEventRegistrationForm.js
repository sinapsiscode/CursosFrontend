import { useState } from 'react'
import { useAuthStore, useUIStore } from '../store'
import { eventService } from '../services/eventService'
import {
  validateRegistrationForm,
  createRegistrationData
} from '../utils/eventRegistrationUtils'
import {
  INITIAL_FORM_DATA,
  SUCCESS_MESSAGES
} from '../constants/eventRegistrationConstants'

export const useEventRegistrationForm = (event, onSuccess, onClose) => {
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useUIStore()

  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    email: isAuthenticated ? user?.email || '' : ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateRegistrationForm(formData)
    setErrors(validation.errors)

    if (!validation.isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      const registrationData = createRegistrationData(formData, user, isAuthenticated)
      const result = await eventService.registerForEvent(event.id, registrationData)

      if (result.success) {
        showToast(SUCCESS_MESSAGES.registration, 'success')
        onSuccess()
        onClose()
      } else {
        showToast(result.error || SUCCESS_MESSAGES.generalError, 'error')
      }
    } catch (error) {
      showToast(SUCCESS_MESSAGES.generalError, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    isAuthenticated,
    handleChange,
    handleSubmit
  }
}