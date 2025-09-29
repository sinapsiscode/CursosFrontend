export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return '0h 0m'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export const formatTime = (minutes) => {
  if (!minutes || isNaN(minutes)) return '0:00'
  return `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`
}

export const formatPrice = (price) => {
  return 'Gratis'
}

export const formatStatus = (published) => {
  return published ? 'Publicado' : 'Borrador'
}