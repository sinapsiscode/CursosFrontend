import { useState, useEffect, useCallback } from 'react'
import { useUIStore, useAdminStore } from '../../store'
import { examApi } from '../../services/api'
import ExamForm from '../../components/admin/ExamForm'
import ExamList from '../../components/admin/ExamList'
import QuestionModal from '../../components/admin/QuestionModal'
import Swal from 'sweetalert2'

const AdminExamsV2 = () => {
  const { showToast } = useUIStore()
  const { courses } = useAdminStore()
  
  const [exams, setExams] = useState([])
  const [activeView, setActiveView] = useState('list')
  const [selectedExam, setSelectedExam] = useState(null)
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  const [examForm, setExamForm] = useState({
    id: null,
    title: '',
    description: '',
    type: 'course',
    courseId: '',
    area: 'all',
    duration: 30,
    passingScore: 70,
    attempts: 3,
    isActive: true,
    questions: []
  })

  const handleExamFormChange = useCallback((field, value) => {
    setExamForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleQuestionFormChange = useCallback((field, value) => {
    setQuestionForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const [questionForm, setQuestionForm] = useState({
    id: null,
    question: '',
    questionImage: '',
    youtubeUrl: '',
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''],
    correct: 0,
    points: 10
  })

  const handleOptionChange = useCallback((index, value) => {
    setQuestionForm(prev => {
      const newOptions = [...prev.options]
      newOptions[index] = value
      return { ...prev, options: newOptions }
    })
  }, [])

  const handleOptionImageChange = useCallback((index, value) => {
    setQuestionForm(prev => {
      const newOptionImages = [...prev.optionImages]
      newOptionImages[index] = value
      return { ...prev, optionImages: newOptionImages }
    })
  }, [])

  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      const response = await examApi.getExams()
      if (response.success) {
        setExams(response.data)
      } else {
        const storedExams = localStorage.getItem('course_exams')
        if (storedExams) {
          setExams(JSON.parse(storedExams))
        }
      }
    } catch (error) {
      console.error('Error loading exams:', error)
      const storedExams = localStorage.getItem('course_exams')
      if (storedExams) {
        setExams(JSON.parse(storedExams))
      }
      showToast('Usando datos locales', 'info')
    } finally {
      setLoading(false)
    }
  }

  const saveExams = async (updatedExams) => {
    try {
      await examApi.saveExams(updatedExams)
    } catch (error) {
      console.error('Error saving to API:', error)
    }
    localStorage.setItem('course_exams', JSON.stringify(updatedExams))
    setExams(updatedExams)
  }

  const handleCreateExam = () => {
    setExamForm({
      id: null,
      title: '',
      description: '',
      type: 'course',
      courseId: '',
      area: 'all',
      duration: 30,
      passingScore: 70,
      attempts: 3,
      isActive: true,
      questions: []
    })
    setActiveView('create')
  }

  const handleEditExam = (exam) => {
    setExamForm(exam)
    setSelectedExam(exam)
    setActiveView('edit')
  }

  const handleSaveExam = async () => {
    if (!examForm.title.trim()) {
      showToast('El título del examen es obligatorio', 'error')
      return
    }

    if (examForm.type === 'course' && !examForm.courseId) {
      showToast('Debe seleccionar un curso para este examen', 'error')
      return
    }

    if (examForm.questions.length === 0) {
      const result = await Swal.fire({
        title: '¿Guardar sin preguntas?',
        text: 'El examen no tiene preguntas. ¿Deseas guardarlo de todas formas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        background: '#1f2937',
        color: '#f3f4f6'
      })

      if (!result.isConfirmed) return
    }

    if (activeView === 'create') {
      const newExam = {
        ...examForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await saveExams([...exams, newExam])
      showToast('Examen creado correctamente', 'success')
    } else {
      const updatedExams = exams.map(exam => 
        exam.id === examForm.id 
          ? { ...examForm, updatedAt: new Date().toISOString() }
          : exam
      )
      await saveExams(updatedExams)
      showToast('Examen actualizado correctamente', 'success')
    }

    setActiveView('list')
  }

  const handleDeleteExam = async (examId) => {
    const result = await Swal.fire({
      title: '¿Eliminar examen?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f3f4f6'
    })

    if (result.isConfirmed) {
      const updatedExams = exams.filter(exam => exam.id !== examId)
      await saveExams(updatedExams)
      showToast('Examen eliminado correctamente', 'success')
    }
  }

  const handleDuplicateExam = async (exam) => {
    const duplicatedExam = {
      ...exam,
      id: Date.now().toString(),
      title: `${exam.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await saveExams([...exams, duplicatedExam])
    showToast('Examen duplicado correctamente', 'success')
  }

  const handleToggleExamStatus = async (examId) => {
    const updatedExams = exams.map(exam => 
      exam.id === examId 
        ? { ...exam, isActive: !exam.isActive, updatedAt: new Date().toISOString() }
        : exam
    )
    await saveExams(updatedExams)
    showToast('Estado del examen actualizado', 'success')
  }

  const handleAddQuestion = () => {
    resetQuestionForm()
    setEditingQuestionIndex(null)
    setShowQuestionModal(true)
  }

  const handleEditQuestion = (index) => {
    const question = examForm.questions[index]
    setQuestionForm(question)
    setEditingQuestionIndex(index)
    setShowQuestionModal(true)
  }

  const handleSaveQuestion = () => {
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
      updatedQuestions = [...examForm.questions]
      updatedQuestions[editingQuestionIndex] = newQuestion
    } else {
      updatedQuestions = [...examForm.questions, newQuestion]
    }

    setExamForm({ ...examForm, questions: updatedQuestions })
    setShowQuestionModal(false)
    resetQuestionForm()
    showToast(editingQuestionIndex !== null ? 'Pregunta actualizada' : 'Pregunta agregada', 'success')
  }

  const handleDeleteQuestion = async (index) => {
    const result = await Swal.fire({
      title: '¿Eliminar pregunta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f3f4f6'
    })

    if (result.isConfirmed) {
      const updatedQuestions = examForm.questions.filter((_, i) => i !== index)
      setExamForm({ ...examForm, questions: updatedQuestions })
      showToast('Pregunta eliminada', 'success')
    }
  }

  const resetQuestionForm = () => {
    setQuestionForm({
      id: null,
      question: '',
      questionImage: '',
      youtubeUrl: '',
      options: ['', '', '', ''],
      optionImages: ['', '', '', ''],
      correct: 0,
      points: 10
    })
  }

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : 'Curso no encontrado'
  }

  const filteredExams = exams.filter(exam => {
    if (filterCourse !== 'all' && exam.courseId !== filterCourse) return false
    if (filterType !== 'all' && exam.type !== filterType) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Exámenes V2</h1>
            <p className="text-gray-400 mt-1">Sistema avanzado con soporte multimedia</p>
          </div>
          
          {activeView === 'list' && (
            <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Sistema Activo</span>
            </div>
          )}
        </div>
        
        {activeView === 'list' && (
          <ExamList 
            filteredExams={filteredExams}
            filterType={filterType}
            setFilterType={setFilterType}
            filterCourse={filterCourse}
            setFilterCourse={setFilterCourse}
            courses={courses}
            handleCreateExam={handleCreateExam}
            handleEditExam={handleEditExam}
            handleDeleteExam={handleDeleteExam}
            handleDuplicateExam={handleDuplicateExam}
            handleToggleExamStatus={handleToggleExamStatus}
            getCourseName={getCourseName}
          />
        )}
        
        {(activeView === 'create' || activeView === 'edit') && (
          <ExamForm 
            examForm={examForm}
            handleExamFormChange={handleExamFormChange}
            courses={courses}
            activeView={activeView}
            setActiveView={setActiveView}
            handleSaveExam={handleSaveExam}
            handleAddQuestion={handleAddQuestion}
            handleEditQuestion={handleEditQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        )}
        
        <QuestionModal 
          showQuestionModal={showQuestionModal}
          setShowQuestionModal={setShowQuestionModal}
          questionForm={questionForm}
          handleQuestionFormChange={handleQuestionFormChange}
          handleOptionChange={handleOptionChange}
          handleOptionImageChange={handleOptionImageChange}
          handleSaveQuestion={handleSaveQuestion}
          editingQuestionIndex={editingQuestionIndex}
        />
      </div>
    </div>
  )
}

export default AdminExamsV2