import { useState, useCallback } from 'react'
import { VALIDATION_RULES, FORM_INITIAL_STATE } from '../constants/authConstants'

export const useLoginForm = () => {
  const [formData, setFormData] = useState(FORM_INITIAL_STATE.LOGIN)
  const [errors, setErrors] = useState({})

  const validateForm = useCallback(() => {
    const newErrors = {}

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
    setFormData(FORM_INITIAL_STATE.LOGIN)
    setErrors({})
  }, [])

  const setFormValues = useCallback((values) => {
    setFormData(values)
  }, [])

  return {
    formData,
    errors,
    validateForm,
    handleChange,
    resetForm,
    setFormValues
  }
}