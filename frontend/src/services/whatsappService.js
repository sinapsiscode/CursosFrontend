// WhatsApp Lead Generation Service
import { notificationService } from './notificationService'
import CONFIG from '../constants/config'

export class WhatsAppService {
  constructor() {
    this.config = this.getStoredConfig()
  }

  // Obtener configuración almacenada
  getStoredConfig() {
    const stored = sessionStorage.getItem('whatsapp_config')
    if (stored) {
      return JSON.parse(stored)
    }

    // Configuración por defecto
    return {
      phoneNumber: CONFIG.WHATSAPP.DEFAULT_PHONE,
      autoSend: false,
      welcomeMessage: '¡Hola! 👋 Gracias por tu interés en nuestros cursos de MetSel. Te enviaré información relevante.',
      templates: {
        courseInterest: 'Te vimos interesado en cursos de {{area}}. Aquí tienes información sobre nuestros programas más populares: {{courses}}',
        webinarInvite: '🎯 ¡Webinar GRATUITO sobre {{area}}! Fecha: {{date}}. Regístrate aquí: {{link}}',
        newCourses: '🆕 ¡Nuevos cursos de {{area}} disponibles! {{coursesList}}. Inscríbete con 20% descuento: {{link}}',
        groupInvite: '👥 Únete a nuestro grupo de WhatsApp de {{area}} para networking y recursos exclusivos: {{groupLink}}'
      },
      groups: {
        metalurgia: { name: 'Metalurgia Pro', link: CONFIG.WHATSAPP.GROUPS.METALURGIA },
        mineria: { name: 'Mineros Unidos', link: CONFIG.WHATSAPP.GROUPS.MINERIA },
        geologia: { name: 'Geólogos Colombia', link: CONFIG.WHATSAPP.GROUPS.GEOLOGIA },
        general: { name: 'MetSel Community', link: CONFIG.WHATSAPP.GROUPS.GENERAL }
      },
      triggers: {
        courseSearch: { enabled: true, delay: 3000 },
        courseView: { enabled: true, delay: 5000 },
        userRegistration: { enabled: true, delay: 1000 },
        formSubmission: { enabled: true, delay: 2000 }
      },
      statistics: {
        totalSent: 0,
        courseSearchTriggers: 0,
        courseViewTriggers: 0,
        registrationTriggers: 0,
        formSubmissionTriggers: 0
      }
    }
  }

