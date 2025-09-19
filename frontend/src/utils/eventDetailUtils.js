export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getEventRegistrations = () => {
  return JSON.parse(localStorage.getItem('event_registrations') || '[]')
}

export const saveEventRegistration = (registration) => {
  const registrations = getEventRegistrations()
  registrations.push(registration)
  localStorage.setItem('event_registrations', JSON.stringify(registrations))
}

export const isUserRegistered = (eventId, userId) => {
  const registrations = getEventRegistrations()
  return registrations.find(r => r.eventId === eventId && r.userId === userId)
}

export const createRegistration = (event, user) => {
  return {
    id: `reg_${Date.now()}`,
    eventId: event.id,
    userId: user.id,
    registeredAt: new Date().toISOString(),
    status: 'confirmed'
  }
}

export const openExternalUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

export const simulateRegistrationDelay = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}