import { USER_ROLE_COLORS, AREA_COLORS } from '../constants/authConstants'

export const getUserRoleColor = (role) => {
  return USER_ROLE_COLORS[role] || USER_ROLE_COLORS.default
}

export const getAreaColor = (area) => {
  return AREA_COLORS[area] || AREA_COLORS.default
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}