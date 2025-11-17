import { EXAM_AREAS } from '../../constants/examManagementConstants'

const QuestionFormModal = ({
  show,
  formData,
  validationErrors,
  editingQuestion,
  handleInputChange,
  handleOptionChange,
  handleOptionImageChange,
  handleSubmit,
  handleClose
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            {editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pregunta */}
          <div>
            <label className="block text-secondary text-sm font-medium mb-2">
              Pregunta *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                validationErrors.question
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-accent'
              }`}
              placeholder="Escribe la pregunta..."
              rows={3}
              required
            />
            {validationErrors.question && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.question}</p>
            )}
          </div>

          {/* Imagen de la pregunta */}
          <div>
            <label className="block text-secondary text-sm font-medium mb-2">
              URL de Imagen de la Pregunta (opcional)
            </label>
            <input
              type="url"
              value={formData.questionImage}
              onChange={(e) => handleInputChange('questionImage', e.target.value)}
              className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.questionImage && (
              <img
                src={formData.questionImage}
                alt="Vista previa"
                className="mt-2 w-full max-w-xs h-32 object-cover rounded"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>

          {/* Área */}
          <div>
            <label className="block text-secondary text-sm font-medium mb-2">
              Área *
            </label>
            <select
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                validationErrors.area
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-accent'
              }`}
              required
            >
              {EXAM_AREAS.map(area => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
            {validationErrors.area && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.area}</p>
            )}
          </div>

          {/* Opciones */}
          <div>
            <label className="block text-secondary text-sm font-medium mb-2">
              Opciones de Respuesta *
            </label>
            <p className="text-xs text-gray-400 mb-4">
              Proporciona al menos 2 opciones. La opción seleccionada será la respuesta correcta.
            </p>

            {formData.options.map((option, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={formData.correct === index}
                    onChange={() => handleInputChange('correct', index)}
                    className="mt-3 accent-accent"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                        formData.correct === index
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-gray-600 focus:border-accent'
                      }`}
                      placeholder={`Opción ${index + 1}`}
                    />
                    <input
                      type="url"
                      value={formData.optionImages[index]}
                      onChange={(e) => handleOptionImageChange(index, e.target.value)}
                      className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none text-sm"
                      placeholder="URL de imagen para esta opción (opcional)"
                    />
                    {formData.optionImages[index] && (
                      <img
                        src={formData.optionImages[index]}
                        alt={`Opción ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {validationErrors.options && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.options}</p>
            )}
            {validationErrors.correct && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.correct}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              {editingQuestion ? 'Actualizar' : 'Crear'} Pregunta
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionFormModal