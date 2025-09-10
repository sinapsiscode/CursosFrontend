import apiClient from '../api/client'

/**
 * WhatsApp Service - Automatización completa de WhatsApp
 * CRÍTICO PARA CONVERSIÓN Y SEGUIMIENTO DE LEADS
 */
class WhatsAppService {
  constructor() {
    this.config = null
    this.queuedMessages = []
    this.isInitialized = false
  }

  /**
   * Inicializar servicio con configuración del backend
   */
  async initialize() {
    try {
      const config = await apiClient.get('/config')
      this.config = config.whatsapp
      this.isInitialized = true
      
      // Procesar mensajes en cola si hay
      if (this.queuedMessages.length > 0) {
        this.processQueuedMessages()
      }
    } catch (error) {
      console.error('Error initializing WhatsApp service:', error)
    }
  }

  /**
   * Procesar mensajes en cola
   */
  async processQueuedMessages() {
    const messages = [...this.queuedMessages]
    this.queuedMessages = []
    
    for (const message of messages) {
      await this.sendMessage(message)
    }
  }

  /**
   * Verificar si estamos en horario de atención
   */
  isBusinessHours() {
    if (!this.config?.businessHours) return true
    
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    
    const startHour = parseInt(this.config.businessHours.start.split(':')[0])
    const endHour = parseInt(this.config.businessHours.end.split(':')[0])
    
    const isWorkDay = this.config.businessHours.workDays.includes(currentDay)
    const isWorkHour = currentHour >= startHour && currentHour < endHour
    
    return isWorkDay && isWorkHour
  }

  /**
   * Formatear mensaje con template y variables
   */
  formatMessage(template, variables = {}) {
    let message = template
    
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      message = message.replace(regex, variables[key])
    })
    
    return message
  }

  /**
   * Generar link de WhatsApp
   */
  generateWhatsAppLink(phone, message) {
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  /**
   * Enviar mensaje de WhatsApp (simulado)
   */
  async sendMessage({ to, template, variables, type = 'auto' }) {
    if (!this.isInitialized) {
      this.queuedMessages.push({ to, template, variables, type })
      await this.initialize()
      return
    }

    if (!this.config?.enabled) {
      console.log('WhatsApp service is disabled')
      return
    }

    const message = this.formatMessage(template, variables)
    
    // Log del mensaje para desarrollo
    console.log('📱 WhatsApp Message:', {
      to,
      message,
      type,
      isBusinessHours: this.isBusinessHours()
    })

    // En producción, aquí se integraría con la API real de WhatsApp Business
    try {
      await apiClient.post('/api/whatsapp/messages', {
        to,
        message,
        type,
        timestamp: new Date().toISOString(),
        businessHours: this.isBusinessHours()
      })
      
      return {
        success: true,
        link: this.generateWhatsAppLink(to, message)
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * AUTOMATIZACIONES ESPECÍFICAS DEL NEGOCIO
   */

  /**
   * 1. Nuevo Lead Capturado
   */
  async notifyNewLead(lead) {
    if (!this.config?.templates?.newLead) return

    // Notificar al admin
    await this.sendMessage({
      to: this.config.phoneNumber,
      template: this.config.templates.newLead,
      variables: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        interestedIn: lead.interestedIn || 'General',
        area: lead.area || 'No especificada',
        source: lead.source || 'unknown'
      },
      type: 'admin_notification'
    })

    // Auto-respuesta al lead si está en horario
    if (this.isBusinessHours() && lead.preferredContact === 'whatsapp') {
      await this.sendWelcomeMessage(lead)
    }
  }

  /**
   * 2. Mensaje de Bienvenida
   */
  async sendWelcomeMessage(lead) {
    if (!this.config?.welcomeMessage) return

    await this.sendMessage({
      to: lead.phone,
      template: this.config.welcomeMessage,
      variables: {
        name: lead.name,
        area: lead.area || 'nuestros cursos'
      },
      type: 'welcome'
    })
  }

  /**
   * 3. Interés en Curso Específico
   */
  async sendCourseInterest(lead, courses) {
    if (!this.config?.templates?.courseInterest) return

    const courseList = courses.map(c => `• ${c.title} - ${c.price === 0 ? 'GRATIS' : `$${c.price}`}`).join('\n')

    await this.sendMessage({
      to: lead.phone,
      template: this.config.templates.courseInterest,
      variables: {
        name: lead.name,
        area: lead.area,
        courses: courseList
      },
      type: 'course_interest'
    })
  }

  /**
   * 4. Seguimiento Automático
   */
  async sendFollowUp(lead, course) {
    if (!this.config?.templates?.followUp) return

    await this.sendMessage({
      to: lead.phone,
      template: this.config.templates.followUp,
      variables: {
        name: lead.name,
        courseTitle: course.title
      },
      type: 'follow_up'
    })
  }

  /**
   * 5. Promoción con Descuento
   */
  async sendPromotion(lead, promotion) {
    if (!this.config?.templates?.promotion) return

    await this.sendMessage({
      to: lead.phone,
      template: this.config.templates.promotion,
      variables: {
        name: lead.name,
        discountPercentage: promotion.discount,
        courseTitle: promotion.courseTitle,
        validUntil: new Date(promotion.validUntil).toLocaleDateString('es-ES'),
        finalPrice: promotion.finalPrice,
        code: promotion.code
      },
      type: 'promotion'
    })
  }

  /**
   * 6. Resultado de Examen con Descuento
   */
  async sendExamResults(lead, examResults) {
    const template = `🎉 *¡Felicitaciones ${lead.name}!*

Has completado el examen de diagnóstico con éxito:

📊 *Puntuación:* ${examResults.totalPoints} puntos
🎁 *Descuento Ganado:* ${examResults.discount}%
💰 *Código:* EXAM${examResults.discount}${Date.now().toString().slice(-4)}

${examResults.message}

¿Te gustaría que un asesor te ayude a elegir el curso ideal para ti?

Responde *SI* para agendar una llamada gratuita.`

    await this.sendMessage({
      to: lead.phone,
      template,
      variables: {},
      type: 'exam_results'
    })
  }

  /**
   * 7. Recordatorio de Carrito Abandonado
   */
  async sendCartReminder(user, course) {
    const template = `Hola ${user.name} 👋

Notamos que estuviste viendo el curso:
*${course.title}*

🎓 Este curso tiene:
• ${course.studentsCount} estudiantes satisfechos
• ⭐ ${course.rating}/5 de calificación
• 🏆 ${course.points} puntos de recompensa

¿Necesitas ayuda para inscribirte?
Solo responde a este mensaje y te asistiremos.`

    await this.sendMessage({
      to: user.phone,
      template,
      variables: {},
      type: 'cart_reminder'
    })
  }

  /**
   * 8. Certificado Disponible
   */
  async sendCertificateReady(user, course) {
    const template = `🎊 *¡Felicitaciones ${user.name}!*

Tu certificado del curso *${course.title}* está listo.

📜 Puedes descargarlo desde tu panel de estudiante.
🔗 Link: ${window.location.origin}/certificates

¡Compártelo en LinkedIn y etiquétanos!
#MetSelAcademy #${course.area}`

    await this.sendMessage({
      to: user.phone,
      template,
      variables: {},
      type: 'certificate_ready'
    })
  }

  /**
   * 9. Nuevo Curso Disponible
   */
  async notifyNewCourse(users, course) {
    const template = `🆕 *Nuevo Curso Disponible*

*${course.title}*
${course.description}

👨‍🏫 Instructor: ${course.instructor}
⏱️ Duración: ${course.duration} minutos
💰 Precio: ${course.price === 0 ? 'GRATIS' : `$${course.price}`}

🎁 *Oferta de Lanzamiento:* 20% OFF
Válido solo por 48 horas

Ver más: ${window.location.origin}/course/${course.id}`

    for (const user of users) {
      await this.sendMessage({
        to: user.phone,
        template,
        variables: {},
        type: 'new_course'
      })
    }
  }

  /**
   * 10. Evento en Vivo Próximo
   */
  async notifyUpcomingEvent(user, event) {
    const template = `📅 *Evento en Vivo Próximo*

*${event.title}*

📍 Fecha: ${new Date(event.date).toLocaleDateString('es-ES')}
🕐 Hora: ${event.time}
👤 Ponente: ${event.speaker}

${event.description}

🔗 Regístrate aquí: ${window.location.origin}/events/${event.id}

*Cupos limitados* - ¡No te lo pierdas!`

    await this.sendMessage({
      to: user.phone,
      template,
      variables: {},
      type: 'event_reminder'
    })
  }

  /**
   * UTILIDADES ADICIONALES
   */

  /**
   * Verificar si un número es válido
   */
  validatePhoneNumber(phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    return cleanPhone.length >= 10 && cleanPhone.length <= 15
  }

  /**
   * Obtener estadísticas de mensajes
   */
  async getMessageStats() {
    try {
      const stats = await apiClient.get('/whatsapp/stats')
      return stats
    } catch (error) {
      console.error('Error getting WhatsApp stats:', error)
      return null
    }
  }

  /**
   * Programar mensaje para envío futuro
   */
  async scheduleMessage(scheduledFor, messageData) {
    try {
      await apiClient.post('/api/whatsapp/schedule', {
        scheduledFor,
        ...messageData
      })
      return { success: true }
    } catch (error) {
      console.error('Error scheduling message:', error)
      return { success: false, error: error.message }
    }
  }
}

// Singleton instance
const whatsappService = new WhatsAppService()

// Auto-initialize on import
whatsappService.initialize()

export default whatsappService