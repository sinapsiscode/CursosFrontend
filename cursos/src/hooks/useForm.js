import { useState, useCallback } from 'react'

/**
 * Hook para manejar formularios con validación
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validar un campo individual
  const validateField = useCallback((name, value) => {
    if (!validationRules[name]) return ''

    const rules = validationRules[name]
    
    // Required validation
    if (rules.required && !value) {
      return rules.requiredMessage || 'Este campo es requerido'
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return rules.minLengthMessage || `Mínimo ${rules.minLength} caracteres`
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.maxLengthMessage || `Máximo ${rules.maxLength} caracteres`
    }

    // Email validation
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return rules.emailMessage || 'Email inválido'
      }
    }

    // Pattern validation
    if (rules.pattern && value) {
      if (!rules.pattern.test(value)) {
        return rules.patternMessage || 'Formato inválido'
      }
    }

    // Custom validation
    if (rules.validate) {
      return rules.validate(value, values) || ''
    }

    return ''
  }, [validationRules])

  // Validar todos los campos
  const validate = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField, validationRules])

  // Manejar cambio de campo
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }))

    // Validar si el campo ha sido tocado
    if (touched[name]) {
      const error = validateField(name, fieldValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }, [touched, validateField])

  // Manejar blur de campo
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, values[name])
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [values, validateField])

  // Manejar submit
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault()
    
    // Marcar todos los campos como tocados
    const allTouched = {}
    Object.keys(values).forEach(key => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // Validar
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
      // Reset form después de submit exitoso
      reset()
    } catch (error) {
      console.error('Error in form submission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate])

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Set field value
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }, [touched, validateField])

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
    validate
  }
}

export default useForm