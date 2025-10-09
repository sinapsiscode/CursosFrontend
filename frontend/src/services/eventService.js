// Servicio de Eventos y Promociones
import { notificationService } from './notificationService'
import { whatsappService } from './whatsappService'

export class EventService {
  constructor() {
    this.events = this.getStoredEvents()
    this.userInterests = this.getUserInterests()
    this.init()
  }

  init() {
    // Verificar eventos próximos cada hora
    setInterval(() => {
      this.checkUpcomingEvents()
    }, 3600000)
  }

  // Obtener eventos almacenados
  getStoredEvents() {
    const stored = localStorage.getItem('platform_events')
    if (stored) {
      return JSON.parse(stored)
    }

    // Eventos de ejemplo
    return [
      {
        id: 'evt-001',
        type: 'webinar',
        title: 'Innovaciones en Metalurgia 4.0',
        description: 'Descubre las últimas tecnologías en la industria metalúrgica',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        time: '19:00',
        duration: '2 horas',
        instructor: 'Dr. Carlos Mendoza',
        area: 'metalurgia',
        relatedCourses: ['met-101', 'met-201', 'met-301'], // IDs reales de cursos
        tags: ['metalurgia', 'tecnología', 'industria 4.0', 'fundamentos', 'acero'],
        capacity: 100,
        registered: 45,
        price: 0, // Gratis
        benefits: [
          'Certificado de participación',
          '20% descuento en curso relacionado',
          'Material descargable exclusivo'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        registrationUrl: 'https://metsel.edu.co/eventos/metalurgia-40',
        pdfUrl: 'https://metsel.edu.co/docs/metalurgia-4.0-guia.pdf', // PDF descargable
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Video relacionado
        redirectUrl: 'https://zoom.us/j/123456789', // URL de redirección después de inscripción
        status: 'upcoming'
      },
      {
        id: 'evt-002',
        type: 'masterclass',
        title: 'Técnicas Avanzadas de Exploración Minera',
        description: 'Masterclass exclusiva con expertos internacionales',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00',
        duration: '4 horas',
        instructor: 'Ing. María Rodriguez',
        area: 'mineria',
        relatedCourses: ['min-101', 'min-201', 'min-301'], // IDs reales de cursos
        tags: ['minería', 'exploración', 'técnicas avanzadas', 'seguridad', 'subterránea'],
        capacity: 50,
        registered: 38,
        price: 0, // Todos los eventos son gratuitos
        originalPrice: 50,
        discount: 100, // 100% de descuento
        benefits: [
          'Acceso a grabación por 30 días',
          'Sesión Q&A exclusiva',
          'Descuento en certificación'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1577094620378-8a8c3a7c2e3a?w=800',
        registrationUrl: 'https://metsel.edu.co/eventos/mineria-avanzada',
        pdfUrl: 'https://metsel.edu.co/docs/mineria-avanzada-manual.pdf',
        youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
        redirectUrl: 'https://teams.microsoft.com/l/meetup-join/xyz',
        status: 'upcoming'
      },
      {
        id: 'promo-001',
        type: 'promotion',
        title: 'Black Friday Geología',
        description: 'Todos los cursos de geología con 40% de descuento',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        area: 'geologia',
        relatedCourses: ['geo-101', 'geo-201', 'geo-301'], // IDs reales de cursos
        tags: ['geología', 'promoción', 'descuento', 'rocas', 'minerales'],
        discount: 40,
        promoCode: 'BLACKGEO40',
        conditions: [
          'Válido solo para cursos de geología',
          'No acumulable con otros descuentos',
          'Aplicable a máximo 2 cursos por usuario'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=800',
        status: 'upcoming'
      },
      {
        id: 'promo-002',
        type: 'bundle',
        title: 'Pack Completo Metalurgia',
        description: '3 cursos esenciales de metalurgia, todos gratis',
        area: 'metalurgia',
        courses: [
          { id: 'met-101', title: 'Fundamentos de Metalurgia' },
          { id: 'met-201', title: 'Tratamientos Térmicos' },
          { id: 'met-301', title: 'Metalurgia de la Soldadura' }
        ],
        originalPrice: 150,
        bundlePrice: 100,
        savings: 50,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['metalurgia', 'bundle', 'ahorro'],
        status: 'active'
      }
    ]
  }

  // Obtener intereses del usuario
  getUserInterests() {
    const stored = localStorage.getItem('user_interests')
    if (stored) {
      return JSON.parse(stored)
    }

    return {
      viewedCourses: [],
      searchedTerms: [],
      favoriteAreas: [],
      completedCourses: [],
      registeredEvents: [],
      interestScore: {
        metalurgia: 0,
        mineria: 0,
        geologia: 0
      }
    }
  }

  // Guardar eventos
  saveEvents() {
    localStorage.setItem('platform_events', JSON.stringify(this.events))
  }

  // Guardar intereses
  saveUserInterests() {
    localStorage.setItem('user_interests', JSON.stringify(this.userInterests))
  }

  // Registrar interés del usuario
  trackUserInterest(type, data) {
    switch (type) {
      case 'course_view':
        if (!this.userInterests.viewedCourses.includes(data.courseId)) {
          this.userInterests.viewedCourses.push(data.courseId)
        }
        // Guardar detalles del curso visto
        if (!this.userInterests.viewedCoursesDetails) {
          this.userInterests.viewedCoursesDetails = {}
        }
        this.userInterests.viewedCoursesDetails[data.courseId] = {
          title: data.courseTitle,
          area: data.area,
          tags: data.tags || [],
          lastViewed: new Date().toISOString()
        }
        // Incrementar score del área
        if (data.area && this.userInterests.interestScore[data.area] !== undefined) {
          this.userInterests.interestScore[data.area] += 10
        }
        break

      case 'search':
        this.userInterests.searchedTerms.push({
          term: data.query,
          area: data.area,
          timestamp: new Date().toISOString()
        })
        // Incrementar score si busca en área específica
        if (data.area && this.userInterests.interestScore[data.area] !== undefined) {
          this.userInterests.interestScore[data.area] += 5
        }
        break

      case 'course_complete':
        this.userInterests.completedCourses.push(data.courseId)
        if (data.area && this.userInterests.interestScore[data.area] !== undefined) {
          this.userInterests.interestScore[data.area] += 20
        }
        break

      case 'event_register':
        this.userInterests.registeredEvents.push(data.eventId)
        if (data.area && this.userInterests.interestScore[data.area] !== undefined) {
          this.userInterests.interestScore[data.area] += 15
        }
        break
    }

    this.saveUserInterests()
    
    // Verificar si hay eventos relevantes para notificar
    this.checkRelevantEvents()
  }

  // Obtener eventos relevantes para el usuario
  getRelevantEvents() {
    const allEvents = this.getAllActiveEvents()
    
    // Calcular relevancia para cada evento
    const eventsWithRelevance = allEvents.map(event => {
      let relevanceScore = 0

      // Score por área de interés
      if (event.area && this.userInterests.interestScore[event.area]) {
        relevanceScore += this.userInterests.interestScore[event.area]
      }

      // Score por cursos relacionados vistos
      if (event.relatedCourses) {
        const viewedRelated = event.relatedCourses.filter(courseId => 
          this.userInterests.viewedCourses.includes(courseId)
        ).length
        relevanceScore += viewedRelated * 20
      }

      // Score por tags en búsquedas
      if (event.tags) {
        const matchingSearches = this.userInterests.searchedTerms.filter(search => 
          event.tags.some(tag => search.term.toLowerCase().includes(tag.toLowerCase()))
        ).length
        relevanceScore += matchingSearches * 10
      }

      return {
        ...event,
        relevanceScore,
        price: 0, // TODOS los eventos son gratuitos para estudiantes
        discount: event.originalPrice ? 100 : (event.discount || 0)
      }
    })

    // Ordenar por relevancia y devolver los más relevantes
    return eventsWithRelevance
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter(event => event.relevanceScore > 0)
  }

  // Obtener todos los eventos activos
  getAllActiveEvents() {
    const now = new Date()
    
    return this.events.filter(event => {
      if (event.type === 'promotion' || event.type === 'bundle') {
        // Para promociones, verificar fechas
        if (event.endDate) {
          return new Date(event.endDate) > now
        }
        if (event.validUntil) {
          return new Date(event.validUntil) > now
        }
      } else {
        // Para eventos, verificar que no hayan pasado
        return new Date(event.date) > now
      }
      return true
    }).map(event => ({
      ...event,
      price: 0, // TODOS los eventos son gratuitos para estudiantes
      discount: event.originalPrice ? 100 : (event.discount || 0) // Si tenía precio original, descuento del 100% - ahora todo es gratis
    }))
  }

  // Verificar eventos relevantes y notificar
  checkRelevantEvents() {
    const relevantEvents = this.getRelevantEvents()
    
    // Notificar solo el evento más relevante si tiene score alto
    if (relevantEvents.length > 0 && relevantEvents[0].relevanceScore >= 30) {
      const event = relevantEvents[0]
      
      // Verificar si ya se notificó este evento
      const notificationKey = `notified_${event.id}`
      if (!localStorage.getItem(notificationKey)) {
        this.notifyRelevantEvent(event)
        localStorage.setItem(notificationKey, 'true')
      }
    }
  }

  // Notificar evento relevante
  notifyRelevantEvent(event) {
    if (event.type === 'webinar' || event.type === 'masterclass') {
      notificationService.createNotification({
        type: 'event',
        title: '📅 Evento Recomendado para Ti',
        message: `${event.title} - Basado en tu interés en ${event.area}`,
        icon: '🎯',
        actions: [
          {
            label: 'Ver Detalles',
            url: `/events/${event.id}`,
            icon: '👀'
          },
          {
            label: 'Registrarse',
            url: event.registrationUrl,
            icon: '✍️',
            target: '_blank'
          }
        ],
        persistent: true
      })
    } else if (event.type === 'promotion') {
      notificationService.createNotification({
        type: 'promo',
        title: '🎁 Promoción Especial',
        message: `${event.title} - ${event.discount}% de descuento`,
        icon: '💰',
        actions: [
          {
            label: 'Ver Promoción',
            url: `/promotions/${event.id}`,
            icon: '🛒'
          }
        ],
        persistent: true
      })
    }
  }

  // Verificar eventos próximos (24 horas)
  checkUpcomingEvents() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const upcomingEvents = this.getAllActiveEvents().filter(event => {
      if (event.date) {
        const eventDate = new Date(event.date)
        const hoursDiff = (eventDate - new Date()) / (1000 * 60 * 60)
        return hoursDiff > 0 && hoursDiff <= 24
      }
      return false
    })

    upcomingEvents.forEach(event => {
      // Verificar si el usuario está interesado en esta área
      if (this.userInterests.interestScore[event.area] > 20) {
        const notificationKey = `reminder_${event.id}`
        if (!localStorage.getItem(notificationKey)) {
          notificationService.createNotification({
            type: 'warning',
            title: '⏰ Recordatorio de Evento',
            message: `${event.title} es mañana a las ${event.time}`,
            icon: '📅',
            actions: [
              {
                label: 'Ver Evento',
                url: `/events/${event.id}`,
                icon: '👀'
              }
            ],
            persistent: true
          })
          localStorage.setItem(notificationKey, 'true')
        }
      }
    })
  }

  // Registrar usuario en evento
  async registerForEvent(eventId, userData) {
    const event = this.events.find(e => e.id === eventId)
    if (!event) {
      return { success: false, error: 'Evento no encontrado' }
    }

    if (event.capacity && event.registered >= event.capacity) {
      return { success: false, error: 'Evento lleno' }
    }

    // Verificar si ya está registrado
    const registrations = JSON.parse(localStorage.getItem('event_registrations') || '{}')
    if (!registrations[eventId]) {
      registrations[eventId] = []
    }
    
    const alreadyRegistered = registrations[eventId].some(
      reg => reg.email === userData.email
    )
    
    if (alreadyRegistered) {
      return { success: false, error: 'Ya estás registrado en este evento' }
    }

    // Guardar registro completo
    registrations[eventId].push({
      ...userData,
      registeredAt: new Date().toISOString()
    })
    localStorage.setItem('event_registrations', JSON.stringify(registrations))

    // Registrar interés
    this.trackUserInterest('event_register', {
      eventId,
      area: event.area
    })

    // Incrementar contador
    event.registered = (event.registered || 0) + 1
    this.saveEvents()

    // Enviar confirmación por WhatsApp
    if (userData.phone) {
      const message = `¡Registro confirmado! 🎉\n\n` +
        `Evento: ${event.title}\n` +
        `Fecha: ${new Date(event.date).toLocaleDateString('es-ES')}\n` +
        `Hora: ${event.time}\n\n` +
        `Te esperamos. Guarda este mensaje como recordatorio.`
      
      whatsappService.sendWhatsAppMessage(message, userData.phone)
    }

    // Notificar registro exitoso
    notificationService.createNotification({
      type: 'success',
      title: '✅ Registro Exitoso',
      message: `Te has registrado en ${event.title}`,
      icon: '🎟️',
      actions: [
        {
          label: 'Agregar al Calendario',
          url: '#',
          icon: '📅',
          callback: () => this.downloadCalendarEvent(event)
        }
      ],
      persistent: true
    })

    // Programar notificaciones automáticas para este usuario
    this.scheduleEventNotifications(event, userData)

    return { success: true, event }
  }

  // Programar notificaciones automáticas para un evento
  scheduleEventNotifications(event, userData) {
    const eventDate = new Date(event.date)
    const now = new Date()
    
    // Calcular cuándo enviar cada notificación
    const notification24h = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000)
    const notification1h = new Date(eventDate.getTime() - 60 * 60 * 1000)
    const notification10m = new Date(eventDate.getTime() - 10 * 60 * 1000)
    
    // Para demo: usar timeouts más cortos (minutos en lugar de horas)
    const demo24h = new Date(now.getTime() + 30 * 1000) // 30 segundos
    const demo1h = new Date(now.getTime() + 60 * 1000)  // 1 minuto
    const demo10m = new Date(now.getTime() + 90 * 1000) // 1.5 minutos
    const demoStart = new Date(now.getTime() + 120 * 1000) // 2 minutos
    
    // Guardar en localStorage para persistencia
    const notifications = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]')
    
    const newNotifications = [
      {
        id: `${event.id}_24h`,
        eventId: event.id,
        userId: userData.email,
        scheduledFor: demo24h.toISOString(),
        type: '24h_reminder',
        sent: false
      },
      {
        id: `${event.id}_1h`,
        eventId: event.id,
        userId: userData.email,
        scheduledFor: demo1h.toISOString(),
        type: '1h_reminder',
        sent: false
      },
      {
        id: `${event.id}_10m`,
        eventId: event.id,
        userId: userData.email,
        scheduledFor: demo10m.toISOString(),
        type: '10m_reminder',
        sent: false
      },
      {
        id: `${event.id}_start`,
        eventId: event.id,
        userId: userData.email,
        scheduledFor: demoStart.toISOString(),
        type: 'event_start',
        sent: false
      }
    ]
    
    notifications.push(...newNotifications)
    localStorage.setItem('scheduled_notifications', JSON.stringify(notifications))
    
    // Iniciar el procesador de notificaciones si no está corriendo
    this.startNotificationProcessor()
  }

