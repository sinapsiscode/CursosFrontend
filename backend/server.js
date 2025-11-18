const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')
const { validationMiddleware, validateQueryParams } = require('./middlewares/validation')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

const PORT = process.env.PORT || 5144

// Cargar base de datos
const dbPath = path.join(__dirname, 'db.json')
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

// Función para recargar la base de datos
const reloadDb = () => {
  db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
}

// Middleware CORS personalizado
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-role-id, x-user-id')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Middleware de logging
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  console.log('Headers:', {
    roleId: req.headers['x-role-id'],
    userId: req.headers['x-user-id']
  })
  next()
})

// Middleware de autenticación y autorización
server.use((req, res, next) => {
  // Permitir GET sin autenticación (solo lectura pública)
  if (req.method === 'GET') {
    return next()
  }

  // Permitir rutas de autenticación sin headers
  if (req.path.startsWith('/auth/')) {
    return next()
  }

  // Obtener rol del usuario desde headers
  const roleId = parseInt(req.headers['x-role-id'])
  const userId = parseInt(req.headers['x-user-id'])

  if (!roleId || !userId) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Se requiere autenticación. Proporcione x-role-id y x-user-id en los headers.'
    })
  }

  // Recargar DB para obtener datos actualizados
  reloadDb()

  // Buscar el rol en la base de datos
  const rol = db.roles.find(r => r.id === roleId)

  if (!rol) {
    return res.status(403).json({
      error: 'Rol no encontrado',
      message: `El rol con ID ${roleId} no existe en el sistema.`
    })
  }

  // Validar usuario existe
  const usuario = db.usuarios.find(u => u.id === userId && u.rolId === roleId)

  if (!usuario) {
    return res.status(403).json({
      error: 'Usuario no válido',
      message: 'El usuario no existe o no coincide con el rol proporcionado.'
    })
  }

  if (!usuario.activo) {
    return res.status(403).json({
      error: 'Usuario inactivo',
      message: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
    })
  }

  // Mapeo de rutas a permisos requeridos
  const permisosPorRuta = {
    '/usuarios': {
      POST: 'crear_usuario',
      PUT: 'editar_usuario',
      PATCH: 'editar_usuario',
      DELETE: 'eliminar_usuario'
    },
    '/cursos': {
      POST: 'crear_curso',
      PUT: 'editar_curso',
      PATCH: 'editar_curso',
      DELETE: 'eliminar_curso'
    },
    '/examenes': {
      POST: 'crear_examen',
      PUT: 'editar_examen',
      PATCH: 'editar_examen',
      DELETE: 'eliminar_examen'
    },
    '/eventos': {
      POST: 'crear_evento',
      PUT: 'editar_evento',
      PATCH: 'editar_evento',
      DELETE: 'eliminar_evento'
    },
    '/areas': {
      POST: 'gestionar_areas',
      PUT: 'gestionar_areas',
      PATCH: 'gestionar_areas',
      DELETE: 'gestionar_areas'
    },
    '/roles': {
      POST: 'gestionar_roles',
      PUT: 'gestionar_roles',
      PATCH: 'gestionar_roles',
      DELETE: 'gestionar_roles'
    },
    '/notificaciones': {
      POST: 'gestionar_notificaciones',
      PUT: 'gestionar_notificaciones',
      PATCH: 'gestionar_notificaciones',
      DELETE: 'gestionar_notificaciones'
    }
  }

  // Extraer el recurso de la URL (ej: /usuarios/1 -> usuarios)
  const recurso = '/' + req.path.split('/')[1]
  const metodo = req.method

  // Permitir que usuarios actualicen sus propios datos (para sesiones, perfil, etc.)
  const isUpdatingSelf = recurso === '/usuarios' &&
                          (metodo === 'PUT' || metodo === 'PATCH') &&
                          req.path.includes(`/usuarios/${userId}`)

  // Si el recurso tiene permisos definidos y NO es actualización propia
  if (!isUpdatingSelf && permisosPorRuta[recurso] && permisosPorRuta[recurso][metodo]) {
    const permisoRequerido = permisosPorRuta[recurso][metodo]

    if (!rol.permisos.includes(permisoRequerido)) {
      return res.status(403).json({
        error: 'Permiso denegado',
        message: `No tienes permiso para realizar esta acción. Se requiere: ${permisoRequerido}`,
        rol: rol.nombre,
        permisosActuales: rol.permisos
      })
    }
  }

  // Agregar información del usuario y rol al request
  req.userData = {
    userId,
    roleId,
    rolNombre: rol.nombre,
    permisos: rol.permisos,
    usuario: usuario
  }

  next()
})

