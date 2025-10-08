/**
 * Middleware de validación para simular validaciones de producción
 * Este middleware valida datos de entrada antes de procesarlos
 */

// Esquemas de validación por entidad
const schemas = {
  usuario: {
    required: ['nombre', 'apellido', 'email'],
    fields: {
      nombre: { type: 'string', minLength: 2, maxLength: 100 },
      apellido: { type: 'string', minLength: 2, maxLength: 100 },
      email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      telefono: { type: 'string', pattern: /^\+?[0-9]{9,15}$/, optional: true },
      rolId: { type: 'number', min: 1, max: 7 },
      activo: { type: 'boolean', optional: true }
    }
  },

  curso: {
    required: ['titulo', 'descripcion', 'areaId', 'nivel', 'duracion', 'precio', 'instructor'],
    fields: {
      titulo: { type: 'string', minLength: 5, maxLength: 200 },
      descripcion: { type: 'string', minLength: 20, maxLength: 2000 },
      areaId: { type: 'string' },
      nivel: { type: 'string', enum: ['Básico', 'Intermedio', 'Avanzado'] },
      duracion: { type: 'number', min: 1, max: 500 },
      precio: { type: 'number', min: 0 },
      precioDescuento: { type: 'number', min: 0, optional: true },
      instructor: { type: 'string', minLength: 5, maxLength: 200 },
      rating: { type: 'number', min: 0, max: 5, optional: true },
      destacado: { type: 'boolean', optional: true },
      activo: { type: 'boolean', optional: true }
    }
  },

  area: {
    required: ['nombre', 'codigo'],
    fields: {
      nombre: { type: 'string', minLength: 3, maxLength: 100 },
      codigo: { type: 'string', minLength: 3, maxLength: 50, pattern: /^[a-z0-9-]+$/ },
      descripcion: { type: 'string', minLength: 10, maxLength: 500, optional: true },
      icono: { type: 'string', optional: true },
      activo: { type: 'boolean', optional: true }
    }
  },

  evento: {
    required: ['titulo', 'descripcion', 'tipo', 'fecha', 'duracion', 'instructor'],
    fields: {
      titulo: { type: 'string', minLength: 5, maxLength: 200 },
      descripcion: { type: 'string', minLength: 20, maxLength: 2000 },
      areaId: { type: 'string', optional: true },
      tipo: { type: 'string', enum: ['webinar', 'taller', 'conferencia', 'seminario'] },
      fecha: { type: 'date' },
      duracion: { type: 'number', min: 30, max: 480 },
      instructor: { type: 'string', minLength: 5, maxLength: 200 },
      capacidadMaxima: { type: 'number', min: 1, optional: true },
      precio: { type: 'number', min: 0, optional: true },
      online: { type: 'boolean', optional: true },
      activo: { type: 'boolean', optional: true }
    }
  },

  examen: {
    required: ['titulo', 'cursoId', 'duracion', 'porcentajeAprobacion'],
    fields: {
      titulo: { type: 'string', minLength: 5, maxLength: 200 },
      cursoId: { type: 'string' },
      duracion: { type: 'number', min: 5, max: 240 },
      intentosPermitidos: { type: 'number', min: 1, max: 10, optional: true },
      porcentajeAprobacion: { type: 'number', min: 0, max: 100 },
      activo: { type: 'boolean', optional: true },
      preguntas: { type: 'array', optional: true }
    }
  },

  examen_configuracion: {
    required: ['studentId', 'courseId', 'examId'],
    fields: {
      studentId: { type: 'string' },
      courseId: { type: 'string' },
      examId: { type: 'string' },
      attemptsAllowed: { type: 'number', min: 1, max: 10, optional: true },
      timeLimit: { type: 'number', min: 5, max: 240, optional: true },
      availableFrom: { type: 'date', optional: true },
      availableUntil: { type: 'date', optional: true }
    }
  },

  cupon: {
    required: ['code', 'studentId', 'courseId', 'discountPercentage'],
    fields: {
      code: { type: 'string', minLength: 6, maxLength: 20 },
      studentId: { type: 'string' },
      courseId: { type: 'string' },
      examId: { type: 'string', optional: true },
      discountPercentage: { type: 'number', min: 1, max: 100 },
      expirationDate: { type: 'date', optional: true },
      isUsed: { type: 'boolean', optional: true }
    }
  },

  resena: {
    required: ['courseId', 'userId', 'userName', 'rating', 'comment'],
    fields: {
      courseId: { type: 'string' },
      userId: { type: 'string' },
      userName: { type: 'string', minLength: 3, maxLength: 200 },
      rating: { type: 'number', min: 1, max: 5 },
      comment: { type: 'string', minLength: 10, maxLength: 1000 },
      status: { type: 'string', enum: ['pending', 'approved', 'rejected'], optional: true }
    }
  },

  notificacion: {
    required: ['usuarioId', 'titulo', 'mensaje'],
    fields: {
      usuarioId: { type: 'string' },
      tipo: { type: 'string', enum: ['info', 'success', 'warning', 'error'], optional: true },
      categoria: { type: 'string', enum: ['sistema', 'curso', 'examen', 'evento'], optional: true },
      titulo: { type: 'string', minLength: 5, maxLength: 200 },
      mensaje: { type: 'string', minLength: 10, maxLength: 1000 },
      leida: { type: 'boolean', optional: true },
      metadata: { type: 'object', optional: true }
    }
  },

  event_registration: {
    required: ['eventId', 'name', 'email'],
    fields: {
      eventId: { type: 'string' },
      userId: { type: 'string', optional: true },
      name: { type: 'string', minLength: 3, maxLength: 200 },
      email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { type: 'string', pattern: /^\+?[0-9]{9,15}$/, optional: true },
      company: { type: 'string', maxLength: 200, optional: true }
    }
  }
}

