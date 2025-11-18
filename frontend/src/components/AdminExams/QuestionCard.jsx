/**
 * Componente de tarjeta de pregunta individual
 */
export const QuestionCard = ({ question, index, onEdit, onDelete }) => (
  <div className="bg-gray-800 rounded-lg p-4">
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
          onClick={onEdit}
          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)
