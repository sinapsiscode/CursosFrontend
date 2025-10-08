/**
 * IDs y configuración de Áreas
 * Fuente única de verdad para las áreas del sistema
 */

export const AREA_IDS = {
  METALURGIA: '1',
  MINERIA: '2',
  GEOLOGIA: '3',
}

export const AREA_KEYS = {
  METALURGIA: 'metalurgia',
  MINERIA: 'mineria',
  GEOLOGIA: 'geologia',
}

// Mapeo de ID a Key
export const AREA_ID_TO_KEY = {
  '1': AREA_KEYS.METALURGIA,
  '2': AREA_KEYS.MINERIA,
  '3': AREA_KEYS.GEOLOGIA,
}

// Mapeo de Key a ID
export const AREA_KEY_TO_ID = {
  [AREA_KEYS.METALURGIA]: AREA_IDS.METALURGIA,
  [AREA_KEYS.MINERIA]: AREA_IDS.MINERIA,
  [AREA_KEYS.GEOLOGIA]: AREA_IDS.GEOLOGIA,
}

// Configuración visual de áreas (centralizada)
export const AREA_CONFIG = {
  [AREA_KEYS.METALURGIA]: {
    id: AREA_IDS.METALURGIA,
    key: AREA_KEYS.METALURGIA,
    name: 'Metalurgia',
    icon: '🔬',
    color: 'red',
    textColor: 'text-primary-metalurgia',
    bgColor: 'bg-primary-metalurgia',
  },
  [AREA_KEYS.MINERIA]: {
    id: AREA_IDS.MINERIA,
    key: AREA_KEYS.MINERIA,
    name: 'Minería',
    icon: '⛏️',
    color: 'blue',
    textColor: 'text-primary-mineria',
    bgColor: 'bg-primary-mineria',
  },
  [AREA_KEYS.GEOLOGIA]: {
    id: AREA_IDS.GEOLOGIA,
    key: AREA_KEYS.GEOLOGIA,
    name: 'Geología',
    icon: '🪨',
    color: 'green',
    textColor: 'text-primary-geologia',
    bgColor: 'bg-primary-geologia',
  },
}

// Helper functions
export const getAreaById = (id) => {
  const key = AREA_ID_TO_KEY[id]
  return key ? AREA_CONFIG[key] : null
}

export const getAreaByKey = (key) => AREA_CONFIG[key] || null

export const getAllAreas = () => Object.values(AREA_CONFIG)

export default AREA_IDS
