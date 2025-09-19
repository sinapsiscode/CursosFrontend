import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUS,
  PRIORITY_LEVELS,
  TARGET_AUDIENCES,
  PANEL_TYPES,
  VIEW_MODES,
  NOTIFICATION_CONFIG,
  DEFAULT_TEMPLATES,
  TEMPLATE_VARIABLES
} from '../constants/notificationManagementConstants'

export const useNotificationManagement = () => {
  // ==========================================
  // ESTADO PRINCIPAL
  // ==========================================

  const [activePanel, setActivePanel] = useState(PANEL_TYPES.FORM)
  const [viewMode, setViewMode] = useState(VIEW_MODES.CREATE)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [testing, setTesting] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    type: NOTIFICATION_CONFIG.defaultType,
    priority: NOTIFICATION_CONFIG.defaultPriority,
    subject: '',
    message: '',
    targetAudience: NOTIFICATION_CONFIG.defaultAudience,
    courseId: '',
    scheduledFor: '',
    channels: [...NOTIFICATION_CONFIG.defaultChannels],
    variables: {}
  })

  // Estado para testing
  const [testData, setTestData] = useState({
    email: '',
    whatsapp: '',
    results: null
  })

  // Estado de datos
  const [notifications, setNotifications] = useState([])
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [errors, setErrors] = useState({})

  // ==========================================
  // EFECTOS
  // ==========================================

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  // Auto-refresh para historial
  useEffect(() => {
    if (activePanel === PANEL_TYPES.HISTORY) {
      const interval = setInterval(() => {
        loadNotifications()
      }, NOTIFICATION_CONFIG.historyRefreshInterval * 1000)

      return () => clearInterval(interval)
    }
  }, [activePanel])

  // Aplicar template por defecto cuando cambia el tipo
  useEffect(() => {
    if (formData.type && DEFAULT_TEMPLATES[formData.type]) {
      const template = DEFAULT_TEMPLATES[formData.type]
      setFormData(prev => ({
        ...prev,
        subject: prev.subject || template.subject,
        message: prev.message || template.message
      }))
    }
  }, [formData.type])

  // ==========================================
  // FUNCIONES DE CARGA DE DATOS
  // ==========================================

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadNotifications(),
        loadCourses(),
        loadStudents()
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadNotifications = useCallback(async () => {
    try {
      // Simular carga de notificaciones
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: 'Bienvenida React',
              type: NOTIFICATION_TYPES.ENROLLMENT,
              status: NOTIFICATION_STATUS.SENT,
              priority: PRIORITY_LEVELS.NORMAL,
              sentAt: new Date().toISOString(),
              recipientCount: 45
            }
          ])
        }, 500)
      })
      setNotifications(response)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }, [])

  const loadCourses = useCallback(async () => {
    try {
      // Simular carga de cursos
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { id: 1, title: 'React Fundamentals', area: 'Frontend' },
            { id: 2, title: 'Node.js Backend', area: 'Backend' },
            { id: 3, title: 'Full Stack Developer', area: 'Full Stack' }
          ])
        }, 300)
      })
      setCourses(response)
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }, [])

  const loadStudents = useCallback(async () => {
    try {
      // Simular carga de estudiantes
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
            { id: 2, name: 'María García', email: 'maria@example.com' }
          ])
        }, 300)
      })
      setStudents(response)
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }, [])

  // ==========================================
  // GESTIÓN DEL FORMULARIO
  // ==========================================

  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }, [errors])

  const toggleChannel = useCallback((channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      type: NOTIFICATION_CONFIG.defaultType,
      priority: NOTIFICATION_CONFIG.defaultPriority,
      subject: '',
      message: '',
      targetAudience: NOTIFICATION_CONFIG.defaultAudience,
      courseId: '',
      scheduledFor: '',
      channels: [...NOTIFICATION_CONFIG.defaultChannels],
      variables: {}
    })
    setErrors({})
  }, [])

  // ==========================================
  // VALIDACIÓN
  // ==========================================

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    } else if (formData.title.length > NOTIFICATION_CONFIG.maxTitleLength) {
      newErrors.title = `El título no puede exceder ${NOTIFICATION_CONFIG.maxTitleLength} caracteres`
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio'
    } else if (formData.subject.length > NOTIFICATION_CONFIG.maxSubjectLength) {
      newErrors.subject = `El asunto no puede exceder ${NOTIFICATION_CONFIG.maxSubjectLength} caracteres`
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio'
    } else if (formData.message.length > NOTIFICATION_CONFIG.maxMessageLength) {
      newErrors.message = `El mensaje no puede exceder ${NOTIFICATION_CONFIG.maxMessageLength} caracteres`
    }

    if (!formData.targetAudience) {
      newErrors.targetAudience = 'Debe seleccionar una audiencia'
    }

    if (formData.targetAudience === TARGET_AUDIENCES.COURSE_SPECIFIC && !formData.courseId) {
      newErrors.courseId = 'Debe seleccionar un curso'
    }

    if (formData.channels.length === 0) {
      newErrors.channels = 'Debe seleccionar al menos un canal'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // ==========================================
  // ACCIONES PRINCIPALES
  // ==========================================

  const saveNotification = useCallback(async () => {
    if (!validateForm()) return false

    setSaving(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newNotification = {
        ...formData,
        id: Date.now(),
        status: NOTIFICATION_STATUS.DRAFT,
        createdAt: new Date().toISOString()
      }

      setNotifications(prev => [newNotification, ...prev])
      return true
    } catch (error) {
      console.error('Error saving notification:', error)
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, validateForm])

  const sendNotification = useCallback(async () => {
    if (!validateForm()) return false

    setSending(true)
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newNotification = {
        ...formData,
        id: Date.now(),
        status: NOTIFICATION_STATUS.SENT,
        sentAt: new Date().toISOString(),
        recipientCount: getEstimatedRecipients()
      }

      setNotifications(prev => [newNotification, ...prev])
      resetForm()
      return true
    } catch (error) {
      console.error('Error sending notification:', error)
      return false
    } finally {
      setSending(false)
    }
  }, [formData, validateForm, resetForm])

  const scheduleNotification = useCallback(async () => {
    if (!validateForm() || !formData.scheduledFor) return false

    setSaving(true)
    try {
      // Simular programación
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newNotification = {
        ...formData,
        id: Date.now(),
        status: NOTIFICATION_STATUS.SCHEDULED,
        createdAt: new Date().toISOString()
      }

      setNotifications(prev => [newNotification, ...prev])
      return true
    } catch (error) {
      console.error('Error scheduling notification:', error)
      return false
    } finally {
      setSaving(false)
    }
  }, [formData, validateForm])

  // ==========================================
  // FUNCIONES DE TESTING
  // ==========================================

  const sendTestEmail = useCallback(async () => {
    if (!testData.email || !NOTIFICATION_CONFIG.emailPattern.test(testData.email)) {
      setTestData(prev => ({
        ...prev,
        results: { type: 'error', message: 'Email inválido' }
      }))
      return false
    }

    setTesting(true)
    try {
      // Simular envío de prueba
      await new Promise(resolve => setTimeout(resolve, 2000))

      setTestData(prev => ({
        ...prev,
        results: { type: 'success', message: 'Email de prueba enviado correctamente' }
      }))
      return true
    } catch (error) {
      setTestData(prev => ({
        ...prev,
        results: { type: 'error', message: 'Error al enviar email de prueba' }
      }))
      return false
    } finally {
      setTesting(false)
    }
  }, [testData.email])

  const sendTestWhatsApp = useCallback(async () => {
    if (!testData.whatsapp || !NOTIFICATION_CONFIG.phonePattern.test(testData.whatsapp)) {
      setTestData(prev => ({
        ...prev,
        results: { type: 'error', message: 'Número de WhatsApp inválido' }
      }))
      return false
    }

    setTesting(true)
    try {
      // Simular envío de prueba
      await new Promise(resolve => setTimeout(resolve, 2500))

      setTestData(prev => ({
        ...prev,
        results: { type: 'success', message: 'WhatsApp de prueba enviado correctamente' }
      }))
      return true
    } catch (error) {
      setTestData(prev => ({
        ...prev,
        results: { type: 'error', message: 'Error al enviar WhatsApp de prueba' }
      }))
      return false
    } finally {
      setTesting(false)
    }
  }, [testData.whatsapp])

  // ==========================================
  // UTILIDADES Y COMPUTADAS
  // ==========================================

  const getEstimatedRecipients = useCallback(() => {
    switch (formData.targetAudience) {
      case TARGET_AUDIENCES.ALL_USERS:
        return students.length * 2 // Simular más usuarios
      case TARGET_AUDIENCES.ENROLLED_STUDENTS:
        return students.length
      case TARGET_AUDIENCES.COURSE_SPECIFIC:
        return Math.floor(students.length * 0.3) // Simular 30% por curso
      case TARGET_AUDIENCES.INACTIVE_USERS:
        return Math.floor(students.length * 0.2) // Simular 20% inactivos
      case TARGET_AUDIENCES.VIP_USERS:
        return Math.floor(students.length * 0.1) // Simular 10% VIP
      default:
        return 0
    }
  }, [formData.targetAudience, students.length])

  const processedMessage = useMemo(() => {
    let message = formData.message

    // Reemplazar variables del template
    Object.entries(TEMPLATE_VARIABLES.student).forEach(([key, variable]) => {
      message = message.replace(variable, `[${key}]`)
    })

    Object.entries(TEMPLATE_VARIABLES.course).forEach(([key, variable]) => {
      message = message.replace(variable, `[${key}]`)
    })

    Object.entries(TEMPLATE_VARIABLES.system).forEach(([key, variable]) => {
      message = message.replace(variable, `[${key}]`)
    })

    return message
  }, [formData.message])

  const processedSubject = useMemo(() => {
    let subject = formData.subject

    // Reemplazar variables del template
    Object.entries(TEMPLATE_VARIABLES.student).forEach(([key, variable]) => {
      subject = subject.replace(variable, `[${key}]`)
    })

    Object.entries(TEMPLATE_VARIABLES.course).forEach(([key, variable]) => {
      subject = subject.replace(variable, `[${key}]`)
    })

    Object.entries(TEMPLATE_VARIABLES.system).forEach(([key, variable]) => {
      subject = subject.replace(variable, `[${key}]`)
    })

    return subject
  }, [formData.subject])

  const selectedCourse = useMemo(() => {
    return courses.find(course => course.id.toString() === formData.courseId)
  }, [courses, formData.courseId])

  const isFormValid = useMemo(() => {
    return formData.title.trim() &&
           formData.subject.trim() &&
           formData.message.trim() &&
           formData.targetAudience &&
           formData.channels.length > 0 &&
           (formData.targetAudience !== TARGET_AUDIENCES.COURSE_SPECIFIC || formData.courseId)
  }, [formData])

  // ==========================================
  // NAVEGACIÓN ENTRE PANELES
  // ==========================================

  const changePanel = useCallback((panel) => {
    setActivePanel(panel)
    if (panel === PANEL_TYPES.HISTORY) {
      loadNotifications()
    }
  }, [loadNotifications])

  const updateTestField = useCallback((field, value) => {
    setTestData(prev => ({
      ...prev,
      [field]: value,
      results: null // Limpiar resultados previos
    }))
  }, [])

  // ==========================================
  // RETURN DEL HOOK
  // ==========================================

  return {
    // Estado
    activePanel,
    viewMode,
    loading,
    saving,
    sending,
    testing,
    formData,
    testData,
    notifications,
    courses,
    students,
    errors,

    // Datos computados
    processedMessage,
    processedSubject,
    selectedCourse,
    isFormValid,
    estimatedRecipients: getEstimatedRecipients(),

    // Acciones del formulario
    updateFormField,
    toggleChannel,
    resetForm,
    validateForm,

    // Acciones principales
    saveNotification,
    sendNotification,
    scheduleNotification,

    // Testing
    sendTestEmail,
    sendTestWhatsApp,
    updateTestField,

    // Navegación
    changePanel,
    setViewMode,

    // Utilidades
    loadNotifications,
    loadCourses,
    loadStudents
  }
}