  // Procesador de notificaciones programadas
  startNotificationProcessor() {
    // Evitar múltiples intervalos
    if (this.notificationInterval) {
      return
    }
    
    this.notificationInterval = setInterval(() => {
      this.processScheduledNotifications()
    }, 10000) // Revisar cada 10 segundos
  }

  // Procesar notificaciones pendientes
  processScheduledNotifications() {
    const notifications = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]')
    const now = new Date()
    
    notifications.forEach(notification => {
      if (!notification.sent && new Date(notification.scheduledFor) <= now) {
        const event = this.events.find(e => e.id === notification.eventId)
        if (event) {
          this.sendScheduledNotification(notification, event)
          notification.sent = true
        }
      }
    })
    
    // Guardar cambios
    localStorage.setItem('scheduled_notifications', JSON.stringify(notifications))
  }

  // Enviar notificación programada
  sendScheduledNotification(notification, event) {
    const notificationConfigs = {
      '24h_reminder': {
        type: 'info',
        title: '📅 Recordatorio: Evento Mañana',
        message: `${event.title} - Mañana a las ${event.time}`,
        icon: '⏰',
        persistent: true
      },
      '1h_reminder': {
        type: 'warning',
        title: '⚡ El evento comienza en 1 hora',
        message: 'Prepara tus materiales y únete a tiempo',
        icon: '📚',
        persistent: true
      },
      '10m_reminder': {
        type: 'warning',
        title: '🔔 ¡Últimos 10 minutos!',
        message: 'El evento está por comenzar. ¡No te lo pierdas!',
        icon: '🏃‍♂️',
        persistent: true,
        sound: true
      },
      'event_start': {
        type: 'success',
        title: '🔴 ¡Evento EN VIVO!',
        message: `${event.title} ha comenzado. Únete ahora`,
        icon: '🎬',
        persistent: true,
        sound: true,
        actions: [
          {
            label: 'Unirse Ahora',
            url: event.registrationUrl || '#',
            icon: '🚀',
            target: '_blank'
          }
        ]
      }
    }
    
    const config = notificationConfigs[notification.type]
    if (config) {
      notificationService.createNotification(config)
      
      // También mostrar un toast
      const messages = {
        '24h_reminder': '📅 Recordatorio: Evento mañana',
        '1h_reminder': '⚡ El evento comienza en 1 hora',
        '10m_reminder': '🔔 ¡Últimos 10 minutos!',
        'event_start': '🔴 ¡Evento EN VIVO!'
      }
      
      // Simular que llega por WhatsApp también
      if (notification.type === 'event_start') {
        whatsappService.sendWhatsAppMessage(
          `🔴 ¡EVENTO EN VIVO! 🔴\n\n${event.title} ha comenzado.\n\nÚnete aquí: ${event.registrationUrl || 'Link del evento'}`,
          notification.userId
        )
      }
    }
  }

  // Aplicar código de promoción
  applyPromoCode(code, courseId) {
    const promo = this.events.find(e => 
      e.type === 'promotion' && 
      e.promoCode === code &&
      e.status === 'active'
    )

    if (!promo) {
      return { success: false, error: 'Código inválido o expirado' }
    }

    // Verificar si el curso aplica
    if (promo.relatedCourses && !promo.relatedCourses.includes(courseId)) {
      return { success: false, error: 'Este código no aplica para este curso' }
    }

    return {
      success: true,
      discount: promo.discount,
      promo
    }
  }

  // Descargar evento para calendario
  downloadCalendarEvent(event) {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + parseInt(event.duration))

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
LOCATION:Online - MetSel Platform
URL:${event.registrationUrl}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.title.replace(/\s+/g, '-')}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Obtener estadísticas de eventos
  getEventStats() {
    const events = this.getAllActiveEvents()
    
    return {
      totalEvents: events.length,
      upcomingWebinars: events.filter(e => e.type === 'webinar').length,
      activePromotions: events.filter(e => e.type === 'promotion').length,
      totalRegistrations: events.reduce((sum, e) => sum + (e.registered || 0), 0),
      eventsByArea: {
        metalurgia: events.filter(e => e.area === 'metalurgia').length,
        mineria: events.filter(e => e.area === 'mineria').length,
        geologia: events.filter(e => e.area === 'geologia').length
      }
    }
  }

  // Crear nuevo evento (admin)
  createEvent(eventData) {
    const newEvent = {
      id: `evt-${Date.now()}`,
      ...eventData,
      registered: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    }

    this.events.push(newEvent)
    this.saveEvents()

    // Notificar a usuarios interesados
    this.notifyInterestedUsers(newEvent)

    return newEvent
  }

  // Notificar a usuarios interesados
  notifyInterestedUsers(event) {
    // En un sistema real, esto enviaría notificaciones a usuarios específicos
    // basándose en sus intereses almacenados en la base de datos
    
    // Por ahora, mostrar notificación general
    if (event.type === 'webinar' || event.type === 'masterclass') {
      notificationService.createNotification({
        type: 'info',
        title: '🆕 Nuevo Evento Disponible',
        message: `${event.title} - ${new Date(event.date).toLocaleDateString('es-ES')}`,
        icon: '📅',
        actions: [
          {
            label: 'Ver Detalles',
            url: `/events/${event.id}`,
            icon: '👀'
          }
        ],
        duration: 10000
      })
    }
  }

  // Verificar y notificar eventos relacionados cuando el usuario ve un curso
  checkAndNotifyRelatedEvents(course) {
    // Validar que course tenga los datos mínimos necesarios
    if (!course || !course.id) {
      console.warn('⚠️ checkAndNotifyRelatedEvents: curso inválido')
      return
    }

    const activeEvents = this.getAllActiveEvents()
    const relatedEvents = []

    // Buscar eventos relacionados
    activeEvents.forEach(event => {
      let relevanceScore = 0

      // 1. Eventos del mismo área
      if (event.area && course.area && event.area === course.area) {
        relevanceScore += 50
      }

      // 2. Eventos que incluyen este curso en sus cursos relacionados
      if (event.relatedCourses && event.relatedCourses.includes(course.id)) {
        relevanceScore += 100
      }

      // 3. Eventos con tags similares
      if (event.tags && course.tags && Array.isArray(event.tags) && Array.isArray(course.tags)) {
        const commonTags = event.tags.filter(tag =>
          course.tags.some(courseTag =>
            tag && courseTag &&
            (tag.toLowerCase().includes(courseTag.toLowerCase()) ||
            courseTag.toLowerCase().includes(tag.toLowerCase()))
          )
        )
        relevanceScore += commonTags.length * 20
      }

      // 4. Eventos que mencionan el curso en título o descripción
      if (course.title) {
        const courseKeywords = course.title.toLowerCase().split(' ').filter(word => word.length > 3)
        const eventText = `${event.title || ''} ${event.description || ''}`.toLowerCase()

        courseKeywords.forEach(keyword => {
          if (eventText.includes(keyword)) {
            relevanceScore += 30
          }
        })
      }
      
      if (relevanceScore > 50) {
        relatedEvents.push({ ...event, relevanceScore })
      }
    })
    
    // Ordenar por relevancia
    relatedEvents.sort((a, b) => b.relevanceScore - a.relevanceScore)
    
    // Notificar el evento más relevante (si existe)
    if (relatedEvents.length > 0) {
      const mostRelevant = relatedEvents[0]
      
      // Verificar si ya se notificó este evento para este curso
      const notificationKey = `course_event_${course.id}_${mostRelevant.id}`
      const lastNotified = localStorage.getItem(notificationKey)
      const now = new Date().getTime()
      
      // No notificar si ya se notificó en las últimas 24 horas
      if (lastNotified && (now - parseInt(lastNotified)) < 24 * 60 * 60 * 1000) {
        return
      }
      
      // Guardar que se notificó
      localStorage.setItem(notificationKey, now.toString())
      
      // Crear notificación contextual
      if (mostRelevant.type === 'webinar' || mostRelevant.type === 'masterclass') {
        const daysUntilEvent = Math.ceil((new Date(mostRelevant.date) - new Date()) / (1000 * 60 * 60 * 24))
        
        notificationService.createNotification({
          type: 'info',
          title: '🎯 Evento Relacionado',
          message: `${mostRelevant.title} - Perfecto para complementar "${course.title}"`,
          icon: '📚',
          actions: [
            {
              label: 'Ver Evento',
              url: '/events',
              icon: '👀'
            },
            {
              label: mostRelevant.price === 0 ? 'Inscribirse Gratis' : `Inscribirse ($${mostRelevant.price})`,
              url: '/events',
              icon: '✍️'
            }
          ],
          persistent: true,
          duration: 15000
        })
        
        // Si el evento es pronto, agregar urgencia
        if (daysUntilEvent <= 7) {
          setTimeout(() => {
            notificationService.createNotification({
              type: 'warning',
              title: `⏰ ¡Solo ${daysUntilEvent} días!`,
              message: `No te pierdas ${mostRelevant.title}`,
              icon: '🔔',
              duration: 8000
            })
          }, 5000)
        }
      } else if (mostRelevant.type === 'promotion') {
        notificationService.createNotification({
          type: 'promo',
          title: '🎁 Oferta Especial',
          message: `${mostRelevant.discount}% de descuento en cursos de ${mostRelevant.area}`,
          icon: '💰',
          actions: [
            {
              label: 'Ver Promoción',
              url: '/events',
              icon: '🛒'
            }
          ],
          persistent: true,
          duration: 10000
        })
      }
    }
    
    // También actualizar el interés del usuario basado en este curso
    this.checkRelevantEvents()
  }
}

// Instancia singleton
export const eventService = new EventService()