// Middleware para agregar metadatos a las respuestas
server.use((req, res, next) => {
  const oldJson = res.json.bind(res)
  const oldStatus = res.status.bind(res)

  // Interceptar status para saber si es error
  let statusCode = 200
  res.status = (code) => {
    statusCode = code
    return oldStatus(code)
  }

  res.json = (data) => {
    // No envolver errores de validación (400) con success:true
    if (statusCode >= 400) {
      return oldJson(data)
    }

    // Solo envolver respuestas exitosas
    if (req.userData && req.method !== 'GET') {
      return oldJson({
        success: true,
        data: data,
        usuario: req.userData.usuario.nombre,
        rol: req.userData.rolNombre,
        timestamp: new Date().toISOString()
      })
    }
    return oldJson(data)
  }

  next()
})

// Usar middlewares por defecto de json-server
server.use(middlewares)
server.use(jsonServer.bodyParser)

// Middleware de validación de datos (desactivado para permitir datos flexibles)
// server.use(validateQueryParams)
// server.use(validationMiddleware)

// Rutas personalizadas adicionales

// Login endpoint
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body

  reloadDb()

  const usuario = db.usuarios.find(u => u.email === email && u.password === password)

  if (!usuario) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
      message: 'Email o contraseña incorrectos'
    })
  }

  if (!usuario.activo) {
    return res.status(403).json({
      error: 'Usuario inactivo',
      message: 'Tu cuenta ha sido desactivada'
    })
  }

  const rol = db.roles.find(r => r.id === usuario.rolId)

  res.json({
    success: true,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rolId: usuario.rolId,
      rol: rol.nombre,
      permisos: rol.permisos
    },
    token: `Bearer ${Buffer.from(`${usuario.id}:${usuario.rolId}`).toString('base64')}`
  })
})

// Endpoint para verificar permisos
server.get('/auth/permisos', (req, res) => {
  const roleId = parseInt(req.headers['x-role-id'])

  if (!roleId) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  reloadDb()
  const rol = db.roles.find(r => r.id === roleId)

  if (!rol) {
    return res.status(404).json({ error: 'Rol no encontrado' })
  }

  res.json({
    rol: rol.nombre,
    permisos: rol.permisos
  })
})

// Endpoint para obtener módulos accesibles por rol
server.get('/auth/modulos', (req, res) => {
  const roleId = parseInt(req.headers['x-role-id'])

  if (!roleId) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  reloadDb()
  const modulosAccesibles = db.modulos.filter(m => m.accesoRoles.includes(roleId))

  res.json({
    modulos: modulosAccesibles
  })
})

// Middleware para modificar respuestas de json-server
router.render = (req, res) => {
  // Si la respuesta tiene datos y es exitosa, asegurar status 200
  if (res.locals.data) {
    const data = res.locals.data

    // Si tiene estructura de éxito pero status incorrecto
    if (data.success === true) {
      res.status(200).json(data)
    } else {
      res.json(data)
    }
  } else {
    res.json(res.locals.data)
  }
}

// Usar el router de json-server
server.use(router)

// Manejo de errores
server.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  })
})

// Iniciar servidor
server.listen(PORT, () => {
  console.log('🚀 Servidor JSON Server corriendo en:')
  console.log(`   → http://localhost:${PORT}`)
  console.log(`   → Base de datos: ${dbPath}`)
  console.log('\n📚 Recursos disponibles:')
  console.log('   → GET    /roles')
  console.log('   → GET    /usuarios')
  console.log('   → GET    /modulos')
  console.log('   → POST   /auth/login')
  console.log('   → GET    /auth/permisos')
  console.log('   → GET    /auth/modulos')
  console.log('\n🔐 Headers requeridos para operaciones POST/PUT/DELETE:')
  console.log('   → x-role-id: ID del rol')
  console.log('   → x-user-id: ID del usuario')
  console.log('\n✅ Servidor listo para recibir peticiones')
})
