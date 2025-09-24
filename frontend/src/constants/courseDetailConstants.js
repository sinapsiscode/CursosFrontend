export const AREA_COLORS = {
  metalurgia: {
    bg: 'bg-primary-metalurgia',
    text: 'text-primary-metalurgia',
    border: 'border-primary-metalurgia'
  },
  mineria: {
    bg: 'bg-primary-mineria',
    text: 'text-primary-mineria',
    border: 'border-primary-mineria'
  },
  geologia: {
    bg: 'bg-primary-geologia',
    text: 'text-primary-geologia',
    border: 'border-primary-geologia'
  }
}

export const LEVEL_COLORS = {
  básico: 'bg-green-500',
  intermedio: 'bg-yellow-500',
  avanzado: 'bg-red-500'
}

export const MATERIAL_COLORS = {
  pdf: 'bg-red-500',
  document: 'bg-blue-500',
  excel: 'bg-green-500',
  presentation: 'bg-orange-500',
  video: 'bg-purple-500',
  default: 'bg-gray-500'
}

export const COURSE_DETAIL_CONFIG = {
  tabs: [
    { id: 'temario', label: 'Temario' },
    { id: 'sobre', label: 'Sobre el curso' },
    { id: 'reseñas', label: 'Reseñas' }
  ],

  badges: {
    new: 'NUEVO',
    free: 'GRATIS'
  },

  labels: {
    students: 'estudiantes',
    classes: 'clases',
    materials: 'materiales',
    free: 'Gratis',
    courseContent: 'Contenido del curso',
    aboutCourse: 'Sobre este curso',
    studentReviews: 'Reseñas de estudiantes',
    whatYouWillLearn: 'Lo que aprenderás',
    instructor: 'Instructor',
    includedMaterials: 'Materiales incluidos',
    availableMaterials: 'Materiales Disponibles',
    download: 'Descargar',
    loginToViewMaterials: 'Iniciar Sesión para Ver Materiales',
    writeReview: 'Escribir Reseña',
    averageOf: 'Promedio de',
    reviews: 'reseñas',
    review: 'reseña',
    noReviewsYet: 'Aún no hay reseñas',
    beFirstToReview: 'Sé el primero en compartir tu experiencia con este curso',
    writeFirstReview: 'Escribir la primera reseña',
    verified: 'Verificado',
    approved: 'Verificado',
    developmentMode: 'Modo Desarrollo',
    loadTestData: 'Carga datos de prueba para ver cómo se verán las reseñas',
    loadTestDataButton: 'Cargar Datos de Prueba',
    completeCourse: 'Completar Curso',
    accessCourse: 'Acceder al Curso',
    takeExam: 'Rendir Examen',
    earnPoints: 'Gana',
    points: 'puntos',
    user: 'Usuario'
  },

  messages: {
    courseNotFound: 'Curso no encontrado',
    backToCourses: 'Volver a cursos',
    premiumRequired: 'Acceso Premium Requerido',
    premiumContent: 'Este contenido requiere una suscripción premium para acceder.',
    close: 'Cerrar',
    viewPlans: 'Ver planes',
    thankYou: '¡Gracias por tu comentario!',
    reviewHelps: 'Tu opinión nos ayuda a seguir mejorando. Tu reseña será revisada y publicada pronto.',
    reviewModeration: 'Las reseñas son moderadas para garantizar su calidad',
    continue: 'Continuar',
    examAvailable: 'Examen Disponible',
    enrollToTakeExam: 'Inscríbete en este curso para rendir el examen inmediatamente y obtener descuentos.',
    getDiscount: '¡Obtén un descuento!',
    examDiscountInfo: 'Inscríbete y rinde el examen para obtener hasta un',
    discountPercent: '20% de descuento',
    basedOnScore: 'en este curso según tu calificación.',
    discountStructure: {
      high: '18-20 puntos: 20% descuento',
      medium: '15-17 puntos: 15% descuento',
      low: '11-14 puntos: 10% descuento'
    }
  },

  exam: {
    discountSystem: 'Sistema de Descuentos por Calificación',
    duration: 'Duración',
    questions: 'Preguntas',
    attempts: 'Intentos',
    passing: 'Aprobación',
    minutes: 'minutos',
    startExam: 'Comenzar Examen',
    cancel: 'Cancelar',
    scoreRanges: [
      { min: 18, max: 20, discount: 20, color: 'text-green-400' },
      { min: 15, max: 17, discount: 15, color: 'text-yellow-400' },
      { min: 11, max: 14, discount: 10, color: 'text-orange-400' },
      { min: 0, max: 10, discount: 0, color: 'text-gray-400' }
    ]
  },

  learningPoints: [
    'Fundamentos teóricos y prácticos de',
    'Aplicación de conceptos en casos reales',
    'Mejores prácticas de la industria',
    'Herramientas y tecnologías actuales'
  ]
}