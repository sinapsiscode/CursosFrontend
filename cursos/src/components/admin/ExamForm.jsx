import React from 'react'

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

    <div className="bg-background rounded-lg p-6 border border-gray-700 space-y-6">
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
                        {question.optionImages && question.optionImages[optIndex] && (
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

export default ExamForm