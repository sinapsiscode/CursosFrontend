import { useState, useCallback } from 'react'
import { useUIStore } from '../../store'
import { DEFAULT_QUESTION_FORM } from '../../data/adminExams'

/**
 * Hook para manejar la lógica de gestión de preguntas
 */
export const useQuestionManagement = (examForm, setExamForm) => {
  const { showToast } = useUIStore()
  const [questionForm, setQuestionForm] = useState(DEFAULT_QUESTION_FORM)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)

  // Manejar cambios en el formulario de pregunta
  const handleQuestionFormChange = useCallback((field, value) => {
    setQuestionForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Manejar cambios en las opciones
  const handleOptionChange = useCallback((index, value) => {
    setQuestionForm(prev => {
      const newOptions = [...prev.options]
      newOptions[index] = value
      return { ...prev, options: newOptions }
    })
  }, [])

  // Manejar cambios en las imágenes de opciones
  const handleOptionImageChange = useCallback((index, value) => {
    setQuestionForm(prev => {
      const newOptionImages = [...prev.optionImages]
      newOptionImages[index] = value
      return { ...prev, optionImages: newOptionImages }
    })
  }, [])

  // Resetear formulario de pregunta
  const resetQuestionForm = useCallback(() => {
    setQuestionForm(DEFAULT_QUESTION_FORM)
  }, [])

  // Agregar pregunta al examen
  const handleAddQuestion = useCallback(() => {
    resetQuestionForm()
    setEditingQuestionIndex(null)
    setShowQuestionModal(true)
  }, [resetQuestionForm])

  // Editar pregunta
  const handleEditQuestion = useCallback((index) => {
    const question = examForm.questions[index]
    setQuestionForm(question)
    setEditingQuestionIndex(index)
    setShowQuestionModal(true)
  }, [examForm.questions])

  // Guardar pregunta
  const handleSaveQuestion = useCallback(() => {
    // Validaciones
    if (!questionForm.question.trim()) {
      showToast('La pregunta es obligatoria', 'error')
      return
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      showToast('Todas las opciones deben tener texto', 'error')
      return
    }

    const newQuestion = {
      ...questionForm,
      id: questionForm.id || Date.now().toString()
    }

    let updatedQuestions
    if (editingQuestionIndex !== null) {
      // Actualizar pregunta existente
      updatedQuestions = [...examForm.questions]
      updatedQuestions[editingQuestionIndex] = newQuestion
    } else {
      // Agregar nueva pregunta
      updatedQuestions = [...examForm.questions, newQuestion]
    }

    setExamForm({ ...examForm, questions: updatedQuestions })
    setShowQuestionModal(false)
    resetQuestionForm()
    showToast(editingQuestionIndex !== null ? 'Pregunta actualizada' : 'Pregunta agregada', 'success')
  }, [questionForm, examForm, editingQuestionIndex, setExamForm, showToast, resetQuestionForm])

  // Eliminar pregunta
  const handleDeleteQuestion = useCallback((index) => {
    if (window.confirm('¿Está seguro de eliminar esta pregunta?')) {
      const updatedQuestions = examForm.questions.filter((_, i) => i !== index)
      setExamForm({ ...examForm, questions: updatedQuestions })
      showToast('Pregunta eliminada', 'success')
    }
  }, [examForm, setExamForm, showToast])

  return {
    questionForm,
    showQuestionModal,
    setShowQuestionModal,
    editingQuestionIndex,
    handleQuestionFormChange,
    handleOptionChange,
    handleOptionImageChange,
    handleAddQuestion,
    handleEditQuestion,
    handleSaveQuestion,
    handleDeleteQuestion,
    resetQuestionForm
  }
}
