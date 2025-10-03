const { faker } = require('@faker-js/faker/locale/es')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

console.log('🌱 Iniciando seed de datos...\n')

// Definición de roles con sus permisos
const roles = [
  {
    id: 1,
    nombre: 'Super Administrador',
    codigo: 'super_admin',
    permisos: [
      'crear_usuario',
      'editar_usuario',
      'eliminar_usuario',
      'ver_usuarios',
      'crear_curso',
      'editar_curso',
      'eliminar_curso',
      'ver_cursos',
      'crear_examen',
      'editar_examen',
      'eliminar_examen',
      'ver_examenes',
      'crear_evento',
      'editar_evento',
      'eliminar_evento',
      'ver_eventos',
      'ver_reportes',
      'gestionar_roles',
      'gestionar_areas',
      'gestionar_notificaciones',
      'gestionar_fotos',
      'gestionar_cupones',
      'gestionar_fidelizacion'
    ]
  },
  {
    id: 2,
    nombre: 'Administrador',
    codigo: 'admin',
    permisos: [
      'crear_usuario',
      'editar_usuario',
      'ver_usuarios',
      'crear_curso',
      'editar_curso',
      'ver_cursos',
      'crear_examen',
      'editar_examen',
      'ver_examenes',
      'crear_evento',
      'editar_evento',
      'ver_eventos',
      'ver_reportes',
      'gestionar_areas',
      'gestionar_notificaciones'
    ]
  },
  {
    id: 3,
    nombre: 'Instructor',
    codigo: 'instructor',
    permisos: [
      'ver_usuarios',
      'crear_curso',
      'editar_curso',
      'ver_cursos',
      'crear_examen',
      'editar_examen',
      'ver_examenes',
      'ver_eventos',
      'gestionar_notificaciones'
    ]
  },
  {
    id: 4,
    nombre: 'Coordinador',
    codigo: 'coordinador',
    permisos: [
      'ver_usuarios',
      'ver_cursos',
      'crear_evento',
      'editar_evento',
      'ver_eventos',
      'ver_reportes',
      'gestionar_notificaciones'
    ]
  },
  {
    id: 5,
    nombre: 'Estudiante Premium',
    codigo: 'estudiante_premium',
    permisos: [
      'ver_cursos',
      'inscribir_curso',
      'ver_examenes',
      'tomar_examen',
      'ver_eventos',
      'registrar_evento',
      'descargar_certificado',
      'acceso_premium'
    ]
  },
  {
    id: 6,
    nombre: 'Estudiante',
    codigo: 'estudiante',
    permisos: [
      'ver_cursos',
      'inscribir_curso',
      'ver_examenes',
      'tomar_examen',
      'ver_eventos',
      'descargar_certificado'
    ]
  },
  {
    id: 7,
    nombre: 'Invitado',
    codigo: 'invitado',
    permisos: [
      'ver_cursos',
      'ver_eventos'
    ]
  }
]

// Módulos del sistema
const modulos = [
  {
    id: 1,
    nombre: 'Dashboard',
    descripcion: 'Panel principal con estadísticas',
    ruta: '/admin/dashboard',
    icono: 'dashboard',
    accesoRoles: [1, 2, 3, 4]
  },
  {
    id: 2,
    nombre: 'Gestión de Usuarios',
    descripcion: 'Administración de estudiantes y usuarios',
    ruta: '/admin/students',
    icono: 'users',
    accesoRoles: [1, 2]
  },
  {
    id: 3,
    nombre: 'Gestión de Cursos',
    descripcion: 'Creación y edición de cursos',
    ruta: '/admin/courses',
    icono: 'book',
    accesoRoles: [1, 2, 3]
  },
  {
    id: 4,
    nombre: 'Gestión de Exámenes',
    descripcion: 'Creación y gestión de evaluaciones',
    ruta: '/admin/exams',
    icono: 'clipboard',
    accesoRoles: [1, 2, 3]
  },
  {
    id: 5,
    nombre: 'Gestión de Eventos',
    descripcion: 'Organización de webinars y eventos',
    ruta: '/admin/events',
    icono: 'calendar',
    accesoRoles: [1, 2, 4]
  },
  {
    id: 6,
    nombre: 'Reportes y Analytics',
    descripcion: 'Análisis y reportes del sistema',
    ruta: '/admin/analytics',
    icono: 'chart',
    accesoRoles: [1, 2, 4]
  },
  {
    id: 7,
    nombre: 'Gestión de Áreas',
    descripcion: 'Administración de áreas de conocimiento',
    ruta: '/admin/areas',
    icono: 'folder',
    accesoRoles: [1, 2]
  },
  {
    id: 8,
    nombre: 'Notificaciones',
    descripcion: 'Sistema de notificaciones',
    ruta: '/admin/notifications',
    icono: 'bell',
    accesoRoles: [1, 2, 3, 4]
  },
  {
    id: 9,
    nombre: 'Cupones',
    descripcion: 'Gestión de cupones de descuento',
    ruta: '/admin/coupons',
    icono: 'tag',
    accesoRoles: [1, 2]
  },
  {
    id: 10,
    nombre: 'Programa de Fidelización',
    descripcion: 'Sistema de puntos y recompensas',
    ruta: '/admin/loyalty',
    icono: 'star',
    accesoRoles: [1, 2]
  }
]

