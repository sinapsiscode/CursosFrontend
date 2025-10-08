/**
 * Constantes relacionadas con tipos de suscripción
 */

export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
}

export const SUBSCRIPTION_LABELS = {
  [SUBSCRIPTION_TYPES.FREE]: 'Gratis',
  [SUBSCRIPTION_TYPES.BASIC]: 'Básico',
  [SUBSCRIPTION_TYPES.PREMIUM]: 'Premium',
  [SUBSCRIPTION_TYPES.ENTERPRISE]: 'Empresarial'
}

export const DEFAULT_SUBSCRIPTION = SUBSCRIPTION_TYPES.FREE
