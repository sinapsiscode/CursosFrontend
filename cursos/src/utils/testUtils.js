// Utilidades para testing y validación
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 8
}

export const validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const sanitizeInput = (input) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  }
  const reg = /[&<>"'/]/ig
  return input.replace(reg, (match) => (map[match]))
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'Ha ocurrido un error inesperado'
}

export const isBusinessHours = () => {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  
  // Lunes a Viernes (1-5), 9am-6pm
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
    return true
  }
  
  // Sábados (6), 9am-1pm
  if (day === 6 && hour >= 9 && hour < 13) {
    return true
  }
  
  return false
}

export const calculateDiscount = (originalPrice, discountPercentage) => {
  const discount = (originalPrice * discountPercentage) / 100
  const finalPrice = originalPrice - discount
  return {
    discount: discount.toFixed(2),
    finalPrice: finalPrice.toFixed(2),
    savings: discount.toFixed(2)
  }
}

export const validateForm = (formData, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const value = formData[field]
    const fieldRules = rules[field]
    
    // Required validation
    if (fieldRules.required && !value) {
      errors[field] = `${fieldRules.label || field} es requerido`
      return
    }
    
    // Email validation
    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = 'Email inválido'
      return
    }
    
    // Phone validation
    if (fieldRules.phone && value && !validatePhone(value)) {
      errors[field] = 'Teléfono inválido'
      return
    }
    
    // Min length validation
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `Mínimo ${fieldRules.minLength} caracteres`
      return
    }
    
    // Max length validation
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = `Máximo ${fieldRules.maxLength} caracteres`
      return
    }
    
    // Custom validation
    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value, formData)
      if (customError) {
        errors[field] = customError
      }
    }
  })
  
  return errors
}

export const sortByProperty = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })
}

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) result[group] = []
    result[group].push(item)
    return result
  }, {})
}

export const paginate = (array, page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage
  const paginatedItems = array.slice(offset, offset + perPage)
  
  return {
    page,
    perPage,
    total: array.length,
    totalPages: Math.ceil(array.length / perPage),
    data: paginatedItems
  }
}

export const downloadJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const uploadFile = (file, allowedTypes = []) => {
  return new Promise((resolve, reject) => {
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      reject(new Error(`Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`))
      return
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      reject(new Error('El archivo excede el tamaño máximo de 5MB'))
      return
    }
    
    // Read file
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}

export const getRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
  const diff = new Date() - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (years > 0) return rtf.format(-years, 'year')
  if (months > 0) return rtf.format(-months, 'month')
  if (days > 0) return rtf.format(-days, 'day')
  if (hours > 0) return rtf.format(-hours, 'hour')
  if (minutes > 0) return rtf.format(-minutes, 'minute')
  return rtf.format(-seconds, 'second')
}