// Generar usuarios de ejemplo
const generarUsuarios = (cantidad = 50) => {
  const usuarios = []

  // Usuario admin principal
  usuarios.push({
    id: 1,
    nombre: 'Admin Principal',
    email: 'admin@cursos.com',
    password: 'admin123',
    rolId: 1,
    activo: true,
    avatar: faker.image.avatar(),
    telefono: faker.phone.number('###-###-####'),
    fechaCreacion: faker.date.past({ years: 2 }).toISOString(),
    ultimoAcceso: faker.date.recent({ days: 7 }).toISOString()
  })

  // Otros usuarios
  for (let i = 2; i <= cantidad; i++) {
    const rolId = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7])
    const nombre = faker.person.fullName()
    const email = faker.internet.email({ firstName: nombre.split(' ')[0], lastName: nombre.split(' ')[1] }).toLowerCase()

    usuarios.push({
      id: i,
      nombre,
      email,
      password: faker.internet.password({ length: 8 }),
      rolId,
      activo: faker.datatype.boolean(0.9), // 90% activos
      avatar: faker.image.avatar(),
      telefono: faker.phone.number('###-###-####'),
      fechaCreacion: faker.date.past({ years: 2 }).toISOString(),
      ultimoAcceso: faker.date.recent({ days: 30 }).toISOString()
    })
  }

  return usuarios
}

// Generar áreas de conocimiento
const generarAreas = () => {
  const areas = [
    { id: 1, nombre: 'Metalurgia', codigo: 'metalurgia', descripcion: 'Cursos de metalurgia y procesos metalúrgicos', color: '#3B82F6', activo: true },
    { id: 2, nombre: 'Minería', codigo: 'mineria', descripcion: 'Cursos de minería y extracción de minerales', color: '#10B981', activo: true },
    { id: 3, nombre: 'Geología', codigo: 'geologia', descripcion: 'Cursos de geología y ciencias de la tierra', color: '#F59E0B', activo: true },
    { id: 4, nombre: 'Ingeniería Civil', codigo: 'ingenieria-civil', descripcion: 'Cursos de ingeniería civil y construcción', color: '#EF4444', activo: true },
    { id: 5, nombre: 'Seguridad Industrial', codigo: 'seguridad', descripcion: 'Cursos de seguridad y salud ocupacional', color: '#8B5CF6', activo: true }
  ]

  return areas
}

// Generar cursos
const generarCursos = (areas, cantidad = 30) => {
  const cursos = []
  const niveles = ['Básico', 'Intermedio', 'Avanzado']

  for (let i = 1; i <= cantidad; i++) {
    const area = faker.helpers.arrayElement(areas)
    const nivel = faker.helpers.arrayElement(niveles)

    cursos.push({
      id: i,
      titulo: `${faker.company.buzzPhrase()} en ${area.nombre}`,
      descripcion: faker.lorem.paragraph(),
      areaId: area.id,
      nivel,
      duracion: faker.number.int({ min: 20, max: 120 }),
      precio: faker.number.int({ min: 50, max: 500 }),
      descuento: faker.helpers.arrayElement([0, 10, 20, 30]),
      instructor: faker.person.fullName(),
      imagen: `https://picsum.photos/seed/${i}/400/300`,
      activo: faker.datatype.boolean(0.8),
      destacado: faker.datatype.boolean(0.3),
      calificacion: parseFloat(faker.number.float({ min: 3.5, max: 5, precision: 0.1 }).toFixed(1)),
      estudiantesInscritos: faker.number.int({ min: 10, max: 500 }),
      fechaCreacion: faker.date.past({ years: 1 }).toISOString()
    })
  }

  return cursos
}

// Generar eventos
const generarEventos = (areas, cantidad = 20) => {
  const eventos = []
  const tipos = ['webinar', 'masterclass', 'promotion', 'bundle']

  for (let i = 1; i <= cantidad; i++) {
    const area = faker.helpers.arrayElement(areas)
    const tipo = faker.helpers.arrayElement(tipos)
    const maxRegistros = tipo === 'webinar' ? faker.number.int({ min: 50, max: 200 }) : null
    const registros = maxRegistros ? faker.number.int({ min: 0, max: maxRegistros }) : null

    eventos.push({
      id: i,
      titulo: `${faker.company.buzzPhrase()} - ${area.nombre}`,
      descripcion: faker.lorem.paragraph(),
      tipo,
      areaId: area.id,
      fecha: faker.date.future({ years: 0.5 }).toISOString(),
      duracion: faker.number.int({ min: 60, max: 180 }),
      maxRegistros,
      registros,
      activo: true,
      tags: faker.helpers.arrayElements(['online', 'gratuito', 'certificado', 'premium', 'nuevo'], { min: 2, max: 4 }),
      instructor: faker.person.fullName(),
      urlTransmision: tipo === 'webinar' ? faker.internet.url() : null,
      fechaCreacion: faker.date.past({ years: 0.5 }).toISOString()
    })
  }

  return eventos
}

