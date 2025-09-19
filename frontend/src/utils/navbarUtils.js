import { AREA_COLORS, DEFAULT_AVATAR } from '../constants/navbarConstants'

export const getAreaColorClass = (area) => {
  return AREA_COLORS[area] || ''
}

export const capitalizeArea = (area) => {
  return area ? area.charAt(0).toUpperCase() + area.slice(1) : ''
}

export const getUserAvatar = (user) => {
  return user?.avatar || DEFAULT_AVATAR
}

export const getUserName = (user) => {
  return user?.name || 'Usuario'
}

export const isAdmin = (user) => {
  return user?.role === 'admin'
}