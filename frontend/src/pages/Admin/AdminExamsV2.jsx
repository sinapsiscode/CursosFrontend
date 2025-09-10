import { useState, useEffect, useCallback } from 'react'
import { useUIStore } from '../../store'
import { useAdminStore } from '../../store'

// Componente de formulario de examen (FUERA del componente principal)
const ExamForm = ({ 
  examForm, 
  handleExamFormChange, 
  courses, 
  activeView, 
  setActiveView, 
  handleSaveExam, 
  handleAddQuestion,
  handleEditQuestion,
  handleDeleteQuestion 
}) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">
        {activeView === 'create' ? 'Crear Nuevo Examen' : 'Editar Examen'}
      </h2>
      <button
        onClick={() => setActiveView('list')}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Formulario */}
    <div className="bg-background rounded-lg p-6 border border-gray-700 space-y-6">
      {/* Información básica */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título del Examen *
          </label>
          <input
            type="text"
            value={examForm.title}
            onChange={(e) => handleExamFormChange('title', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Ej: Examen Final de Metalurgia Básica"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Examen *
          </label>
          <select
            value={examForm.type}
            onChange={(e) => handleExamFormChange('type', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="initial">Examen Inicial</option>
            <option value="course">Examen de Curso</option>
            <option value="certification">Certificación</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Descripción
        </label>
        <textarea
          value={examForm.description}
          onChange={(e) => handleExamFormChange('description', e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          rows={3}
          placeholder="Describe el propósito y contenido del examen..."
        />
      </div>

      {/* Asignación de curso (solo para exámenes de curso) */}
      {examForm.type === 'course' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Curso Asociado *
          </label>
          <select
            value={examForm.courseId}
            onChange={(e) => handleExamFormChange('courseId', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Seleccionar curso...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Configuración del examen */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duración (minutos)
          </label>
          <input
            type="number"
            value={examForm.duration}
            onChange={(e) => handleExamFormChange('duration', parseInt(e.target.value) || 30)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            min="5"
            max="180"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Puntaje de Aprobación (%)
          </label>
          <input
            type="number"
            value={examForm.passingScore}
            onChange={(e) => handleExamFormChange('passingScore', parseInt(e.target.value) || 70)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Intentos Permitidos
          </label>
          <input
            type="number"
            value={examForm.attempts}
            onChange={(e) => handleExamFormChange('attempts', parseInt(e.target.value) || 1)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            min="1"
            max="10"
          />
        </div>
      </div>

      {/* Área temática */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Área Temática
        </label>
        <select
          value={examForm.area}
          onChange={(e) => handleExamFormChange('area', e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">Todas las áreas</option>
          <option value="metalurgia">Metalurgia</option>
          <option value="mineria">Minería</option>
          <option value="geologia">Geología</option>
        </select>
      </div>

      {/* Estado */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={examForm.isActive}
          onChange={(e) => handleExamFormChange('isActive', e.target.checked)}
          className="w-4 h-4 text-accent bg-gray-700 border-gray-600 rounded focus:ring-accent"
        />
        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-300">
          Examen activo (los estudiantes pueden tomarlo)
        </label>
      </div>
    </div>

    {/* Sección de preguntas */}
    <div className="bg-background rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">
          Preguntas del Examen ({examForm.questions.length})
        </h3>
        <button
          onClick={handleAddQuestion}
          className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          + Agregar Pregunta
        </button>
      </div>

      {examForm.questions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No hay preguntas en este examen</p>
          <button
            onClick={handleAddQuestion}
            className="text-accent hover:text-accent-light"
          >
            Agregar la primera pregunta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {examForm.questions.map((question, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-semibold">#{index + 1}</span>
                    <span className="text-sm text-gray-400">{question.points} puntos</span>
                  </div>
                  
                  <p className="text-white mb-3">{question.question}</p>
                  
                  {question.questionImage && (
                    <img 
                      src={question.questionImage} 
                      alt="Imagen de pregunta"
                      className="max-w-xs h-24 object-contain rounded mb-3"
                    />
                  )}

                  {question.youtubeUrl && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-lg p-2 max-w-xs">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-red-400 text-xs font-medium">Video de YouTube</p>
                          <p className="text-gray-400 text-xs truncate">{question.youtubeUrl}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className={`text-sm ${
                          question.correct === optIndex 
                            ? 'text-green-400 font-medium' 
                            : 'text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </span>
                        {question.optionImages[optIndex] && (
                          <img 
                            src={question.optionImages[optIndex]} 
                            alt={`Opción ${String.fromCharCode(65 + optIndex)}`}
                            className="h-8 w-8 object-cover rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditQuestion(index)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
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

    {/* Botones de acción */}
    <div className="flex justify-end gap-3">
      <button
        onClick={() => setActiveView('list')}
        className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={handleSaveExam}
        className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        {activeView === 'create' ? 'Crear Examen' : 'Guardar Cambios'}
      </button>
    </div>
  </div>
)

// Componente de lista de exámenes (FUERA del componente principal)
const ExamList = ({ 
  filteredExams, 
  filterType, 
  setFilterType, 
  filterCourse, 
  setFilterCourse, 
  courses, 
  handleCreateExam,
  handleEditExam,
  handleDeleteExam,
  handleDuplicateExam,
  handleToggleExamStatus,
  getCourseName 
}) => (
  <div className="space-y-6">
    {/* Filtros */}
    <div className="flex flex-wrap gap-4 items-center">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="all">Todos los tipos</option>
        <option value="initial">Examen inicial</option>
        <option value="course">Examen de curso</option>
        <option value="certification">Certificación</option>
      </select>

      <select
        value={filterCourse}
        onChange={(e) => setFilterCourse(e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="all">Todos los cursos</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>{course.title}</option>
        ))}
      </select>

      <button
        onClick={handleCreateExam}
        className="ml-auto bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        + Crear Examen
      </button>
    </div>

    {/* Lista de exámenes */}
    {filteredExams.length === 0 ? (
      <div className="text-center py-12 bg-background rounded-lg">
        <p className="text-gray-400">No hay exámenes que coincidan con los filtros</p>
        <button
          onClick={handleCreateExam}
          className="mt-4 text-accent hover:text-accent-light"
        >
          Crear el primer examen
        </button>
      </div>
    ) : (
      <div className="grid gap-4">
        {filteredExams.map(exam => (
          <div key={exam.id} className="bg-background rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{exam.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    exam.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {exam.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                    {exam.type === 'initial' ? 'Examen Inicial' : 
                     exam.type === 'course' ? 'Curso' : 'Certificación'}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-3">{exam.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{exam.duration} minutos</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">Aprobación: {exam.passingScore}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{exam.questions.length} preguntas</span>
                  </div>

                  {exam.type === 'course' && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-gray-300">{getCourseName(exam.courseId)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggleExamStatus(exam.id)}
                  className={`p-2 rounded transition-colors ${
                    exam.isActive ? 'text-green-400 hover:bg-green-500/20' : 'text-red-400 hover:bg-red-500/20'
                  }`}
                  title={exam.isActive ? 'Desactivar' : 'Activar'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {exam.isActive ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </button>

                <button
                  onClick={() => handleEditExam(exam)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                  title="Editar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDuplicateExam(exam)}
                  className="p-2 text-purple-400 hover:bg-purple-500/20 rounded transition-colors"
                  title="Duplicar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  title="Eliminar"
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
    )}
  </div>
)

// Modal de pregunta (FUERA del componente principal)
const QuestionModal = ({ 
  showQuestionModal, 
  setShowQuestionModal,
  questionForm,
  handleQuestionFormChange,
  handleOptionChange,
  handleOptionImageChange,
  handleSaveQuestion,
  editingQuestionIndex
}) => (
  <>
    {showQuestionModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {editingQuestionIndex !== null ? 'Editar Pregunta' : 'Nueva Pregunta'}
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Pregunta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pregunta *
              </label>
              <textarea
                value={questionForm.question}
                onChange={(e) => handleQuestionFormChange('question', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
                placeholder="Escribe la pregunta..."
              />
            </div>

            {/* Imagen de la pregunta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen de la pregunta (opcional)
              </label>
              
              {/* Opciones de imagen */}
              <div className="space-y-3">
                {/* Subir archivo */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Subir archivo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        // Simular subida y generar URL temporal
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          handleQuestionFormChange('questionImage', event.target.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-accent file:text-background hover:file:bg-opacity-90"
                  />
                </div>

                {/* O URL */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">O ingresar URL</label>
                  <input
                    type="url"
                    value={questionForm.questionImage && questionForm.questionImage.startsWith('http') ? questionForm.questionImage : ''}
                    onChange={(e) => handleQuestionFormChange('questionImage', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>

              {/* Vista previa */}
              {questionForm.questionImage && (
                <div className="mt-3">
                  <img 
                    src={questionForm.questionImage} 
                    alt="Vista previa"
                    className="max-w-xs h-32 object-contain rounded border border-gray-600"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <button
                    type="button"
                    onClick={() => handleQuestionFormChange('questionImage', '')}
                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                  >
                    Eliminar imagen
                  </button>
                </div>
              )}
            </div>

            {/* Video de YouTube */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video de YouTube (opcional)
              </label>
              <input
                type="url"
                value={questionForm.youtubeUrl}
                onChange={(e) => handleQuestionFormChange('youtubeUrl', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
              />
              {questionForm.youtubeUrl && (
                <div className="mt-3">
                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                    <p className="text-xs text-gray-400 mb-2">Vista previa del video:</p>
                    <div className="aspect-video max-w-xs bg-gray-800 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-xs text-gray-400">Video de YouTube</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuestionFormChange('youtubeUrl', '')}
                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                  >
                    Eliminar video
                  </button>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-400">
                El video se mostrará junto con la pregunta para proporcionar contexto adicional
              </p>
            </div>

            {/* Puntos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Puntos
              </label>
              <input
                type="number"
                value={questionForm.points}
                onChange={(e) => handleQuestionFormChange('points', parseInt(e.target.value) || 10)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                min="1"
                max="100"
              />
            </div>

            {/* Opciones */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Opciones de respuesta *
              </label>
              <div className="space-y-3">
                {questionForm.options.map((option, index) => (
                  <div key={`option-${index}`} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correct"
                        checked={questionForm.correct === index}
                        onChange={() => handleQuestionFormChange('correct', index)}
                        className="text-accent focus:ring-accent"
                      />
                      <span className="text-white font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                      />
                    </div>
                    
                    <div className="ml-10">
                      <input
                        type="url"
                        value={questionForm.optionImages[index]}
                        onChange={(e) => handleOptionImageChange(index, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="URL de imagen para esta opción (opcional)"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Selecciona la respuesta correcta con el radio button
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveQuestion}
                className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                {editingQuestionIndex !== null ? 'Actualizar' : 'Agregar'} Pregunta
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
)

const AdminExamsV2 = () => {
  const { showToast } = useUIStore()
  const { courses } = useAdminStore()
  
  // Estados principales
  const [exams, setExams] = useState([])
  const [activeView, setActiveView] = useState('list') // list, create, edit
  const [selectedExam, setSelectedExam] = useState(null)
  const [filterCourse, setFilterCourse] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  // Estado del formulario de examen
  const [examForm, setExamForm] = useState({
    id: null,
    title: '',
    description: '',
    type: 'course', // course, initial, certification
    courseId: '',
    area: 'all', // all, metalurgia, mineria, geologia
    duration: 30, // minutos
    passingScore: 70, // porcentaje
    attempts: 3, // intentos permitidos
    isActive: true,
    questions: []
  })

  // Handler memorizado para cambios en el formulario de examen
  const handleExamFormChange = useCallback((field, value) => {
    setExamForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Handler memorizado para cambios en el formulario de preguntas
  const handleQuestionFormChange = useCallback((field, value) => {
    setQuestionForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Estado del formulario de pregunta
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

  // Handlers mejorados para las opciones
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

  // Cargar exámenes al montar
  useEffect(() => {
    loadExams()
  }, [])

  // Cargar exámenes desde localStorage
  const loadExams = () => {
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
  }

  // Guardar exámenes en localStorage
  const saveExams = (updatedExams) => {
    localStorage.setItem('course_exams', JSON.stringify(updatedExams))
    setExams(updatedExams)
  }

  // Crear nuevo examen
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

  // Editar examen existente
  const handleEditExam = (exam) => {
    setExamForm(exam)
    setSelectedExam(exam)
    setActiveView('edit')
  }

  // Guardar examen
  const handleSaveExam = () => {
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

    if (activeView === 'create') {
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

    setActiveView('list')
  }

  // Eliminar examen
  const handleDeleteExam = (examId) => {
    if (window.confirm('¿Está seguro de eliminar este examen? Esta acción no se puede deshacer.')) {
      const updatedExams = exams.filter(exam => exam.id !== examId)
      saveExams(updatedExams)
      showToast('Examen eliminado correctamente', 'success')
    }
  }

  // Duplicar examen
  const handleDuplicateExam = (exam) => {
    const duplicatedExam = {
      ...exam,
      id: Date.now().toString(),
      title: `${exam.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveExams([...exams, duplicatedExam])
    showToast('Examen duplicado correctamente', 'success')
  }

  // Activar/Desactivar examen
  const handleToggleExamStatus = (examId) => {
    const updatedExams = exams.map(exam => 
      exam.id === examId 
        ? { ...exam, isActive: !exam.isActive, updatedAt: new Date().toISOString() }
        : exam
    )
    saveExams(updatedExams)
    showToast('Estado del examen actualizado', 'success')
  }

  // Agregar pregunta al examen
  const handleAddQuestion = () => {
    resetQuestionForm()
    setEditingQuestionIndex(null)
    setShowQuestionModal(true)
  }

  // Editar pregunta
  const handleEditQuestion = (index) => {
    const question = examForm.questions[index]
    setQuestionForm(question)
    setEditingQuestionIndex(index)
    setShowQuestionModal(true)
  }

  // Guardar pregunta
  const handleSaveQuestion = () => {
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
  }

  // Eliminar pregunta
  const handleDeleteQuestion = (index) => {
    if (window.confirm('¿Está seguro de eliminar esta pregunta?')) {
      const updatedQuestions = examForm.questions.filter((_, i) => i !== index)
      setExamForm({ ...examForm, questions: updatedQuestions })
      showToast('Pregunta eliminada', 'success')
    }
  }

  // Resetear formulario de pregunta
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

  // Obtener nombre del curso
  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId)
    return course ? course.title : 'Curso no encontrado'
  }

  // Filtrar exámenes
  const filteredExams = exams.filter(exam => {
    if (filterCourse !== 'all' && exam.courseId !== filterCourse) return false
    if (filterType !== 'all' && exam.type !== filterType) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando exámenes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Gestión de Exámenes</h1>
        
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