import { EXAM_TYPE_OPTIONS, EXAM_AREA_OPTIONS } from '../../data/adminExams'
import { QuestionList } from './QuestionList'

/**
 * Componente de formulario de examen
 */
export const ExamForm = ({
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
            {EXAM_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
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
          {EXAM_AREA_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
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
    <QuestionList
      questions={examForm.questions}
      handleAddQuestion={handleAddQuestion}
      handleEditQuestion={handleEditQuestion}
      handleDeleteQuestion={handleDeleteQuestion}
    />

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
