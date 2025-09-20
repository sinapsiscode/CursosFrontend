import { EXAM_AREAS } from '../constants/examManagementConstants'

export const getExamStats = (questions) => {
  const total = questions.length
  const byArea = EXAM_AREAS.map(area => ({
    ...area,
    count: questions.filter(q => q.area === area.value).length
  }))

  const withImages = questions.filter(q => q.questionImage).length
  const withoutImages = total - withImages

  const withImageOptions = questions.filter(q =>
    q.optionImages && q.optionImages.some(img => img)
  ).length

  return {
    total,
    byArea,
    withImages,
    withoutImages,
    withImageOptions
  }
}

export const filterQuestions = (questions, searchTerm, filters = {}) => {
  let filtered = questions

  // Filtro por término de búsqueda
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(question =>
      question.question.toLowerCase().includes(term) ||
      question.options.some(opt => opt.toLowerCase().includes(term)) ||
      question.area.toLowerCase().includes(term)
    )
  }

  // Filtro por área
  if (filters.area && filters.area !== 'all') {
    filtered = filtered.filter(question => question.area === filters.area)
  }

  // Filtro por tipo
  if (filters.type) {
    switch (filters.type) {
      case 'with_image':
        filtered = filtered.filter(q => q.questionImage)
        break
      case 'without_image':
        filtered = filtered.filter(q => !q.questionImage)
        break
      case 'image_options':
        filtered = filtered.filter(q => q.optionImages.some(img => img))
        break
      default:
        break
    }
  }

  return filtered
}

export const validateQuestionForm = (formData) => {
  const errors = {}

  // Validar pregunta
  if (!formData.question.trim()) {
    errors.question = 'La pregunta es obligatoria'
  }

  // Validar opciones
  const filledOptions = formData.options.filter(opt => opt.trim()).length
  if (filledOptions < 2) {
    errors.options = 'Debes proporcionar al menos 2 opciones'
  }

  // Validar que hay al menos una opción no vacía en el índice correcto
  if (formData.correct >= 0 && !formData.options[formData.correct]) {
    errors.correct = 'La respuesta correcta no puede estar vacía'
  }

  // Validar área
  if (!formData.area) {
    errors.area = 'Debes seleccionar un área'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const generateQuestionId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

export const exportQuestionsToJSON = (questions) => {
  const dataStr = JSON.stringify(questions, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

  const exportFileDefaultName = `exam_questions_${new Date().toISOString().split('T')[0]}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const importQuestionsFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const questions = JSON.parse(e.target.result)

        // Validar estructura básica
        if (!Array.isArray(questions)) {
          throw new Error('El archivo no contiene un array de preguntas')
        }

        // Validar que cada pregunta tenga los campos necesarios
        const validQuestions = questions.every(q =>
          q.question &&
          Array.isArray(q.options) &&
          typeof q.correct === 'number' &&
          q.area
        )

        if (!validQuestions) {
          throw new Error('El formato de las preguntas no es válido')
        }

        resolve(questions)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsText(file)
  })
}

export const shuffleOptions = (question) => {
  const correctOption = question.options[question.correct]
  const correctImage = question.optionImages[question.correct]

  // Crear array de índices y mezclarlos
  const indices = question.options
    .map((_, index) => index)
    .sort(() => Math.random() - 0.5)

  // Reordenar opciones según los índices mezclados
  const shuffledOptions = indices.map(i => question.options[i])
  const shuffledImages = indices.map(i => question.optionImages[i])

  // Encontrar el nuevo índice de la respuesta correcta
  const newCorrectIndex = shuffledOptions.indexOf(correctOption)

  return {
    ...question,
    options: shuffledOptions,
    optionImages: shuffledImages,
    correct: newCorrectIndex
  }
}

export const duplicateQuestion = (question) => {
  return {
    ...question,
    id: generateQuestionId(),
    question: `${question.question} (Copia)`
  }
}