// Mapeo de rutas a entidades
const routeToEntity = {
  '/usuarios': 'usuario',
  '/cursos': 'curso',
  '/areas': 'area',
  '/eventos': 'evento',
  '/examenes': 'examen',
  '/examen_configuraciones': 'examen_configuracion',
  '/cupones': 'cupon',
  '/resenas': 'resena',
  '/notificaciones': 'notificacion',
  '/event_registrations': 'event_registration'
}

// Validar tipo de dato
function validateType(value, field, fieldName) {
  const { type, pattern, enum: enumValues, min, max, minLength, maxLength } = field

  // Validar tipo básico
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return `${fieldName} debe ser texto`
      }
      if (minLength && value.length < minLength) {
        return `${fieldName} debe tener al menos ${minLength} caracteres`
      }
      if (maxLength && value.length > maxLength) {
        return `${fieldName} debe tener máximo ${maxLength} caracteres`
      }
      if (pattern && !pattern.test(value)) {
        return `${fieldName} tiene formato inválido`
      }
      if (enumValues && !enumValues.includes(value)) {
        return `${fieldName} debe ser uno de: ${enumValues.join(', ')}`
      }
      break

    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return `${fieldName} debe ser un número`
      }
      if (min !== undefined && value < min) {
        return `${fieldName} debe ser mayor o igual a ${min}`
      }
      if (max !== undefined && value > max) {
        return `${fieldName} debe ser menor o igual a ${max}`
      }
      break

    case 'boolean':
      if (typeof value !== 'boolean') {
        return `${fieldName} debe ser verdadero o falso`
      }
      break

    case 'date':
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return `${fieldName} debe ser una fecha válida`
      }
      break

    case 'array':
      if (!Array.isArray(value)) {
        return `${fieldName} debe ser un arreglo`
      }
      break

    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return `${fieldName} debe ser un objeto`
      }
      break
  }

  return null
}

// Validar datos según esquema
function validateData(data, entityType) {
  const schema = schemas[entityType]
  if (!schema) {
    return { valid: true }
  }

  const errors = []

  // Validar campos requeridos
  for (const requiredField of schema.required || []) {
    if (data[requiredField] === undefined || data[requiredField] === null || data[requiredField] === '') {
      errors.push({
        field: requiredField,
        message: `${requiredField} es requerido`
      })
    }
  }

  // Validar tipos y restricciones
  for (const [fieldName, fieldSchema] of Object.entries(schema.fields)) {
    const value = data[fieldName]

    // Si es opcional y no está presente, continuar
    if (fieldSchema.optional && (value === undefined || value === null)) {
      continue
    }

    // Si está presente, validar
    if (value !== undefined && value !== null) {
      const error = validateType(value, fieldSchema, fieldName)
      if (error) {
        errors.push({
          field: fieldName,
          message: error
        })
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Middleware de validación
function validationMiddleware(req, res, next) {
  // Solo validar POST - PATCH y PUT son actualizaciones parciales
  if (req.method !== 'POST') {
    return next()
  }

  // Obtener entidad desde la ruta
  const basePath = req.path.split('/').slice(0, 2).join('/')
  const entityType = routeToEntity[basePath]

  // Si no hay esquema para esta entidad, continuar
  if (!entityType) {
    return next()
  }

  // Validar datos
  const validation = validateData(req.body, entityType)

  if (!validation.valid) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: validation.errors
    })
  }

  // Agregar entidad validada al request para logging
  req.validatedEntity = entityType

  next()
}

// Middleware para validar query parameters
function validateQueryParams(req, res, next) {
  if (req.method !== 'GET') {
    return next()
  }

  const query = req.query

  // Validar formatos comunes
  if (query.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query.email)) {
    return res.status(400).json({
      error: 'Parámetro inválido',
      details: [{ field: 'email', message: 'Formato de email inválido' }]
    })
  }

  if (query.rolId && (isNaN(query.rolId) || query.rolId < 1 || query.rolId > 7)) {
    return res.status(400).json({
      error: 'Parámetro inválido',
      details: [{ field: 'rolId', message: 'rolId debe estar entre 1 y 7' }]
    })
  }

  if (query.activo && query.activo !== 'true' && query.activo !== 'false') {
    return res.status(400).json({
      error: 'Parámetro inválido',
      details: [{ field: 'activo', message: 'activo debe ser true o false' }]
    })
  }

  next()
}

module.exports = {
  validationMiddleware,
  validateQueryParams,
  validateData,
  schemas
}
