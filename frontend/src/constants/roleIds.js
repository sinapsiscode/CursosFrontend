/**
 * IDs de Roles del Sistema
 * Centraliza todos los IDs de roles para evitar números mágicos
 */

export const ROLE_IDS = {
  SUPER_ADMIN: 1,
  GENERAL_MANAGER: 2,
  OPERATIONS_MANAGER: 3,
  ADMIN: 4,
  PREMIUM_STUDENT: 5,
  STUDENT: 6,
  GUEST: 7,
}

// Alias para facilitar uso
export const ROLES = ROLE_IDS

// Helper functions
export const isAdmin = (roleId) => roleId <= ROLE_IDS.ADMIN
export const isStudent = (roleId) => roleId === ROLE_IDS.STUDENT || roleId === ROLE_IDS.PREMIUM_STUDENT
export const isPremiumStudent = (roleId) => roleId === ROLE_IDS.PREMIUM_STUDENT
export const canManageUsers = (roleId) => roleId <= ROLE_IDS.GENERAL_MANAGER
export const canManageCourses = (roleId) => roleId <= ROLE_IDS.OPERATIONS_MANAGER
export const canModerateContent = (roleId) => roleId <= ROLE_IDS.ADMIN

// Rol por defecto para nuevos estudiantes
export const DEFAULT_STUDENT_ROLE = ROLE_IDS.STUDENT

export default ROLE_IDS
