import { useState } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import { useExamManagement } from '../../../../hooks/useExamManagement'
import { getExamStats, filterQuestions, exportQuestionsToJSON } from '../../../../utils/examManagementUtils'
import { EXAM_AREAS, getAreaColor, getAreaLabel } from '../../../../constants/examManagementConstants'
import QuestionFormModal from '../../../../components/Exams/QuestionFormModal'

const ExamManagementPage = () => {
  const {
    questions,
    loading,
    showQuestionForm,
    searchTerm,
    filters,
    formData,
    validationErrors,
    setShowQuestionForm,
    setSearchTerm,
    setFilters,
    handleInputChange,
    handleOptionChange,
    handleOptionImageChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleImport,
    handleCloseForm,
    resetToDefaults
  } = useExamManagement()

  const [showImportDialog, setShowImportDialog] = useState(false)

  const filteredQuestions = filterQuestions(questions, searchTerm, filters)
  const stats = getExamStats(questions)

  const handleExport = () => {
    exportQuestionsToJSON(questions)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/json') {
      handleImport(file)
      setShowImportDialog(false)
    }
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Exámenes">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar preguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md bg-card border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            />
            <select
              value={filters.area}
              onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
              className="bg-card border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            >
              <option value="all">Todas las áreas</option>
              {EXAM_AREAS.map(area => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQuestionForm(true)}
              className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              + Nueva Pregunta
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📥 Exportar
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              📤 Importar
            </button>
            <button
              onClick={resetToDefaults}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              🔄 Restaurar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Total Preguntas</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          {stats.byArea.map(area => (
            <div key={area.value} className="bg-card p-4 rounded-lg">
              <p className="text-text-secondary text-sm">{area.label}</p>
              <p className={`text-2xl font-bold ${
                area.value === 'metalurgia' ? 'text-blue-400' :
                area.value === 'mineria' ? 'text-green-400' : 'text-orange-400'
              }`}>
                {area.count}
              </p>
            </div>
          ))}
          <div className="bg-card p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Con Imágenes</p>
            <p className="text-2xl font-bold text-purple-400">{stats.withImages}</p>
          </div>
        </div>

        {/* Questions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((question, index) => (
            <div key={question.id} className="bg-card rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-text-secondary text-sm">#{index + 1}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAreaColor(question.area).replace('bg-', 'bg-opacity-20 text-')}`}>
                  {getAreaLabel(question.area)}
                </span>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">{question.question}</h4>
                {question.questionImage && (
                  <img src={question.questionImage} alt="Pregunta" className="w-full h-32 object-cover rounded mb-2" />
                )}
              </div>

              <div className="space-y-1">
                {question.options.map((option, optIndex) => option && (
                  <div key={optIndex} className={`flex items-center gap-2 text-sm ${
                    optIndex === question.correct ? 'text-green-400' : 'text-text-secondary'
                  }`}>
                    <span>{optIndex === question.correct ? '✓' : '○'}</span>
                    <span>{option}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-700">
                <button
                  onClick={() => handleEdit(question)}
                  className="text-accent hover:text-accent/80 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDuplicate(question)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Duplicar
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            {questions.length === 0 ? 'No hay preguntas creadas' : 'No se encontraron preguntas con ese criterio'}
          </div>
        )}

        {/* Import Dialog */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Importar Preguntas</h3>
              <p className="text-text-secondary mb-4">
                Selecciona un archivo JSON con las preguntas a importar
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowImportDialog(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Form Modal */}
        <QuestionFormModal
          show={showQuestionForm}
          formData={formData}
          validationErrors={validationErrors}
          editingQuestion={!!questions.find(q => q.id === formData.id)}
          handleInputChange={handleInputChange}
          handleOptionChange={handleOptionChange}
          handleOptionImageChange={handleOptionImageChange}
          handleSubmit={handleSubmit}
          handleClose={handleCloseForm}
        />
      </div>
    </PageLayout>
  )
}

export default ExamManagementPage