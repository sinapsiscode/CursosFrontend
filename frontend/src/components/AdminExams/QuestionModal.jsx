import { QuestionFormFields } from './QuestionFormFields'

/**
 * Modal para agregar/editar preguntas
 */
export const QuestionModal = ({
  showQuestionModal,
  setShowQuestionModal,
  questionForm,
  handleQuestionFormChange,
  handleOptionChange,
  handleOptionImageChange,
  handleSaveQuestion,
  editingQuestionIndex
}) => {
  if (!showQuestionModal) return null

  return (
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

        <div className="p-6">
          <QuestionFormFields
            questionForm={questionForm}
            handleQuestionFormChange={handleQuestionFormChange}
            handleOptionChange={handleOptionChange}
            handleOptionImageChange={handleOptionImageChange}
          />

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
  )
}
