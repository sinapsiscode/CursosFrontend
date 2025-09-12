import React, { useState, useEffect } from 'react'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const QuestionModal = ({ 
  showQuestionModal, 
  setShowQuestionModal,
  questionForm,
  handleQuestionFormChange,
  handleOptionChange,
  handleOptionImageChange,
  handleSaveQuestion,
  editingQuestionIndex
}) => {
  const [hardcodedValues, setHardcodedValues] = useState({})

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
        setHardcodedValues({
          examples: {
            imageUrl: 'https://ejemplo.com/imagen.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=... o https://youtu.be/...'
          }
        })
      }
    }
    loadHardcodedValues()
  }, [])

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

        <div className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen de la pregunta (opcional)
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Subir archivo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
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

              <div>
                <label className="block text-xs text-gray-400 mb-1">O ingresar URL</label>
                <input
                  type="url"
                  value={questionForm.questionImage && questionForm.questionImage.startsWith('http') ? questionForm.questionImage : ''}
                  onChange={(e) => handleQuestionFormChange('questionImage', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder={hardcodedValues?.examples?.imageUrl || 'https://ejemplo.com/imagen.jpg'}
                />
              </div>
            </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video de YouTube (opcional)
            </label>
            <input
              type="url"
              value={questionForm.youtubeUrl}
              onChange={(e) => handleQuestionFormChange('youtubeUrl', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder={hardcodedValues?.examples?.videoUrl || 'https://www.youtube.com/watch?v=... o https://youtu.be/...'}
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
                      value={questionForm.optionImages ? questionForm.optionImages[index] : ''}
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

export default QuestionModal