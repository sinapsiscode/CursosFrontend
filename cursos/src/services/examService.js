// Servicio de Exámenes y Descuentos
export class ExamService {
  constructor() {
    this.examResults = this.getStoredExamResults()
    this.discountCodes = this.getStoredDiscountCodes()
  }

  // Obtener preguntas del examen inicial
  getExamQuestions() {
    // Primero buscar si hay un examen inicial en los exámenes por curso
    const courseExams = this.getCourseExams()
    const initialExam = courseExams.find(exam => exam.type === 'initial' && exam.isActive)
    
    if (initialExam && initialExam.questions.length > 0) {
      return initialExam.questions
    }
    
    // Si no, buscar en el formato antiguo
    const storedQuestions = localStorage.getItem('exam_questions')
    if (storedQuestions) {
      return JSON.parse(storedQuestions)
    }
    
    // Si no hay preguntas guardadas, devolver las predeterminadas
    return this.getDefaultQuestions()
  }

  // Obtener todos los exámenes por curso
  getCourseExams() {
    const stored = localStorage.getItem('course_exams')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Si no hay exámenes guardados, crear los predeterminados
    const defaultExams = this.getDefaultCourseExams()
    localStorage.setItem('course_exams', JSON.stringify(defaultExams))
    return defaultExams
  }

  // Obtener examen por curso
  getExamByCourse(courseId) {
    const exams = this.getCourseExams()
    return exams.find(exam => 
      exam.courseId === courseId && 
      exam.type === 'course' && 
      exam.isActive
    )
  }

  // Obtener examen por ID
  getExamById(examId) {
    const exams = this.getCourseExams()
    return exams.find(exam => exam.id === examId)
  }

  // Preguntas predeterminadas
  getDefaultQuestions() {
    return [
      {
        id: 1,
        question: "¿Cuál es el principal componente del acero?",
        questionImage: null,
        options: ["Hierro", "Carbono", "Níquel", "Cromo"],
        optionImages: [null, null, null, null],
        correct: 0,
        area: "metalurgia"
      },
      {
        id: 2,
        question: "¿Qué tipo de roca se forma por enfriamiento del magma?",
        questionImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Igneous_rock_formation.jpg/400px-Igneous_rock_formation.jpg",
        options: ["Sedimentaria", "Metamórfica", "Ígnea", "Calcárea"],
        optionImages: [null, null, null, null],
        correct: 2,
        area: "geologia"
      },
      {
        id: 3,
        question: "¿Cuál es el método de extracción minera más común en yacimientos profundos?",
        questionImage: null,
        options: ["Minería a cielo abierto", "Minería subterránea", "Dragado", "Lixiviación"],
        optionImages: [null, null, null, null],
        correct: 1,
        area: "mineria"
      },
      {
        id: 4,
        question: "¿Qué proceso se utiliza para separar el oro de otros minerales?",
        questionImage: null,
        options: ["Destilación", "Cianuración", "Evaporación", "Sublimación"],
        optionImages: [null, null, null, null],
        correct: 1,
        area: "metalurgia"
      },
      {
        id: 5,
        question: "¿Cuál es la escala que mide la dureza de los minerales?",
        questionImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Mohs_scale_diagram.svg/400px-Mohs_scale_diagram.svg.png",
        options: ["Escala Richter", "Escala Mohs", "Escala Beaufort", "Escala Celsius"],
        optionImages: [null, null, null, null],
        correct: 1,
        area: "geologia"
      },
      {
        id: 6,
        question: "¿Qué equipo de protección es esencial en minería subterránea?",
        questionImage: null,
        options: ["Gafas de sol", "Casco con lámpara", "Guantes de látex", "Botas de lluvia"],
        optionImages: [null, null, null, null],
        correct: 1,
        area: "mineria"
      },
      {
        id: 7,
        question: "¿Cuál es la temperatura aproximada de fusión del hierro?",
        questionImage: null,
        options: ["500°C", "1000°C", "1538°C", "2000°C"],
        optionImages: [null, null, null, null],
        correct: 2,
        area: "metalurgia"
      },
      {
        id: 8,
        question: "¿Qué tipo de falla geológica produce terremotos?",
        questionImage: null,
        options: ["Falla normal", "Falla inversa", "Falla de transformación", "Todas las anteriores"],
        optionImages: [null, null, null, null],
        correct: 3,
        area: "geologia"
      },
      {
        id: 9,
        question: "¿Cuál es el principal riesgo en minería a cielo abierto?",
        questionImage: null,
        options: ["Derrumbes", "Inundaciones", "Gases tóxicos", "Deslizamientos"],
        optionImages: [null, null, null, null],
        correct: 3,
        area: "mineria"
      },
      {
        id: 10,
        question: "¿Qué aleación se forma al combinar cobre y estaño?",
        questionImage: null,
        options: ["Latón", "Bronce", "Acero", "Aluminio"],
        optionImages: [
          null,
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bronze_age_axe.jpg/200px-Bronze_age_axe.jpg",
          null,
          null
        ],
        correct: 1,
        area: "metalurgia"
      }
    ]
  }

