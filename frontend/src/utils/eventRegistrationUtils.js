import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants/eventRegistrationConstants'

export const validateRegistrationForm = (formData) => {
  const errors = {}

  if (!formData.firstName.trim()) {
    errors.firstName = ERROR_MESSAGES.firstNameRequired
  }

  if (!formData.lastName.trim()) {
    errors.lastName = ERROR_MESSAGES.lastNameRequired
  }

  if (!formData.email.trim()) {
    errors.email = ERROR_MESSAGES.emailRequired
  } else if (!VALIDATION_RULES.emailRegex.test(formData.email)) {
    errors.email = ERROR_MESSAGES.emailInvalid
  }

  if (!formData.phone.trim()) {
    errors.phone = ERROR_MESSAGES.phoneRequired
  } else if (!VALIDATION_RULES.phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = ERROR_MESSAGES.phoneInvalid
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

export const createRegistrationData = (formData, user, isAuthenticated) => {
  return {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    phone: formData.phone,
    userId: isAuthenticated ? user?.id : null,
    registeredAt: new Date().toISOString()
  }
}

export const formatEventDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getInputClassName = (hasError, isReadonly = false) => {
  let className = 'w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent'

  if (hasError) {
    className += ' border-red-500'
  } else {
    className += ' border-gray-600'
  }

  if (isReadonly) {
    className += ' opacity-75 cursor-not-allowed'
  }

  return className
}