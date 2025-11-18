import { QuestionCard } from './QuestionCard'

/**
 * Componente para mostrar la lista de preguntas del examen
 */
export const QuestionList = ({
  questions,
  handleAddQuestion,
  handleEditQuestion,
  handleDeleteQuestion
}) => (
  <div className="bg-background rounded-lg p-6 border border-gray-700">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-white">
        Preguntas del Examen ({questions.length})
      </h3>
      <button
        onClick={handleAddQuestion}
        className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        + Agregar Pregunta
      </button>
    </div>

    {questions.length === 0 ? (
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
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            index={index}
            onEdit={() => handleEditQuestion(index)}
            onDelete={() => handleDeleteQuestion(index)}
          />
        ))}
      </div>
    )}
  </div>
)
