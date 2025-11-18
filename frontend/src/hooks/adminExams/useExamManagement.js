import { useState, useEffect, useCallback } from 'react'
import { useUIStore } from '../../store'
import { DEFAULT_EXAM_FORM, VIEW_TYPES } from '../../data/adminExams'

/**
 * Hook para manejar la lógica de gestión de exámenes (CRUD)
 */
export const useExamManagement = () => {
  const { showToast } = useUIStore()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState(VIEW_TYPES.LIST)
  const [selectedExam, setSelectedExam] = useState(null)
  const [examForm, setExamForm] = useState(DEFAULT_EXAM_FORM)

  // Cargar exámenes al montar
  useEffect(() => {
    loadExams()
  }, [])

  // Cargar exámenes desde localStorage
  const loadExams = useCallback(() => {
    try {
      const storedExams = localStorage.getItem('course_exams')
      if (storedExams) {
        setExams(JSON.parse(storedExams))
      }
    } catch (error) {
      console.error('Error loading exams:', error)
      showToast('Error al cargar los exámenes', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Guardar exámenes en localStorage
  const saveExams = useCallback((updatedExams) => {
    localStorage.setItem('course_exams', JSON.stringify(updatedExams))
    setExams(updatedExams)
  }, [])

  // Manejar cambios en el formulario de examen
  const handleExamFormChange = useCallback((field, value) => {
    setExamForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Crear nuevo examen
  const handleCreateExam = useCallback(() => {
    setExamForm(DEFAULT_EXAM_FORM)
    setActiveView(VIEW_TYPES.CREATE)
  }, [])

  // Editar examen existente
  const handleEditExam = useCallback((exam) => {
    setExamForm(exam)
    setSelectedExam(exam)
    setActiveView(VIEW_TYPES.EDIT)
  }, [])

  // Guardar examen (crear o actualizar)
  const handleSaveExam = useCallback(() => {
    // Validaciones
    if (!examForm.title.trim()) {
      showToast('El título del examen es obligatorio', 'error')
      return
    }

    if (examForm.type === 'course' && !examForm.courseId) {
      showToast('Debe seleccionar un curso para este examen', 'error')
      return
    }

    if (examForm.questions.length === 0) {
      showToast('El examen debe tener al menos una pregunta', 'error')
      return
    }

    if (activeView === VIEW_TYPES.CREATE) {
      // Crear nuevo examen
      const newExam = {
        ...examForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveExams([...exams, newExam])
      showToast('Examen creado correctamente', 'success')
    } else {
      // Actualizar examen existente
      const updatedExams = exams.map(exam =>
        exam.id === examForm.id
          ? { ...examForm, updatedAt: new Date().toISOString() }
          : exam
      )
      saveExams(updatedExams)
      showToast('Examen actualizado correctamente', 'success')
    }

    setActiveView(VIEW_TYPES.LIST)
  }, [examForm, activeView, exams, saveExams, showToast])

  // Eliminar examen
  const handleDeleteExam = useCallback((examId) => {
    if (window.confirm('¿Está seguro de eliminar este examen? Esta acción no se puede deshacer.')) {
      const updatedExams = exams.filter(exam => exam.id !== examId)
      saveExams(updatedExams)
      showToast('Examen eliminado correctamente', 'success')
    }
  }, [exams, saveExams, showToast])

  // Duplicar examen
  const handleDuplicateExam = useCallback((exam) => {
    const duplicatedExam = {
      ...exam,
      id: Date.now().toString(),
      title: `${exam.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveExams([...exams, duplicatedExam])
    showToast('Examen duplicado correctamente', 'success')
  }, [exams, saveExams, showToast])

  // Activar/Desactivar examen
  const handleToggleExamStatus = useCallback((examId) => {
    const updatedExams = exams.map(exam =>
      exam.id === examId
        ? { ...exam, isActive: !exam.isActive, updatedAt: new Date().toISOString() }
        : exam
    )
    saveExams(updatedExams)
    showToast('Estado del examen actualizado', 'success')
  }, [exams, saveExams, showToast])

  return {
    exams,
    loading,
    activeView,
    setActiveView,
    selectedExam,
    examForm,
    setExamForm,
    handleExamFormChange,
    handleCreateExam,
    handleEditExam,
    handleSaveExam,
    handleDeleteExam,
    handleDuplicateExam,
    handleToggleExamStatus
  }
}
