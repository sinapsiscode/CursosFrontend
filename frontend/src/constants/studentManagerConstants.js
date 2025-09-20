export const STUDENT_AREAS = [
  { value: 'metalurgia', label: 'Metalurgia', color: 'bg-blue-500' },
  { value: 'mineria', label: 'Minería', color: 'bg-green-500' },
  { value: 'geologia', label: 'Geología', color: 'bg-orange-500' }
]

export const FORM_FIELDS = {
  name: {
    label: 'Nombre completo',
    type: 'text',
    required: true,
    placeholder: 'Ej: Juan Pérez'
  },
  email: {
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Ej: juan@ejemplo.com'
  },
  phone: {
    label: 'Teléfono',
    type: 'text',
    required: false,
    placeholder: 'Ej: 987654321'
  },
  area: {
    label: 'Área de estudio',
    type: 'select',
    required: true,
    options: STUDENT_AREAS
  },
  dni: {
    label: 'DNI',
    type: 'text',
    required: false,
    placeholder: 'Ej: 12345678'
  },
  university: {
    label: 'Universidad',
    type: 'text',
    required: false,
    placeholder: 'Ej: Universidad Nacional'
  },
  career: {
    label: 'Carrera',
    type: 'text',
    required: false,
    placeholder: 'Ej: Ingeniería de Minas'
  }
}

export const VALIDATION_RULES = {
  dni: {
    pattern: /^\d{8}$/,
    message: 'El DNI debe tener exactamente 8 números'
  },
  phone: {
    pattern: /^9\d{8}$/,
    message: 'El teléfono debe tener 9 números y empezar con 9'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingresa un email válido'
  }
}

export const getAreaColor = (area) => {
  const areaData = STUDENT_AREAS.find(a => a.value === area)
  return areaData ? areaData.color : 'bg-gray-500'
}