// Generar exámenes
const generarExamenes = (cursos, cantidad = 25) => {
  const examenes = []

  for (let i = 1; i <= cantidad; i++) {
    const curso = faker.helpers.arrayElement(cursos)

    examenes.push({
      id: i,
      titulo: `Examen de ${curso.titulo}`,
      descripcion: `Evaluación de conocimientos del curso ${curso.titulo}`,
      cursoId: curso.id,
      duracion: faker.number.int({ min: 30, max: 120 }),
      puntajeAprobacion: faker.number.int({ min: 60, max: 80 }),
      intentosMaximos: faker.helpers.arrayElement([1, 2, 3, 5]),
      activo: true,
      preguntas: generarPreguntas(faker.number.int({ min: 5, max: 15 })),
      fechaCreacion: faker.date.past({ years: 0.5 }).toISOString()
    })
  }

  return examenes
}

// Generar preguntas para un examen
const generarPreguntas = (cantidad) => {
  const preguntas = []

  for (let i = 1; i <= cantidad; i++) {
    preguntas.push({
      id: i,
      pregunta: faker.lorem.sentence() + '?',
      puntos: faker.helpers.arrayElement([5, 10, 15, 20]),
      opciones: [
        { texto: faker.lorem.words(3), correcta: true },
        { texto: faker.lorem.words(3), correcta: false },
        { texto: faker.lorem.words(3), correcta: false },
        { texto: faker.lorem.words(3), correcta: false }
      ],
      orden: i
    })
  }

  return preguntas
}

// Generar notificaciones
const generarNotificaciones = (usuarios, cantidad = 100) => {
  const notificaciones = []
  const tipos = ['info', 'success', 'warning', 'error']
  const categorias = ['curso', 'examen', 'evento', 'sistema', 'pago']

  for (let i = 1; i <= cantidad; i++) {
    const usuario = faker.helpers.arrayElement(usuarios)

    notificaciones.push({
      id: i,
      usuarioId: usuario.id,
      tipo: faker.helpers.arrayElement(tipos),
      categoria: faker.helpers.arrayElement(categorias),
      titulo: faker.lorem.sentence({ min: 3, max: 6 }),
      mensaje: faker.lorem.sentence({ min: 8, max: 15 }),
      leida: faker.datatype.boolean(0.6),
      fecha: faker.date.recent({ days: 30 }).toISOString()
    })
  }

  return notificaciones
}

// Función principal
async function seed() {
  try {
    console.log('📝 Generando roles...')
    console.log(`   ✓ ${roles.length} roles creados`)

    console.log('\n🏢 Generando módulos...')
    console.log(`   ✓ ${modulos.length} módulos creados`)

    console.log('\n👥 Generando usuarios...')
    const usuarios = generarUsuarios(50)
    console.log(`   ✓ ${usuarios.length} usuarios creados`)

    console.log('\n📚 Generando áreas...')
    const areas = generarAreas()
    console.log(`   ✓ ${areas.length} áreas creadas`)

    console.log('\n📖 Generando cursos...')
    const cursos = generarCursos(areas, 30)
    console.log(`   ✓ ${cursos.length} cursos creados`)

    console.log('\n📅 Generando eventos...')
    const eventos = generarEventos(areas, 20)
    console.log(`   ✓ ${eventos.length} eventos creados`)

    console.log('\n📝 Generando exámenes...')
    const examenes = generarExamenes(cursos, 25)
    console.log(`   ✓ ${examenes.length} exámenes creados`)

    console.log('\n🔔 Generando notificaciones...')
    const notificaciones = generarNotificaciones(usuarios, 100)
    console.log(`   ✓ ${notificaciones.length} notificaciones creadas`)

    // Crear objeto de base de datos
    const db = {
      roles,
      modulos,
      usuarios,
      areas,
      cursos,
      eventos,
      examenes,
      notificaciones,
      inscripciones: [],
      cupones: [],
      fidelizacion: []
    }

    // Guardar en db.json
    const dbPath = path.join(__dirname, 'db.json')
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')

    console.log('\n✅ Base de datos generada exitosamente!')
    console.log(`   📁 Archivo: ${dbPath}`)
    console.log('\n📊 Resumen:')
    console.log(`   • Roles: ${roles.length}`)
    console.log(`   • Módulos: ${modulos.length}`)
    console.log(`   • Usuarios: ${usuarios.length}`)
    console.log(`   • Áreas: ${areas.length}`)
    console.log(`   • Cursos: ${cursos.length}`)
    console.log(`   • Eventos: ${eventos.length}`)
    console.log(`   • Exámenes: ${examenes.length}`)
    console.log(`   • Notificaciones: ${notificaciones.length}`)
    console.log('\n🚀 Puedes iniciar el servidor con: npm run dev')

  } catch (error) {
    console.error('\n❌ Error generando seed:', error)
    process.exit(1)
  }
}

// Ejecutar seed
seed()
