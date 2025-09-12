import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore, useAdminStore } from '../../store'
import { loyaltyService } from '../../services/loyaltyService'
import { notificationService } from '../../services/notificationService'
import { whatsappService } from '../../services/whatsappService'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const CourseEnrollButton = ({ course, onEnroll }) => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { showToast, openModal } = useUIStore()
  const [enrolling, setEnrolling] = useState(false)
  const [showPriceDetails, setShowPriceDetails] = useState(false)
  const [hardcodedValues, setHardcodedValues] = useState(null)
  
  // Obtener configuración de WhatsApp del admin
  const whatsappConfig = whatsappService.getStoredConfig()

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
      }
    }
    loadHardcodedValues()
  }, [])

  // Calcular precio con descuento de nivel
  const priceDetails = isAuthenticated 
    ? loyaltyService.applyLevelDiscount(course.price || 0)
    : { originalPrice: course.price || 0, finalPrice: course.price || 0, discountPercentage: 0 }

  const loyaltyData = isAuthenticated ? loyaltyService.getUserPoints() : null
  const currentLevel = isAuthenticated ? loyaltyService.getCurrentLevel() : null
  const levelConfig = currentLevel ? loyaltyService.config.levels[currentLevel] : null

  const handleEnrollClick = async () => {
    // COMENTADO: Ya no usamos URL personalizada, siempre vamos a WhatsApp
    // if (course.enrollmentUrl) {
    //   window.open(course.enrollmentUrl, '_blank')
    //   return
    // }

    if (!isAuthenticated) {
      showToast('Debes iniciar sesión para adquirir el curso', 'info')
      openModal('login')
      return
    }

    // NUEVA FUNCIONALIDAD: Inscripción automática + WhatsApp
    await handleCompleteCoursePurchase()
  }

  const handleCompleteCoursePurchase = async () => {
    console.log('🚀 Iniciando proceso de adquisición del curso...')
    setEnrolling(true)
    
    try {
      // 1. Inscribir automáticamente al estudiante
      console.log('📝 Paso 1: Inscribiendo automáticamente...')
      await performAutoEnrollment()
      console.log('✅ Paso 1 completado: Inscripción automática')
      
      // 2. Construir mensaje personalizado para WhatsApp
      console.log('💬 Paso 2: Construyendo mensaje de WhatsApp...')
      const whatsappMessage = buildPurchaseWhatsAppMessage()
      console.log('✅ Paso 2 completado: Mensaje construido')
      
      // 3. Redirigir a WhatsApp
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
  }

  const performAutoEnrollment = async () => {
    // Simular inscripción
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // GUARDAR LA INSCRIPCIÓN automáticamente
    const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')
    
    // Verificar si ya está inscrito
    const existing = enrollments.find(e => e.courseId === course.id && e.userId === user.id)
    if (!existing) {
      const newEnrollment = {
        id: `enrollment_${Date.now()}`,
        courseId: course.id,
        userId: user.id,
        enrolledAt: new Date().toISOString(),
        status: 'pending_payment', // Estado especial para cursos que van a WhatsApp
        type: 'whatsapp_purchase',
        amount: priceDetails.finalPrice
      }
      enrollments.push(newEnrollment)
      localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
    }
    
    // Otorgar puntos automáticamente por la inscripción
    const coursePoints = course.points || 100 // Puntos base del curso
    await loyaltyService.addPoints(
      coursePoints,
      'courseEnrollment',
      `Inscripción en curso: ${course.title}`
    )
    
    // Crear notificación de inscripción con puntos
    notificationService.createNotification({
      type: 'success',
      title: '✅ Pre-inscripción Exitosa',
      message: `Te has pre-inscrito en ${course.title} y ganaste ${coursePoints} puntos. Completa el pago por WhatsApp.`,
      icon: '🎯',
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
      ],
      persistent: true
    })
  }

  const buildPurchaseWhatsAppMessage = () => {
    const userInfo = `*Solicitud de Inscripción - ${course.title}*\n\n`
    const courseInfo = `📚 *Curso:* ${course.title}\n` +
                      `🎯 *Área:* ${course.area}\n` +
                      `⭐ *Nivel:* ${course.level}\n` +
                      `💰 *Precio:* $${priceDetails.finalPrice.toFixed(2)}\n\n`
    
    const studentInfo = `👤 *Estudiante:*\n` +
                       `Nombre: ${user.name}\n` +
                       `Email: ${user.email}\n` +
                       `ID: ${user.id}\n\n`
    
    const actionInfo = `🚀 *Quiero adquirir este curso completo*\n` +
                      `Por favor, envíenme información sobre métodos de pago y acceso inmediato.\n\n` +
                      `Fecha de solicitud: ${new Date().toLocaleString('es-ES')}`
    
    return userInfo + courseInfo + studentInfo + actionInfo
  }

  const redirectToWhatsApp = async (message) => {
    // Usar el número de WhatsApp configurado en el admin
    const phoneNumber = whatsappConfig.phoneNumber || hardcodedValues?.contacts?.whatsappNumber || '+57 300 123 4567'
    
    // Crear link de WhatsApp
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    
    // Intentar abrir WhatsApp
    try {
      const newWindow = window.open(whatsappUrl, '_blank')
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Si el popup está bloqueado, mostrar modal
        whatsappService.showWhatsAppLinkModal(whatsappUrl, message)
      }
    } catch (error) {
      // Fallback: usar el servicio de WhatsApp
      await whatsappService.sendWhatsAppMessage(message)
    }
  }

  const handleFreeEnrollment = async () => {
    setEnrolling(true)
    
    try {
      // Simular inscripción
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // GUARDAR LA INSCRIPCIÓN REALMENTE en el formato correcto
      const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')
      
      // Verificar si ya está inscrito
      const existing = enrollments.find(e => e.courseId === course.id && e.userId === user.id)
      if (!existing) {
        const newEnrollment = {
          id: `enrollment_${Date.now()}`,
          courseId: course.id,
          userId: user.id,
          enrolledAt: new Date().toISOString(),
          status: 'active'
        }
        enrollments.push(newEnrollment)
        localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
      }
      
      // Agregar puntos por inscripción gratuita
      await loyaltyService.addPoints(
        50,
        'freeEnrollment',
        `Inscripción gratuita: ${course.title}`
      )

      showToast('¡Te has inscrito exitosamente!', 'success')
      
      // Notificar inscripción exitosa
      notificationService.createNotification({
        type: 'success',
        title: '¡Inscripción Exitosa!',
        message: `Te has inscrito en ${course.title}`,
        icon: '🎉',
        actions: [
          {
            label: 'Comenzar Curso',
            url: `/course/${course.id}/lesson/1`,
            icon: '▶️'
          }
        ],
        persistent: true
      })

      if (onEnroll) {
        onEnroll()
      }
    } catch (error) {
      showToast('Error al inscribirse', 'error')
    } finally {
      setEnrolling(false)
    }
  }

  const handlePaidEnrollment = async () => {
    setEnrolling(true)
    
    try {
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // GUARDAR LA INSCRIPCIÓN PAGADA en el formato correcto
      const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]')
      
      // Verificar si ya está inscrito
      const existing = enrollments.find(e => e.courseId === course.id && e.userId === user.id)
      if (!existing) {
        const newEnrollment = {
          id: `enrollment_${Date.now()}`,
          courseId: course.id,
          userId: user.id,
          enrolledAt: new Date().toISOString(),
          status: 'active',
          type: 'paid',
          amount: priceDetails.finalPrice
        }
        enrollments.push(newEnrollment)
        localStorage.setItem('student_enrollments', JSON.stringify(enrollments))
      }
      
      // Agregar puntos por compra
      const pointsResult = await loyaltyService.addPointsForPurchase(
        priceDetails.finalPrice,
        course.id,
        course.title
      )

      showToast(`¡Compra exitosa! +${pointsResult.transaction.amount} puntos ganados`, 'success')
      
      // Verificar si subió de nivel
      if (pointsResult.levelChanged) {
        setTimeout(() => {
          notificationService.showAchievement({
            title: `¡Nuevo Nivel: ${pointsResult.newLevel}!`,
            description: 'Has desbloqueado nuevos beneficios',
            icon: '🎊'
          })
        }, 2000)
      }

      // Notificar compra exitosa
      notificationService.createNotification({
        type: 'success',
        title: '¡Compra Exitosa!',
        message: `Has adquirido ${course.title}`,
        icon: '🛒',
        actions: [
          {
            label: 'Comenzar Curso',
            url: `/course/${course.id}/lesson/1`,
            icon: '▶️'
          },
          {
            label: 'Ver Factura',
            url: `/profile/purchases/${course.id}`,
            icon: '📄'
          }
        ],
        persistent: true
      })

      setShowPriceDetails(false)
      
      if (onEnroll) {
        onEnroll()
      }
    } catch (error) {
      showToast('Error al procesar el pago', 'error')
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <>
      <button
        onClick={handleEnrollClick}
        disabled={enrolling}
        className="bg-accent text-background px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enrolling ? (
          <span className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        ) : (
          'Adquirir curso completo'
        )}
      </button>

      {/* Modal de detalles de precio */}
      {showPriceDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Detalles de Compra</h3>
            
            {/* Información del curso */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-white mb-2">{course.title}</h4>
              <p className="text-sm text-gray-400">{course.lessons?.length || 0} lecciones • {course.duration}</p>
            </div>

            {/* Desglose de precio */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Precio original</span>
                <span>${priceDetails.originalPrice.toFixed(2)}</span>
              </div>
              
              {priceDetails.discountPercentage > 0 && (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Descuento nivel {levelConfig.name}</span>
                    <span>-{priceDetails.discountPercentage}%</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 flex justify-between">
                    <span className="font-medium text-white">Total a pagar</span>
                    <span className="text-xl font-bold text-white">
                      ${priceDetails.finalPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Puntos a ganar */}
            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Puntos a ganar</span>
                <span className="text-xl font-bold text-purple-400">
                  +{Math.floor(priceDetails.finalPrice * 10)} pts
                </span>
              </div>
            </div>

            {/* Tu nivel actual */}
            {levelConfig && (
              <div className="text-center mb-6">
                <p className="text-xs text-gray-400 mb-1">Tu nivel actual</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">{levelConfig.icon}</span>
                  <span className="font-medium" style={{ color: levelConfig.color }}>
                    {levelConfig.name}
                  </span>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPriceDetails(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePaidEnrollment}
                disabled={enrolling}
                className="flex-1 bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {enrolling ? 'Procesando...' : 'Confirmar Compra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CourseEnrollButton