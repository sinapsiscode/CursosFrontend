export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export const formatStudentCount = (count) => {
  return count?.toLocaleString() || '0'
}

export const capitalizeFirst = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatPrice = (price) => {
  return 'Gratis'
}

export const getDefaultPoints = () => 100