import { useState, useEffect } from 'react'
import { useUIStore } from '../store'
import { examenesService as examService } from '../services/examenesService'
import { DEFAULT_QUESTION_FORM, DEFAULT_QUESTIONS } from '../constants/examManagementConstants'
import { validateQuestionForm, generateQuestionId, importQuestionsFromJSON } from '../utils/examManagementUtils'

export const useExamManagement = () => {
  const { showToast } = useUIStore()

  // Estados principales
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados de UI
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    area: 'all',
    type: 'all'
  })

  // Estado del formulario
  const [formData, setFormData] = useState(DEFAULT_QUESTION_FORM)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = () => {
    try {
      setLoading(true)
      const storedQuestions = localStorage.getItem('exam_questions')

      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions))
      } else {
        // Si no hay preguntas guardadas, usar las predeterminadas
        setQuestions(DEFAULT_QUESTIONS)
        localStorage.setItem('exam_questions', JSON.stringify(DEFAULT_QUESTIONS))
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      showToast('Error al cargar las preguntas', 'error')
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const saveQuestions = (updatedQuestions) => {
    try {
      localStorage.setItem('exam_questions', JSON.stringify(updatedQuestions))
      setQuestions(updatedQuestions)
      return true
    } catch (error) {
      console.error('Error saving questions:', error)
      showToast('Error al guardar las preguntas', 'error')
      return false
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Limpiar error de validación
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({ ...prev, options: newOptions }))
  }

  const handleOptionImageChange = (index, value) => {
    const newImages = [...formData.optionImages]
    newImages[index] = value
    setFormData(prev => ({ ...prev, optionImages: newImages }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validateQuestionForm(formData)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      showToast('Por favor corrige los errores en el formulario', 'error')
      return
    }

    try {
      let updatedQuestions

      if (editingQuestion) {
        // Actualizar pregunta existente
        updatedQuestions = questions.map(q =>
          q.id === editingQuestion.id ? { ...formData, id: editingQuestion.id } : q
        )
        showToast('✅ Pregunta actualizada correctamente', 'success')
      } else {
        // Crear nueva pregunta
        const newQuestion = {
          ...formData,
          id: generateQuestionId()
        }
        updatedQuestions = [...questions, newQuestion]
        showToast('✅ Pregunta creada correctamente', 'success')
      }

      if (saveQuestions(updatedQuestions)) {
        handleCloseForm()
      }
    } catch (error) {
      console.error('Error saving question:', error)
      showToast('Error al guardar la pregunta', 'error')
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      ...question,
      options: [...question.options],
      optionImages: [...question.optionImages]
    })
    setShowQuestionForm(true)
  }

  const handleDelete = (questionId) => {
    const question = questions.find(q => q.id === questionId)
    if (window.confirm(`¿Estás seguro de que quieres eliminar la pregunta:\n"${question.question}"?`)) {
      const updatedQuestions = questions.filter(q => q.id !== questionId)

      if (saveQuestions(updatedQuestions)) {
        showToast('✅ Pregunta eliminada correctamente', 'success')
      }
    }
  }

  const handleDuplicate = (question) => {
    const duplicatedQuestion = {
      ...question,
      id: generateQuestionId(),
      question: `${question.question} (Copia)`,
      options: [...question.options],
      optionImages: [...question.optionImages]
    }

    const updatedQuestions = [...questions, duplicatedQuestion]

    if (saveQuestions(updatedQuestions)) {
      showToast('✅ Pregunta duplicada correctamente', 'success')
    }
  }

  const handleImport = async (file) => {
    try {
      const importedQuestions = await importQuestionsFromJSON(file)
      const updatedQuestions = [...questions, ...importedQuestions]

      if (saveQuestions(updatedQuestions)) {
        showToast(`✅ ${importedQuestions.length} preguntas importadas correctamente`, 'success')
      }
    } catch (error) {
      console.error('Error importing questions:', error)
      showToast(`Error al importar: ${error.message}`, 'error')
    }
  }

  const handleCloseForm = () => {
    setShowQuestionForm(false)
    setEditingQuestion(null)
    setFormData(DEFAULT_QUESTION_FORM)
    setValidationErrors({})
  }

  const resetToDefaults = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar las preguntas predeterminadas?\nEsto eliminará todas las preguntas personalizadas.')) {
      if (saveQuestions(DEFAULT_QUESTIONS)) {
        showToast('✅ Preguntas restauradas a valores predeterminados', 'success')
      }
    }
  }

  return {
    // Estados
    questions,
    loading,
    showQuestionForm,
    editingQuestion,
    searchTerm,
    filters,
    formData,
    validationErrors,

    // Setters
    setShowQuestionForm,
    setSearchTerm,
    setFilters,

    // Handlers
    handleInputChange,
    handleOptionChange,
    handleOptionImageChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleImport,
    handleCloseForm,
    resetToDefaults,
    loadQuestions
  }
}