  // Exámenes predeterminados por curso
  getDefaultCourseExams() {
    return [
      // Examen para Curso ID 1 - Fundamentos de Metalurgia
      {
        id: 'exam_course_1',
        courseId: 1,
        type: 'course',
        title: 'Examen: Fundamentos de Metalurgia',
        description: 'Evalúa tus conocimientos sobre los conceptos básicos de metalurgia',
        duration: 30, // minutos
        attempts: 1,
        passingScore: 60,
        isActive: true,
        questions: [
          {
            id: 1,
            question: "¿Cuál es el principal componente del acero?",
            questionImage: null,
            options: ["Hierro", "Carbono", "Níquel", "Cromo"],
            optionImages: [null, null, null, null],
            correct: 0,
            points: 10
          },
          {
            id: 2,
            question: "¿Qué proceso se utiliza para separar el oro de otros minerales?",
            questionImage: null,
            options: ["Destilación", "Cianuración", "Evaporación", "Sublimación"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 3,
            question: "¿Cuál es la temperatura aproximada de fusión del hierro?",
            questionImage: null,
            options: ["500°C", "1000°C", "1538°C", "2000°C"],
            optionImages: [null, null, null, null],
            correct: 2,
            points: 10
          },
          {
            id: 4,
            question: "¿Qué aleación se forma al combinar cobre y estaño?",
            questionImage: null,
            options: ["Latón", "Bronce", "Acero", "Aluminio"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 5,
            question: "¿Cuál es el proceso de endurecimiento del acero mediante calentamiento y enfriamiento rápido?",
            questionImage: null,
            options: ["Recocido", "Temple", "Normalizado", "Revenido"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          }
        ]
      },

      // Examen para Curso ID 2 - Procesos de Fundición Avanzada
      {
        id: 'exam_course_2',
        courseId: 2,
        type: 'course',
        title: 'Examen: Procesos de Fundición Avanzada',
        description: 'Evalúa tus conocimientos avanzados sobre técnicas de fundición',
        duration: 45, // minutos
        attempts: 2,
        passingScore: 70,
        isActive: true,
        questions: [
          {
            id: 1,
            question: "¿Cuál es la principal ventaja de la fundición en arena?",
            questionImage: null,
            options: ["Mayor precisión", "Bajo costo", "Alta velocidad", "Mejor acabado"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 2,
            question: "¿Qué tipo de horno se utiliza principalmente para fundir hierro?",
            questionImage: null,
            options: ["Horno eléctrico", "Alto horno", "Horno de inducción", "Horno solar"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 3,
            question: "¿Cuál es el defecto más común en piezas fundidas?",
            questionImage: null,
            options: ["Grietas", "Porosidad", "Inclusiones", "Deformación"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 4,
            question: "¿Qué material se usa como aglomerante en la fundición en arena verde?",
            questionImage: null,
            options: ["Cemento", "Arcilla bentonítica", "Resina", "Yeso"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 5,
            question: "¿Cuál es la temperatura típica de colada para el aluminio?",
            questionImage: null,
            options: ["500-600°C", "650-750°C", "800-900°C", "1000-1100°C"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          }
        ]
      },

      // Examen para Curso ID 3 - Tratamientos Térmicos
      {
        id: 'exam_course_3',
        courseId: 3,
        type: 'course',
        title: 'Examen: Tratamientos Térmicos',
        description: 'Evalúa tus conocimientos sobre tratamientos térmicos de materiales',
        duration: 35, // minutos
        attempts: 1,
        passingScore: 65,
        isActive: true,
        questions: [
          {
            id: 1,
            question: "¿Cuál es el objetivo principal del recocido?",
            questionImage: null,
            options: ["Endurecer el material", "Ablandar y eliminar tensiones", "Mejorar la resistencia a la corrosión", "Aumentar la dureza superficial"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 2,
            question: "¿Qué tratamiento térmico aumenta la dureza pero reduce la ductilidad?",
            questionImage: null,
            options: ["Recocido", "Normalizado", "Temple", "Revenido"],
            optionImages: [null, null, null, null],
            correct: 2,
            points: 10
          },
          {
            id: 3,
            question: "¿Cuál es la diferencia principal entre temple y revenido?",
            questionImage: null,
            options: ["La temperatura utilizada", "El medio de enfriamiento", "El temple endurece y el revenido reduce fragilidad", "No hay diferencia"],
            optionImages: [null, null, null, null],
            correct: 2,
            points: 10
          },
          {
            id: 4,
            question: "¿Qué medio de enfriamiento es más severo para el temple?",
            questionImage: null,
            options: ["Aire", "Aceite", "Agua", "Salmuera"],
            optionImages: [null, null, null, null],
            correct: 3,
            points: 10
          },
          {
            id: 5,
            question: "¿A qué temperatura se realiza típicamente el revenido del acero?",
            questionImage: null,
            options: ["100-200°C", "200-650°C", "700-900°C", "1000°C o más"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          }
        ]
      },

      // Examen para Curso ID 4 - Introducción a la Minería
      {
        id: 'exam_course_4',
        courseId: 4,
        type: 'course',
        title: 'Examen: Introducción a la Minería',
        description: 'Evalúa tus conocimientos básicos sobre minería',
        duration: 30, // minutos
        attempts: 1,
        passingScore: 60,
        isActive: true,
        questions: [
          {
            id: 1,
            question: "¿Cuál es el método de extracción minera más común en yacimientos profundos?",
            questionImage: null,
            options: ["Minería a cielo abierto", "Minería subterránea", "Dragado", "Lixiviación"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 2,
            question: "¿Qué equipo de protección es esencial en minería subterránea?",
            questionImage: null,
            options: ["Gafas de sol", "Casco con lámpara", "Guantes de látex", "Botas de lluvia"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 3,
            question: "¿Cuál es el principal riesgo en minería a cielo abierto?",
            questionImage: null,
            options: ["Derrumbes", "Inundaciones", "Gases tóxicos", "Deslizamientos"],
            optionImages: [null, null, null, null],
            correct: 3,
            points: 10
          },
          {
            id: 4,
            question: "¿Qué tipo de minería se utiliza para extraer carbón superficial?",
            questionImage: null,
            options: ["Minería de pozo", "Minería a cielo abierto", "Minería submarina", "Minería de galería"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          },
          {
            id: 5,
            question: "¿Cuál es el proceso de separación de minerales valiosos de la ganga?",
            questionImage: null,
            options: ["Extracción", "Beneficio", "Refinación", "Fundición"],
            optionImages: [null, null, null, null],
            correct: 1,
            points: 10
          }
        ]
      }
    ]
  }

  // Obtener resultados de exámenes almacenados
  getStoredExamResults() {
    const stored = localStorage.getItem('exam_results')
    return stored ? JSON.parse(stored) : {}
  }

  // Obtener códigos de descuento almacenados
  getStoredDiscountCodes() {
    const stored = localStorage.getItem('discount_codes')
    return stored ? JSON.parse(stored) : {}
  }

  // Guardar resultados de examen
  saveExamResults() {
    localStorage.setItem('exam_results', JSON.stringify(this.examResults))
  }

  // Guardar códigos de descuento
  saveDiscountCodes() {
    localStorage.setItem('discount_codes', JSON.stringify(this.discountCodes))
  }

  // Guardar resultado del examen inicial
  async saveExamResult(userId, examData) {
    try {
      // Guardar resultado del examen
      if (!this.examResults[userId]) {
        this.examResults[userId] = {}
      }
      
      this.examResults[userId].initial = {
        ...examData,
        id: `exam_${Date.now()}`,
        userId
      }
      
      // Generar código de descuento si aplica
      if (examData.discount > 0) {
        const discountCode = this.generateDiscountCode(userId, examData.discount)
        this.examResults[userId].initial.discountCode = discountCode
        
        // Guardar código de descuento
        this.discountCodes[discountCode] = {
          userId,
          discount: examData.discount,
          type: 'initial_exam',
          used: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        }
        this.saveDiscountCodes()
      }
      
      // Agregar puntos de bonificación si sacó más de 15
      if (examData.score >= 15) {
        this.examResults[userId].initial.bonusPoints = 5
      }
      
      this.saveExamResults()
      
      return {
        success: true,
        discountCode: this.examResults[userId].initial.discountCode,
        bonusPoints: this.examResults[userId].initial.bonusPoints || 0
      }
    } catch (error) {
      console.error('Error saving exam result:', error)
      return { success: false, error: error.message }
    }
  }

  // Generar código de descuento único
  generateDiscountCode(userId, discount) {
    const prefix = 'EXAM'
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${discount}${suffix}`
  }

  // Verificar si el usuario ya hizo el examen inicial
  hasCompletedInitialExam(userId) {
    return !!(this.examResults[userId]?.initial)
  }

  // Obtener resultado del examen inicial
  getInitialExamResult(userId) {
    return this.examResults[userId]?.initial || null
  }

  // Verificar si el usuario cerró el examen sin hacerlo
  hasSkippedExam() {
    return localStorage.getItem('examDismissed') === 'true'
  }

  // Marcar examen como omitido
  markExamAsSkipped() {
    localStorage.setItem('examDismissed', 'true')
  }

  // Verificar resultado pendiente (usuario no autenticado)
  getPendingExamResult() {
    const stored = localStorage.getItem('pendingExamResult')
    return stored ? JSON.parse(stored) : null
  }

  // Aplicar resultado pendiente a usuario autenticado
  async applyPendingExamResult(userId) {
    const pendingResult = this.getPendingExamResult()
    if (pendingResult) {
      const result = await this.saveExamResult(userId, pendingResult)
      if (result.success) {
        localStorage.removeItem('pendingExamResult')
      }
      return result
    }
    return null
  }

  // Validar código de descuento
  validateDiscountCode(code) {
    const discount = this.discountCodes[code]
    
    if (!discount) {
      return { valid: false, error: 'Código inválido' }
    }
    
    if (discount.used) {
      return { valid: false, error: 'Código ya utilizado' }
    }
    
    if (new Date(discount.expiresAt) < new Date()) {
      return { valid: false, error: 'Código expirado' }
    }
    
    return {
      valid: true,
      discount: discount.discount,
      type: discount.type
    }
  }

  // Usar código de descuento
  useDiscountCode(code, userId) {
    const validation = this.validateDiscountCode(code)
    
    if (!validation.valid) {
      return validation
    }
    
    // Verificar que el código pertenece al usuario (para códigos de examen)
    const discount = this.discountCodes[code]
    if (discount.type === 'initial_exam' && discount.userId !== userId) {
      return { valid: false, error: 'Este código no te pertenece' }
    }
    
    // Marcar como usado
    this.discountCodes[code].used = true
    this.discountCodes[code].usedAt = new Date().toISOString()
    this.discountCodes[code].usedBy = userId
    this.saveDiscountCodes()
    
    return {
      valid: true,
      discount: discount.discount,
      message: `Descuento del ${discount.discount}% aplicado exitosamente`
    }
  }

  // Obtener todos los descuentos de un usuario
  getUserDiscounts(userId) {
    const userDiscounts = []
    
    // Descuentos por examen inicial
    const initialExam = this.getInitialExamResult(userId)
    if (initialExam?.discountCode) {
      const discount = this.discountCodes[initialExam.discountCode]
      if (discount) {
        userDiscounts.push({
          code: initialExam.discountCode,
          discount: discount.discount,
          type: 'Examen Inicial',
          used: discount.used,
          expiresAt: discount.expiresAt,
          status: discount.used ? 'Usado' : new Date(discount.expiresAt) < new Date() ? 'Expirado' : 'Activo'
        })
      }
    }
    
    // Aquí se pueden agregar otros tipos de descuentos en el futuro
    // Por ejemplo: descuentos por completar cursos, por referidos, etc.
    
    return userDiscounts
  }

  // Guardar resultado de examen de curso
  async saveCourseExamResult(userId, examData) {
    try {
      // Obtener resultados existentes
      const courseExamResults = this.getCourseExamResults()
      
      // Crear ID único para el resultado
      const resultId = `${userId}_${examData.courseId}_${examData.examId}_${Date.now()}`
      
      // Guardar resultado
      courseExamResults[resultId] = {
        ...examData,
        id: resultId,
        userId,
        createdAt: new Date().toISOString()
      }
      
      // Guardar en localStorage
      localStorage.setItem('course_exam_results', JSON.stringify(courseExamResults))
      
      // Si hay descuento, generar código
      if (examData.discount > 0) {
        const discountCode = this.generateCourseDiscountCode(userId, examData.courseId, examData.discount)
        courseExamResults[resultId].discountCode = discountCode
        
        // Guardar código de descuento
        this.discountCodes[discountCode] = {
          userId,
          courseId: examData.courseId,
          discount: examData.discount,
          type: 'course_exam',
          used: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        }
        this.saveDiscountCodes()
      }
      
      return {
        success: true,
        discountCode: courseExamResults[resultId].discountCode
      }
    } catch (error) {
      console.error('Error saving course exam result:', error)
      return { success: false, error: error.message }
    }
  }

  // Obtener resultados de exámenes de curso
  getCourseExamResults() {
    const stored = localStorage.getItem('course_exam_results')
    return stored ? JSON.parse(stored) : {}
  }

  // Generar código de descuento para curso específico
  generateCourseDiscountCode(userId, courseId, discount) {
    const prefix = 'COURSE'
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${discount}${suffix}`
  }

  // Obtener mejor resultado de un usuario en un curso
  getBestCourseExamResult(userId, courseId) {
    const allResults = this.getCourseExamResults()
    const userCourseResults = Object.values(allResults).filter(
      result => result.userId === userId && result.courseId === courseId
    )
    
    if (userCourseResults.length === 0) return null
    
    // Devolver el mejor resultado (mayor descuento)
    return userCourseResults.reduce((best, current) => 
      current.discount > best.discount ? current : best
    )
  }

  // Obtener estadísticas de exámenes (para admin)
  getExamStats() {
    const stats = {
      totalExams: 0,
      averageScore: 0,
      scoreDistribution: {
        '0-10': 0,
        '11-14': 0,
        '15-17': 0,
        '18-20': 0
      },
      discountsGenerated: 0,
      discountsUsed: 0,
      totalDiscountValue: 0
    }
    
    // Calcular estadísticas de exámenes
    Object.values(this.examResults).forEach(userExams => {
      if (userExams.initial) {
        stats.totalExams++
        stats.averageScore += userExams.initial.score
        
        // Distribución de puntajes
        const score = userExams.initial.score
        if (score <= 10) stats.scoreDistribution['0-10']++
        else if (score <= 14) stats.scoreDistribution['11-14']++
        else if (score <= 17) stats.scoreDistribution['15-17']++
        else stats.scoreDistribution['18-20']++
        
        if (userExams.initial.discountCode) {
          stats.discountsGenerated++
        }
      }
    })
    
    // Calcular promedio
    if (stats.totalExams > 0) {
      stats.averageScore = Math.round(stats.averageScore / stats.totalExams * 10) / 10
    }
    
    // Calcular uso de descuentos
    Object.values(this.discountCodes).forEach(discount => {
      if (discount.used) {
        stats.discountsUsed++
        stats.totalDiscountValue += discount.discount
      }
    })
    
    return stats
  }
}

// Instancia singleton
export const examService = new ExamService()