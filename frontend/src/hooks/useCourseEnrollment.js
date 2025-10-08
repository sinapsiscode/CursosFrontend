import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../store'
import { fidelizacionService as loyaltyService } from '../services/fidelizacionService'
import { notificationService } from '../services/notificationService'
import { whatsappService } from '../services/whatsappService'
import {
  ENROLLMENT_TYPES,
  ENROLLMENT_STATUS,
  POINTS_CONFIG,
  NOTIFICATION_CONFIGS
} from '../constants/enrollmentConstants'

export const useCourseEnrollment = (course, onEnroll) => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { showToast, openModal } = useUIStore()
  const [enrolling, setEnrolling] = useState(false)
  const [showPriceDetails, setShowPriceDetails] = useState(false)

  const whatsappConfig = whatsappService.getStoredConfig()

  const priceDetails = isAuthenticated
    ? loyaltyService.applyLevelDiscount(course.price || 0)
    : { originalPrice: course.price || 0, finalPrice: course.price || 0, discountPercentage: 0 }

  const loyaltyData = isAuthenticated ? loyaltyService.getUserPoints() : null
  const currentLevel = isAuthenticated ? loyaltyService.getCurrentLevel() : null
  const levelConfig = currentLevel ? loyaltyService.config.levels[currentLevel] : null

  const handleEnrollClick = useCallback(async () => {
    if (!isAuthenticated) {
      showToast('Debes iniciar sesión para adquirir el curso', 'info')
      openModal('login')
      return
    }

    await handleCompleteCoursePurchase()
  }, [isAuthenticated, showToast, openModal])

  const handleCompleteCoursePurchase = useCallback(async () => {
    console.log('🚀 Iniciando proceso de adquisición del curso...')
    setEnrolling(true)

    try {
      console.log('📝 Paso 1: Inscribiendo automáticamente...')
      await performAutoEnrollment()
      console.log('✅ Paso 1 completado: Inscripción automática')

      console.log('💬 Paso 2: Construyendo mensaje de WhatsApp...')
      const whatsappMessage = buildPurchaseWhatsAppMessage()
      console.log('✅ Paso 2 completado: Mensaje construido')

      console.log('📱 Paso 3: Redirigiendo a WhatsApp...')
      await redirectToWhatsApp(whatsappMessage)
      console.log('✅ Paso 3 completado: Redirección a WhatsApp')

      showToast('¡Inscripción exitosa! Te hemos redirigido a WhatsApp para completar el proceso', 'success')

      if (onEnroll) {
        console.log('🔄 Ejecutando callback onEnroll...')
        onEnroll()
      }

      console.log('✅ Proceso de adquisición completado exitosamente')
    } catch (error) {
      console.error('❌ Error en adquisición del curso:', error)
      showToast('Error al procesar la solicitud', 'error')
    } finally {
      setEnrolling(false)
    }
  }, [course, user, priceDetails, onEnroll, showToast])

  const performAutoEnrollment = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')

    const existing = enrollments.find(e => e.courseId === course.id && e.userId === user.id)
    if (!existing) {
      const newEnrollment = {
        id: `enrollment_${Date.now()}`,
        courseId: course.id,
        userId: user.id,
        enrolledAt: new Date().toISOString(),
        status: ENROLLMENT_STATUS.pending,
        type: ENROLLMENT_TYPES.whatsapp,
        amount: priceDetails.finalPrice
      }
      enrollments.push(newEnrollment)
      localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
    }

    const coursePoints = course.points || POINTS_CONFIG.courseEnrollment
    await loyaltyService.addPoints(
      coursePoints,
      'courseEnrollment',
      `Inscripción en curso: ${course.title}`
    )

    notificationService.createNotification({
      ...NOTIFICATION_CONFIGS.enrollment,
      message: `Te has pre-inscrito en ${course.title} y ganaste ${coursePoints} puntos. Completa el pago por WhatsApp.`,
      actions: [
        {
          label: 'Ver Mis Cursos',
          url: '/my-courses',
          icon: '📚'
        },
        {
          label: 'Rendir Examen',
          url: `/course/${course.id}`,
          icon: '📝'
        }
      ]
    })
  }, [course, user, priceDetails])

  const buildPurchaseWhatsAppMessage = useCallback(() => {
    const userInfo = `*Solicitud de Inscripción - ${course.title}*\n\n`
    const courseInfo = `📚 *Curso:* ${course.title}\n` +
                      `🎯 *Área:* ${course.area}\n` +
                      `⭐ *Nivel:* ${course.level}\n` +
                      `💰 *Gratis*\n\n`

    const studentInfo = `👤 *Estudiante:*\n` +
                       `Nombre: ${user.name}\n` +
                       `Email: ${user.email}\n` +
                       `ID: ${user.id}\n\n`

    const actionInfo = `🚀 *Quiero adquirir este curso completo*\n` +
                      `Por favor, envíenme información sobre métodos de pago y acceso inmediato.\n\n` +
                      `Fecha de solicitud: ${new Date().toLocaleString('es-ES')}`

    return userInfo + courseInfo + studentInfo + actionInfo
  }, [course, user, priceDetails])

  const redirectToWhatsApp = useCallback(async (message) => {
    const phoneNumber = whatsappConfig.phoneNumber || '+57 300 123 4567'
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`

    try {
      const newWindow = window.open(whatsappUrl, '_blank')

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        whatsappService.showWhatsAppLinkModal(whatsappUrl, message)
      }
    } catch (error) {
      await whatsappService.sendWhatsAppMessage(message)
    }
  }, [whatsappConfig])

  const togglePriceDetails = useCallback(() => {
    setShowPriceDetails(prev => !prev)
  }, [])

  return {
    enrolling,
    showPriceDetails,
    priceDetails,
    levelConfig,
    handleEnrollClick,
    togglePriceDetails,
    setShowPriceDetails
  }
}