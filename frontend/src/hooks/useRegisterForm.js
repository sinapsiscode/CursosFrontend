import { useState, useCallback } from 'react'
import { VALIDATION_RULES, FORM_INITIAL_STATE } from '../constants/authConstants'

export const useRegisterForm = () => {
  const [formData, setFormData] = useState(FORM_INITIAL_STATE.REGISTER)
  const [errors, setErrors] = useState({})

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_RULES.NAME.REQUIRED
    } else if (formData.name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
      newErrors.name = VALIDATION_RULES.NAME.MIN_LENGTH_ERROR
    }

    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_RULES.EMAIL.REQUIRED
    } else if (!VALIDATION_RULES.EMAIL.REGEX.test(formData.email)) {
      newErrors.email = VALIDATION_RULES.EMAIL.INVALID
    }

    if (!formData.password.trim()) {
      newErrors.password = VALIDATION_RULES.PASSWORD.REQUIRED
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      newErrors.password = VALIDATION_RULES.PASSWORD.MIN_LENGTH_ERROR
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = VALIDATION_RULES.CONFIRM_PASSWORD.REQUIRED
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_RULES.CONFIRM_PASSWORD.NO_MATCH
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  const resetForm = useCallback(() => {
    setFormData(FORM_INITIAL_STATE.REGISTER)
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    validateForm,
    handleChange,
    resetForm
  }
}