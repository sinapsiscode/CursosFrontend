import { STUDENT_AREAS } from '../constants/studentManagerConstants'

export const getStudentStats = (students) => {
  const total = students.length
  const byArea = STUDENT_AREAS.map(area => ({
    ...area,
    count: students.filter(s => s.area === area.value).length
  }))
  const active = students.filter(s => !s.suspended).length
  const suspended = students.filter(s => s.suspended).length

  return {
    total,
    active,
    suspended,
    byArea
  }
}

export const filterStudents = (students, searchTerm) => {
  if (!searchTerm.trim()) return students

  const term = searchTerm.toLowerCase()
  return students.filter(student =>
    student.name.toLowerCase().includes(term) ||
    student.email.toLowerCase().includes(term) ||
    student.area.toLowerCase().includes(term) ||
    (student.dni && student.dni.includes(term)) ||
    (student.university && student.university.toLowerCase().includes(term)) ||
    (student.career && student.career.toLowerCase().includes(term))
  )
}

export const formatStudentData = (student) => ({
  ...student,
  displayName: student.name || 'Sin nombre',
  displayEmail: student.email || 'Sin email',
  displayArea: STUDENT_AREAS.find(a => a.value === student.area)?.label || student.area,
  displayPhone: student.phone || 'No registrado',
  displayDni: student.dni || 'No registrado',
  displayUniversity: student.university || 'No registrada',
  displayCareer: student.career || 'No registrada'
})

export const validateStudentForm = (formData) => {
  const errors = {}

  // Campos obligatorios
  if (!formData.name.trim()) {
    errors.name = 'El nombre es obligatorio'
  }

  if (!formData.email.trim()) {
    errors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Ingresa un email válido'
  }

  if (!formData.area) {
    errors.area = 'Selecciona un área de estudio'
  }

  // Campos opcionales con validaciones
  if (formData.dni && !/^\d{8}$/.test(formData.dni)) {
    errors.dni = 'El DNI debe tener exactamente 8 números'
  }

  if (formData.phone && !/^9\d{8}$/.test(formData.phone)) {
    errors.phone = 'El teléfono debe tener 9 números y empezar con 9'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const getEmptyFormData = () => ({
  name: '',
  email: '',
  phone: '',
  area: '',
  dni: '',
  university: '',
  career: ''
})

export const prepareStudentForEdit = (student) => ({
  name: student.name || '',
  email: student.email || '',
  phone: student.phone || '',
  area: student.area || '',
  dni: student.dni || '',
  university: student.university || '',
  career: student.career || ''
})