  // Actualizar configuración
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    sessionStorage.setItem('whatsapp_config', JSON.stringify(this.config))
  }

  // Actualizar estadísticas
  updateStats(triggerType) {
    this.config.statistics.totalSent++
    this.config.statistics[`${triggerType}Triggers`]++
    this.updateConfig(this.config)
  }

  // Trigger: Búsqueda de cursos
  async triggerCourseSearch(searchQuery, area = null) {
    if (!this.config.triggers.courseSearch.enabled || !this.config.autoSend) return

    setTimeout(async () => {
      try {
        const message = this.buildCourseInterestMessage(area || 'cursos técnicos', searchQuery)
        await this.sendWhatsAppMessage(message)
        this.updateStats('courseSearch')
        
        // Mostrar notificación interactiva de búsqueda
        notificationService.createNotification({
          type: 'info',
          title: '🔍 Búsqueda Registrada',
          message: `Te enviaremos información sobre ${area || 'cursos técnicos'} por WhatsApp`,
          icon: '📱',
          actions: [
            {
              label: 'Ver Cursos Disponibles',
              url: `/courses?area=${area || 'all'}`,
              icon: '📚'
            }
          ],
          duration: 6000
        })
        
        // Después de 5 segundos, enviar invitación a webinar
        setTimeout(() => {
          this.triggerWebinarInvite(area)
        }, 5000)
        
      } catch (error) {
        console.error('Error sending WhatsApp course search trigger:', error)
      }
    }, this.config.triggers.courseSearch.delay)
  }

  // Trigger: Vista de curso específico
  async triggerCourseView(course) {
    if (!this.config.triggers.courseView.enabled || !this.config.autoSend) return

    setTimeout(async () => {
      try {
        const message = this.buildCourseViewMessage(course)
        await this.sendWhatsAppMessage(message)
        this.updateStats('courseView')
        
        // Mostrar notificación de promoción del curso
        notificationService.showCoursePromotion(course, 15)
        
        // Después de 8 segundos, invitar al grupo
        setTimeout(() => {
          this.triggerGroupInvite(course.area, null) // null = enviar al admin
        }, 8000)
        
      } catch (error) {
        console.error('Error sending WhatsApp course view trigger:', error)
      }
    }, this.config.triggers.courseView.delay)
  }

  // Trigger: Registro de usuario
  async triggerUserRegistration(userData) {
    if (!this.config.triggers.userRegistration.enabled || !this.config.autoSend) return

    setTimeout(async () => {
      try {
        const welcomeMessage = this.config.welcomeMessage
        // Si el usuario tiene teléfono, enviar a su número, sino al admin
        const userPhone = userData.phone || userData.whatsapp || null
        await this.sendWhatsAppMessage(welcomeMessage, userPhone)
        this.updateStats('userRegistration')
        
        // Después del welcome, enviar cursos nuevos
        setTimeout(() => {
          this.triggerNewCoursesPromotion(userData.selectedArea || 'general', userPhone)
        }, 10000)
        
      } catch (error) {
        console.error('Error sending WhatsApp registration trigger:', error)
      }
    }, this.config.triggers.userRegistration.delay)
  }

  // Trigger: Envío de formulario
  async triggerFormSubmission(formData) {
    if (!this.config.triggers.formSubmission.enabled || !this.config.autoSend) return

    setTimeout(async () => {
      try {
        const message = this.buildFormSubmissionMessage(formData)
        await this.sendWhatsAppMessage(message)
        this.updateStats('formSubmission')
        
      } catch (error) {
        console.error('Error sending WhatsApp form submission trigger:', error)
      }
    }, this.config.triggers.formSubmission.delay)
  }

  // Construir mensaje de interés en cursos
  buildCourseInterestMessage(area, searchQuery = '') {
    const template = this.config.templates.courseInterest
    const courses = this.getPopularCoursesByArea(area)
    
    return template
      .replace('{{area}}', area)
      .replace('{{courses}}', courses)
  }

  // Construir mensaje de vista de curso
  buildCourseViewMessage(course) {
    return `🔥 Veo que te interesa "${course.title}"!\n\n` +
           `💡 Este curso de ${course.area} es perfecto para nivel ${course.level}.\n` +
           `⭐ Rating: ${course.rating}/5 (${course.students} estudiantes)\n` +
           `👨‍🏫 Instructor: ${course.instructor}\n\n` +
           `¿Te gustaría recibir más información sobre este curso o cursos similares?`
  }

  // Construir mensaje de envío de formulario
  buildFormSubmissionMessage(formData) {
    return `✅ ¡Gracias por tu interés!\n\n` +
           `Hemos recibido tu consulta sobre: ${formData.subject || 'cursos'}\n` +
           `Te contactaremos pronto con información personalizada.\n\n` +
           `Mientras tanto, explora nuestros cursos gratuitos: 📚`
  }

  // Invitación a webinar
  async triggerWebinarInvite(area) {
    const template = this.config.templates.webinarInvite
    const nextWebinarDate = this.getNextWebinarDate()

    const message = template
      .replace('{{area}}', area)
      .replace('{{date}}', nextWebinarDate)
      .replace('{{link}}', `${CONFIG.WEBSITE.BASE_URL}${CONFIG.WEBSITE.WEBINARS}`)

    await this.sendWhatsAppMessage(message)

    // Mostrar notificación de webinar
    notificationService.showWebinarInvitation({
      id: `webinar-${Date.now()}`,
      title: `Webinar Gratuito: ${area}`,
      date: nextWebinarDate,
      registrationUrl: `${CONFIG.WEBSITE.BASE_URL}${CONFIG.WEBSITE.WEBINARS}/registro`
    })
  }

  // Promoción de cursos nuevos
  async triggerNewCoursesPromotion(area, userPhone = null) {
    const template = this.config.templates.newCourses
    const newCourses = this.getNewCoursesByArea(area)

    const message = template
      .replace('{{area}}', area)
      .replace('{{coursesList}}', newCourses)
      .replace('{{link}}', `${CONFIG.WEBSITE.BASE_URL}${CONFIG.WEBSITE.REGISTRATION}`)

    await this.sendWhatsAppMessage(message, userPhone)
  }

  // Invitación a grupo
  async triggerGroupInvite(area, userPhone = null) {
    const template = this.config.templates.groupInvite
    const group = this.config.groups[area] || this.config.groups.general
    
    const message = template
      .replace('{{area}}', area)
      .replace('{{groupLink}}', group.link)
    
    await this.sendWhatsAppMessage(message, userPhone)
    
    // Mostrar notificación de grupo
    notificationService.showGroupInvitation({
      name: group.name,
      description: `Comunidad exclusiva de ${area} con recursos, networking y oportunidades`,
      whatsappLink: group.link
    })
  }

  // Enviar mensaje de WhatsApp usando links (wa.me)
  async sendWhatsAppMessage(message, userPhone = null) {
    // Limpiar número de teléfono (solo números)
    const adminPhone = this.config.phoneNumber.replace(/\D/g, '')
    const targetPhone = userPhone ? userPhone.replace(/\D/g, '') : adminPhone

    // Crear link de WhatsApp
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `${CONFIG.WHATSAPP.WA_ME_BASE}/${targetPhone}?text=${encodedMessage}`
    
    console.log('📱 WhatsApp Link Generated:', {
      to: targetPhone,
      message: message,
      link: whatsappUrl,
      timestamp: new Date().toISOString()
    })
    
    // Intentar abrir WhatsApp en nueva pestaña
    try {
      const newWindow = window.open(whatsappUrl, '_blank')
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Popup bloqueado, mostrar link alternativo
        console.warn('Popup bloqueado, mostrando link alternativo')
        this.showWhatsAppLinkModal(whatsappUrl, message)
        this.showNotification('⚠️ Popup bloqueado. Haz click en el enlace que apareció.', 'warning')
      } else {
        this.showNotification('📱 Se abrió WhatsApp para enviar el mensaje', 'success')
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error)
      // Fallback: mostrar link manual
      this.showWhatsAppLinkModal(whatsappUrl, message)
      this.showNotification('📱 Usa el enlace de WhatsApp que apareció', 'info')
    }
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      link: whatsappUrl,
      message: 'Link de WhatsApp generado correctamente'
    }
  }

  // Método para mostrar notificaciones
  showNotification(message, type = 'info') {
    // Usar el nuevo servicio de notificaciones
    notificationService.createNotification({
      type: type,
      message: message,
      duration: 5000
    })
  }

  // Mostrar modal con link de WhatsApp cuando popup está bloqueado
  showWhatsAppLinkModal(whatsappUrl, message) {
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('whatsapp-link-modal')
    if (existingModal) {
      existingModal.remove()
    }

    // Crear modal
    const modal = document.createElement('div')
    modal.id = 'whatsapp-link-modal'
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div class="text-center mb-4">
          <div class="text-4xl mb-2">📱</div>
          <h3 class="text-xl font-bold text-white mb-2">Abrir WhatsApp</h3>
          <p class="text-gray-300 text-sm">Tu navegador bloqueó el popup. Haz click en el botón para abrir WhatsApp:</p>
        </div>
        
        <div class="bg-gray-700 rounded-lg p-3 mb-4 text-sm text-gray-300 max-h-20 overflow-y-auto">
          "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"
        </div>
        
        <div class="flex space-x-3">
          <button 
            onclick="document.getElementById('whatsapp-link-modal').remove()" 
            class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <a 
            href="${whatsappUrl}" 
            target="_blank" 
            onclick="document.getElementById('whatsapp-link-modal').remove()"
            class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
          >
            📱 Abrir WhatsApp
          </a>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Cerrar con ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove()
        document.removeEventListener('keydown', handleEscape)
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    // Cerrar haciendo click fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
        document.removeEventListener('keydown', handleEscape)
      }
    })
  }

  // Helpers para datos mock
  getPopularCoursesByArea(area) {
    const coursesByArea = {
      metalurgia: 'Fundamentos de Metalurgia, Tratamientos Térmicos, Soldadura Avanzada',
      mineria: 'Introducción a la Minería, Procesamiento de Minerales, Minería Subterránea', 
      geologia: 'Geología General, Hidrogeología, Geología Estructural',
      general: 'Cursos técnicos especializados en ingeniería'
    }
    return coursesByArea[area] || coursesByArea.general
  }

  getNewCoursesByArea(area) {
    return `• Curso Avanzado de ${area}\n• Certificación Profesional\n• Masterclass Especializada`
  }

  getNextWebinarDate() {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return nextWeek.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Método para testing desde admin
  async testMessage(messageType, testData = {}) {
    const testMessages = {
      welcome: this.config.welcomeMessage,
      courseInterest: this.buildCourseInterestMessage('metalurgia', 'soldadura'),
      webinar: this.config.templates.webinarInvite.replace('{{area}}', 'minería').replace('{{date}}', 'Próximo viernes').replace('{{link}}', 'test-link'),
      newCourses: this.config.templates.newCourses.replace('{{area}}', 'geología').replace('{{coursesList}}', 'Test courses').replace('{{link}}', 'test-link'),
      groupInvite: this.config.templates.groupInvite.replace('{{area}}', 'metalurgia').replace('{{groupLink}}', this.config.groups.metalurgia.link)
    }
    
    const message = testMessages[messageType] || 'Mensaje de prueba'
    await this.sendWhatsAppMessage(message)
    
    return {
      success: true,
      message: `Mensaje de prueba "${messageType}" enviado correctamente`,
      sentMessage: message
    }
  }
}

// Instancia singleton
export const whatsappService = new WhatsAppService()