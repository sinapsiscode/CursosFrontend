import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ExamListPage = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [showCreateSection, setShowCreateSection] = useState(false)
  const [editingExamId, setEditingExamId] = useState(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [examToDelete, setExamToDelete] = useState(null)
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    imageUrl: '',
    videoUrl: '',
    points: 10,
    options: [
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' }
    ],
    correctAnswer: 0
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    duration: '',
    passingScore: '',
    totalQuestions: '',
    type: 'curso',
    area: 'todas',
    maxAttempts: '1',
    isActive: true,
    questions: []
  })

  useEffect(() => {
    // TODO: Reemplazar con llamada a API
    const timer = setTimeout(() => {
      setExams([
        {
          id: 1,
          title: 'Examen: Fundamentos de Metalurgia',
          description: 'Evalúa tus conocimientos sobre los conceptos básicos de metalurgia',
          course: 'Fundamentos de Metalurgia',
          duration: 30,
          passingScore: 60,
          totalQuestions: 5,
          status: 'active',
          type: 'curso',
          area: 'metalurgia',
          maxAttempts: 3,
          isActive: true,
          questions: [
            {
              id: 1,
              points: 10,
              question: '¿Cuál es el principal componente del acero?',
              imageUrl: '',
              videoUrl: '',
              options: [
                { text: 'Hierro', imageUrl: '' },
                { text: 'Carbono', imageUrl: '' },
                { text: 'Níquel', imageUrl: '' },
                { text: 'Cromo', imageUrl: '' }
              ],
              correctAnswer: 0
            },
            {
              id: 2,
              points: 10,
              question: '¿Qué proceso se utiliza para separar el oro de otros minerales?',
              imageUrl: '',
              videoUrl: '',
              options: [
                { text: 'Destilación', imageUrl: '' },
                { text: 'Cianuración', imageUrl: '' },
                { text: 'Evaporación', imageUrl: '' },
                { text: 'Sublimación', imageUrl: '' }
              ],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 2,
          title: 'Examen: Procesos de Fundición Avanzada',
          description: 'Evalúa tus conocimientos avanzados sobre técnicas de fundición',
          course: 'Procesos de Fundición Avanzada',
          duration: 45,
          passingScore: 70,
          totalQuestions: 8,
          status: 'active',
          type: 'curso'
        },
        {
          id: 3,
          title: 'Examen: Tratamientos Térmicos',
          description: 'Evalúa tus conocimientos sobre tratamientos térmicos de materiales',
          course: 'Tratamientos Térmicos',
          duration: 35,
          passingScore: 65,
          totalQuestions: 6,
          status: 'active',
          type: 'curso'
        },
        {
          id: 4,
          title: 'Examen: Introducción a la Minería',
          description: 'Evalúa tus conocimientos básicos sobre minería',
          course: 'Introducción a la Minería',
          duration: 30,
          passingScore: 60,
          totalQuestions: 5,
          status: 'active',
          type: 'curso'
        }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleQuestionChange = (field, value) => {
    setQuestionFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOptionChange = (index, field, value) => {
    setQuestionFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      )
    }))
  }

  const handleAddQuestion = () => {
    setQuestionFormData({
      question: '',
      imageUrl: '',
      videoUrl: '',
      points: 10,
      options: [
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' }
      ],
      correctAnswer: 0
    })
    setEditingQuestionId(null)
    setShowQuestionModal(true)
  }

  const handleEditQuestion = (questionId) => {
    const question = formData.questions.find(q => q.id === questionId)
    if (question) {
      setQuestionFormData({
        question: question.question,
        imageUrl: question.imageUrl || '',
        videoUrl: question.videoUrl || '',
        points: question.points,
        options: question.options.map(opt =>
          typeof opt === 'string' ? { text: opt, imageUrl: '' } : opt
        ),
        correctAnswer: question.correctAnswer
      })
      setEditingQuestionId(questionId)
      setShowQuestionModal(true)
    }
  }

  const handleDeleteQuestion = (questionId) => {
    if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId)
      }))
    }
  }

  const handleSaveQuestion = () => {
    const questionData = {
      id: editingQuestionId || Date.now(),
      question: questionFormData.question,
      imageUrl: questionFormData.imageUrl,
      videoUrl: questionFormData.videoUrl,
      points: parseInt(questionFormData.points),
      options: questionFormData.options,
      correctAnswer: questionFormData.correctAnswer
    }

    if (editingQuestionId) {
      // Editar pregunta existente
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.map(q =>
          q.id === editingQuestionId ? questionData : q
        )
      }))
    } else {
      // Agregar nueva pregunta
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, questionData]
      }))
    }

    setShowQuestionModal(false)
    setEditingQuestionId(null)
  }

  const handleCreateExam = (e) => {
    e.preventDefault()

    if (editingExamId) {
      // Modo edición
      setExams(exams.map(exam =>
        exam.id === editingExamId
          ? {
              ...exam,
              title: `Examen: ${formData.title}`,
              description: formData.description,
              course: formData.course,
              duration: parseInt(formData.duration),
              passingScore: parseInt(formData.passingScore),
              totalQuestions: formData.questions.length,
              type: formData.type,
              area: formData.area,
              maxAttempts: parseInt(formData.maxAttempts),
              isActive: formData.isActive,
              questions: formData.questions,
              status: formData.isActive ? 'active' : 'inactive'
            }
          : exam
      ))
      setEditingExamId(null)
    } else {
      // Modo crear
      const newExam = {
        id: Date.now(),
        title: `Examen: ${formData.title}`,
        description: formData.description,
        course: formData.course,
        duration: parseInt(formData.duration),
        passingScore: parseInt(formData.passingScore),
        totalQuestions: formData.questions.length,
        status: formData.isActive ? 'active' : 'inactive',
        type: formData.type,
        area: formData.area,
        maxAttempts: parseInt(formData.maxAttempts),
        isActive: formData.isActive,
        questions: formData.questions
      }
      setExams([...exams, newExam])
    }

    setShowCreateSection(false)
    setFormData({
      title: '',
      description: '',
      course: '',
      duration: '',
      passingScore: '',
      totalQuestions: '',
      type: 'curso',
      area: 'todas',
      maxAttempts: '1',
      isActive: true,
      questions: []
    })
  }

  const handleToggleExam = (examId) => {
    setExams(exams.map(exam =>
      exam.id === examId
        ? { ...exam, status: exam.status === 'active' ? 'inactive' : 'active' }
        : exam
    ))
  }

  const handleEditExam = (examId) => {
    const examToEdit = exams.find(e => e.id === examId)
    if (examToEdit) {
      setFormData({
        title: examToEdit.title.replace('Examen: ', ''),
        description: examToEdit.description,
        course: examToEdit.course,
        duration: examToEdit.duration.toString(),
        passingScore: examToEdit.passingScore.toString(),
        totalQuestions: examToEdit.totalQuestions.toString(),
        type: examToEdit.type,
        area: examToEdit.area || 'todas',
        maxAttempts: examToEdit.maxAttempts?.toString() || '1',
        isActive: examToEdit.isActive !== undefined ? examToEdit.isActive : true,
        questions: examToEdit.questions || []
      })
      setEditingExamId(examId)
      setShowCreateSection(true)
    }
  }

  const handleCopyExam = (examId) => {
    const examToCopy = exams.find(e => e.id === examId)
    if (examToCopy) {
      const copiedExam = {
        ...examToCopy,
        id: Date.now(),
        title: `${examToCopy.title} (Copia)`
      }
      setExams([...exams, copiedExam])
    }
  }

  const handleDeleteExam = (examId) => {
    const exam = exams.find(e => e.id === examId)
    setExamToDelete(exam)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (examToDelete) {
      setExams(exams.filter(e => e.id !== examToDelete.id))
      setShowDeleteModal(false)
      setExamToDelete(null)
    }
  }

  // Filtrar exámenes
  const filteredExams = exams.filter(exam => {
    const matchesType = typeFilter === 'all' || exam.type === typeFilter
    const matchesCourse = courseFilter === 'all' || exam.course === courseFilter
    return matchesType && matchesCourse
  })

  // Obtener lista única de cursos para el filtro
  const uniqueCourses = [...new Set(exams.map(exam => exam.course))]

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Exámenes">
      <div className="space-y-6">
        {/* Filtros y Botón Crear */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
            >
              <option value="all">Todos los tipos</option>
              <option value="curso">Curso</option>
              <option value="certificacion">Certificación</option>
              <option value="evaluacion">Evaluación</option>
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="bg-surface border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
            >
              <option value="all">Todos los cursos</option>
              {uniqueCourses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setShowCreateSection(!showCreateSection)
              setEditingExamId(null)
              setFormData({
                title: '',
                description: '',
                course: '',
                duration: '',
                passingScore: '',
                totalQuestions: '',
                type: 'curso',
                area: 'todas',
                maxAttempts: '1',
                isActive: true,
                questions: []
              })
            }}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
          >
            + Crear Examen
          </button>
        </div>

        {/* Sección: Crear Examen (colapsable) */}
        {showCreateSection && (
          <div className="bg-surface rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">
              {editingExamId ? 'Editar Examen' : 'Nuevo Examen'}
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-6">
              {/* Título y Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Título del Examen</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Fundamentos de Metalurgia"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Tipo</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  >
                    <option value="curso">Curso</option>
                    <option value="certificacion">Certificación</option>
                    <option value="evaluacion">Evaluación</option>
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-white text-sm mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Evalúa tus conocimientos sobre..."
                  rows={3}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                  required
                />
              </div>

              {/* Curso */}
              <div>
                <label className="block text-white text-sm mb-2">Curso Asociado</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Fundamentos de Metalurgia"
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              {/* Duración, Aprobación, Preguntas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Duración (minutos)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Aprobación (%)</label>
                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    placeholder="60"
                    min="0"
                    max="100"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Intentos Permitidos</label>
                  <input
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              {/* Área Temática */}
              <div>
                <label className="block text-white text-sm mb-2">Área Temática</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                  required
                >
                  <option value="todas">Todas las áreas</option>
                  <option value="metalurgia">Metalurgia</option>
                  <option value="mineria">Minería</option>
                  <option value="geologia">Geología</option>
                  <option value="ingenieria-civil">Ingeniería Civil</option>
                </select>
              </div>

              {/* Checkbox Examen Activo */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 bg-background border border-gray-600 rounded focus:ring-accent"
                />
                <label htmlFor="isActive" className="text-white text-sm">
                  Examen activo (los estudiantes pueden tomarlo)
                </label>
              </div>

              {/* Preguntas del Examen */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">
                    Preguntas del Examen ({formData.questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                  >
                    + Agregar Pregunta
                  </button>
                </div>

                {formData.questions.length > 0 && (
                  <div className="space-y-4">
                    {formData.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-background rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-green-400 font-medium">#{index + 1}</span>
                              <span className="text-blue-400 text-sm">{question.points} puntos</span>
                            </div>
                            <p className="text-white font-medium mb-2">
                              {question.question || 'Nueva pregunta'}
                            </p>
                            <div className="space-y-1 text-sm">
                              {question.options.map((option, optIndex) => {
                                const optionText = typeof option === 'string' ? option : option.text
                                return (
                                  <p key={optIndex} className="text-text-secondary">
                                    {String.fromCharCode(65 + optIndex)}. {optionText || '(vacío)'}
                                  </p>
                                )
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditQuestion(question.id)}
                              className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                              title="Editar pregunta"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                              title="Eliminar pregunta"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateSection(false)
                    setEditingExamId(null)
                    setFormData({
                      title: '',
                      description: '',
                      course: '',
                      duration: '',
                      passingScore: '',
                      totalQuestions: '',
                      type: 'curso',
                      area: 'todas',
                      maxAttempts: '1',
                      isActive: true,
                      questions: []
                    })
                  }}
                  className="px-6 py-3 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                >
                  {editingExamId ? 'Guardar Cambios' : 'Crear Examen'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Exámenes en Cards */}
        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-surface rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                {/* Contenido del examen */}
                <div className="flex-1">
                  {/* Título y Badges */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold text-lg">{exam.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      exam.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {exam.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                      Curso
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-text-secondary text-sm mb-4">{exam.description}</p>

                  {/* Información del examen */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-secondary flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {exam.duration} minutos
                    </span>
                    <span className="text-text-secondary">
                      Aprobación: {exam.passingScore}%
                    </span>
                    <span className="text-text-secondary">
                      {exam.totalQuestions} preguntas
                    </span>
                    <span className="text-blue-400">
                      {exam.course}
                    </span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => handleToggleExam(exam.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      exam.status === 'active'
                        ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                        : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                    }`}
                    title={exam.status === 'active' ? 'Desactivar examen' : 'Activar examen'}
                  >
                    {exam.status === 'active' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleEditExam(exam.id)}
                    className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                    title="Editar examen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCopyExam(exam.id)}
                    className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                    title="Copiar examen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    title="Eliminar examen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Nueva/Editar Pregunta */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {editingQuestionId ? 'Editar Pregunta' : 'Nueva Pregunta'}
                </h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Pregunta */}
                <div>
                  <label className="block text-white text-sm mb-2">Pregunta *</label>
                  <textarea
                    value={questionFormData.question}
                    onChange={(e) => handleQuestionChange('question', e.target.value)}
                    placeholder="Escribe la pregunta..."
                    rows={3}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                    required
                  />
                </div>

                {/* Imagen de la pregunta */}
                <div>
                  <label className="block text-white text-sm mb-2">Imagen de la pregunta (opcional)</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                      >
                        Seleccionar archivo
                      </button>
                      <span className="text-text-secondary text-sm">Ningún archivo seleccionado</span>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs mb-2">O ingresar URL</p>
                      <input
                        type="url"
                        value={questionFormData.imageUrl}
                        onChange={(e) => handleQuestionChange('imageUrl', e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Video de YouTube */}
                <div>
                  <label className="block text-white text-sm mb-2">Video de YouTube (opcional)</label>
                  <input
                    type="url"
                    value={questionFormData.videoUrl}
                    onChange={(e) => handleQuestionChange('videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=abc123 o https://youtu.be/..."
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O ingresar material junto con la pregunta para proporcionar contexto adicional
                  </p>
                </div>

                {/* Puntos */}
                <div>
                  <label className="block text-white text-sm mb-2">Puntos</label>
                  <input
                    type="number"
                    value={questionFormData.points}
                    onChange={(e) => handleQuestionChange('points', e.target.value)}
                    min="1"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                {/* Opciones de respuesta */}
                <div>
                  <label className="block text-white text-sm mb-3">Opciones de respuesta *</label>
                  <div className="space-y-4">
                    {questionFormData.options.map((option, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={questionFormData.correctAnswer === index}
                            onChange={() => handleQuestionChange('correctAnswer', index)}
                            className="mt-3"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium min-w-[20px]">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                                className="flex-1 p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                                required
                              />
                            </div>
                            <input
                              type="url"
                              value={option.imageUrl}
                              onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                              placeholder="URL de imagen para esta opción (opcional)"
                              className="w-full p-2 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Selecciona la respuesta correcta con el radio button
                  </p>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(false)}
                    className="px-6 py-3 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuestion}
                    className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                  >
                    {editingQuestionId ? 'Guardar Cambios' : 'Agregar Pregunta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && examToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Eliminar Examen</h3>
              <p className="text-text-secondary mb-6">
                ¿Estás seguro de eliminar el examen <span className="text-white font-medium">"{examToDelete.title}"</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setExamToDelete(null)
                  }}
                  className="px-4 py-2 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default ExamListPage
