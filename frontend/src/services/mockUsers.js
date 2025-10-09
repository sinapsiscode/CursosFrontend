/**
 * Quick Access Users - UI only
 * Muestra botones de acceso rápido en el login
 * El login real se valida contra el backend (db.json)
 *
 * Credenciales reales en backend:
 * - admin@cursos.com / admin123 (rolId: 1 - Super Admin)
 * - carlos@email.com / 123456 (rolId: 5 - Estudiante)
 * - ana@email.com / 123456 (rolId: 6 - Estudiante)
 */
import { SUBSCRIPTION_TYPES } from '../constants/subscriptionConstants'

export const mockUsers = [
  {
    id: 1,
    name: "Admin Principal",
    fullName: "Administrador del Sistema",
    email: "admin@cursos.com",
    password: "admin123", // Solo para referencia - el backend valida la real
    phone: "+57 300 000 0000",
    role: "admin",
    selectedArea: "administracion",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    subscription: { type: SUBSCRIPTION_TYPES.PREMIUM }
  },
  {
    id: 54,
    name: "Carlos Mendoza",
    fullName: "Carlos Alberto Mendoza García",
    email: "carlos@email.com",
    password: "123456", // Solo para referencia - el backend valida la real
    phone: "+57 300 123 4567",
    role: "user",
    selectedArea: "metalurgia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    subscription: { type: SUBSCRIPTION_TYPES.PREMIUM }
  },
  {
    id: 55,
    name: "Ana Rodriguez",
    fullName: "Ana María Rodríguez López",
    email: "ana@email.com",
    password: "123456", // Solo para referencia - el backend valida la real
    phone: "+57 301 987 6543",
    role: "user",
    selectedArea: "mineria",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100",
    subscription: { type: SUBSCRIPTION_TYPES.BASIC }
  }
]
