export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'El email es requerido',
    INVALID: 'El email no es válido',
    REGEX: /\S+@\S+\.\S+/
  },
  PASSWORD: {
    REQUIRED: 'La contraseña es requerida',
    MIN_LENGTH: 6,
    MIN_LENGTH_ERROR: 'La contraseña debe tener al menos 6 caracteres'
  },
  NAME: {
    REQUIRED: 'El nombre es requerido',
    MIN_LENGTH: 2,
    MIN_LENGTH_ERROR: 'El nombre debe tener al menos 2 caracteres'
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Confirma tu contraseña',
    NO_MATCH: 'Las contraseñas no coinciden'
  }
}

export const FORM_INITIAL_STATE = {
  LOGIN: {
    email: '',
    password: ''
  },
  REGISTER: {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    selectedArea: 'metalurgia'
  }
}

export const USER_ROLE_COLORS = {
  admin: 'bg-red-600 hover:bg-red-700',
  user: 'bg-blue-600 hover:bg-blue-700',
  default: 'bg-gray-600 hover:bg-gray-700'
}

export const AREA_COLORS = {
  metalurgia: 'text-orange-400',
  mineria: 'text-yellow-400',
  geologia: 'text-green-400',
  default: 'text-gray-400'
}

export const LOGIN_MESSAGES = {
  SUCCESS: (name) => `¡Bienvenido ${name}!`,
  ERROR: 'Error al iniciar sesión',
  CONNECTION_ERROR: 'Error de conexión. Intenta nuevamente.'
}

export const REGISTER_MESSAGES = {
  SUCCESS: (name) => `¡Bienvenido ${name}! Tu cuenta ha sido creada exitosamente.`,
  ERROR: 'Error al crear la cuenta',
  CONNECTION_ERROR: 'Error de conexión. Intenta nuevamente.'
}

export const AREAS = {
  metalurgia: 'Metalurgia',
  mineria: 'Minería',
  geologia: 'Geología'
}

export const DEMO_PASSWORD = '123456'