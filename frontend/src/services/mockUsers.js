/**
 * Mock users for Quick Login feature in development
 * These are demo users for testing purposes only
 */
import { SUBSCRIPTION_TYPES } from '../constants/subscriptionConstants'

export const mockUsers = [
  {
    id: 1,
    name: "Carlos Mendoza",
    fullName: "Carlos Alberto Mendoza García",
    email: "carlos@email.com",
    password: "123456",
    phone: "+57 300 123 4567",
    role: "user",
    selectedArea: "metalurgia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    subscription: { type: SUBSCRIPTION_TYPES.PREMIUM }
  },
  {
    id: 2,
    name: "Ana Rodriguez",
    fullName: "Ana María Rodríguez López",
    email: "ana@email.com",
    password: "123456",
    phone: "+57 301 987 6543",
    role: "user",
    selectedArea: "mineria",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100",
    subscription: { type: SUBSCRIPTION_TYPES.BASIC }
  },
  {
    id: 3,
    name: "Miguel Santos",
    fullName: "Miguel Ángel Santos Herrera",
    email: "miguel@email.com",
    password: "123456",
    phone: "+57 302 456 7890",
    role: "admin",
    selectedArea: "geologia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    subscription: { type: SUBSCRIPTION_TYPES.PREMIUM }
  }
]
