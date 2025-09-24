import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const useStudentManager = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    dni: '',
    university: '',
    career: ''
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const allStudents = await apiService.getStudents()
      setStudents(allStudents)
    } catch (error) {
      console.error('Error loading students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const validateField = (field, value) => {
    const errors = { ...validationErrors }

    switch (field) {
      case 'dni':
        if (value && !/^\d{8}$/.test(value)) {
          errors.dni = 'El DNI debe tener exactamente 8 números'
        } else {
          delete errors.dni
        }
        break

      case 'phone':
        if (value && !/^9\d{8}$/.test(value)) {
          errors.phone = 'El teléfono debe tener 9 números y empezar con 9'
        } else {
          delete errors.phone
        }
        break

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Ingresa un email válido'
        } else {
          delete errors.email
        }
        break

      case 'name':
        if (!value.trim()) {
          errors.name = 'El nombre es obligatorio'
        } else {
          delete errors.name
        }
        break

      case 'area':
        if (!value) {
          errors.area = 'Selecciona un área de estudio'
        } else {
          delete errors.area
        }
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar todos los campos
    const fieldsToValidate = ['name', 'email', 'area']
    if (formData.dni) fieldsToValidate.push('dni')
    if (formData.phone) fieldsToValidate.push('phone')

    let hasErrors = false
    fieldsToValidate.forEach(field => {
      if (!validateField(field, formData[field])) {
        hasErrors = true
      }
    })

    if (hasErrors) {
      showNotification('Por favor corrige los errores en el formulario', 'error')
      return
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.area) {
      showNotification('Por favor completa los campos obligatorios: Nombre, Email y Área', 'error')
      return
    }

    try {
      if (editingStudent) {
        await apiService.updateStudent(editingStudent.id, formData)
        showNotification('✅ Estudiante actualizado correctamente', 'success')
      } else {
        await apiService.createStudent(formData)
        showNotification('✅ Estudiante creado correctamente', 'success')
      }

      await loadStudents()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving student:', error)
      showNotification(`Error: ${error.message}`, 'error')
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      area: student.area || '',
      dni: student.dni || '',
      university: student.university || '',
      career: student.career || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (student) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al estudiante "${student.name}"?\n\nEsto también eliminará todas sus inscripciones.`)) {
      try {
        await apiService.deleteStudent(student.id)
        await loadStudents()
        showNotification('✅ Estudiante eliminado correctamente', 'success')
      } catch (error) {
        console.error('Error deleting student:', error)
        showNotification(`Error: ${error.message}`, 'error')
      }
    }
  }

  const handleSuspendToggle = async (student) => {
    const action = student.suspended ? 'reactivar' : 'suspender'
    if (window.confirm(`¿Estás seguro de que quieres ${action} al estudiante "${student.name}"?`)) {
      try {
        await apiService.toggleStudentSuspension(student.id)
        await loadStudents()
        const actionComplete = student.suspended ? 'reactivado' : 'suspendido'
        showNotification(`✅ Estudiante ${actionComplete} correctamente`, 'success')
      } catch (error) {
        console.error('Error toggling suspension:', error)
        showNotification(`Error: ${error.message}`, 'error')
      }
    }
  }

  const handleCloseForm = () => {
    setShowCreateForm(false)
    setEditingStudent(null)
    setValidationErrors({})
    setFormData({
      name: '',
      email: '',
      phone: '',
      area: '',
      dni: '',
      university: '',
      career: ''
    })
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.area.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    // States
    students,
    loading,
    showCreateForm,
    editingStudent,
    searchTerm,
    formData,
    validationErrors,
    notification,
    filteredStudents,

    // Actions
    setShowCreateForm,
    setSearchTerm,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSuspendToggle,
    handleCloseForm,
    loadStudents
  }
}