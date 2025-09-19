import { TOAST_TYPE_STYLES, TOAST_ICONS, TOAST_TYPES } from '../constants/toastConstants'

export const getToastStyles = (type) => {
  return TOAST_TYPE_STYLES[type] || TOAST_TYPE_STYLES[TOAST_TYPES.info]
}

export const getToastIcon = (type) => {
  return TOAST_ICONS[type] || TOAST_ICONS[TOAST_TYPES.info]
}