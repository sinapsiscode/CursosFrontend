import { FileUploadButton } from './FileUploadButton'
import { ProgressBar } from './ProgressBar'

const ContentTab = ({ lessons, addLesson, updateLesson, removeLesson, errors, uploadProgress, handleFileUpload }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Lecciones del Curso</h3>
        <button
          type="button"
          onClick={addLesson}
          className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          + Agregar Lección
        </button>
      </div>

      {errors.lessons && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{errors.lessons}</p>
        </div>
      )}

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-background rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="text-white font-medium">Lección {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeLesson(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={lesson.title}
                  onChange={(e) => updateLesson(index, 'title', e.target.value)}
                  className={`w-full px-4 py-2 bg-surface border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors[`lesson_${index}_title`] ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Título de la lección"
                />
                {errors[`lesson_${index}_title`] && <p className="text-red-400 text-sm mt-1">{errors[`lesson_${index}_title`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  value={lesson.duration}
                  onChange={(e) => updateLesson(index, 'duration', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2 bg-surface border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors[`lesson_${index}_duration`] ? 'border-red-500' : 'border-gray-600'
                  }`}
                  min="1"
                />
                {errors[`lesson_${index}_duration`] && <p className="text-red-400 text-sm mt-1">{errors[`lesson_${index}_duration`]}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video de la Lección
              </label>
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <input
                    type="url"
                    value={lesson.videoUrl}
                    onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                    className="flex-1 px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="URL del video o sube un archivo"
                  />
                  <FileUploadButton
                    type="video"
                    onUpload={(url, fileId) => {
                      updateLesson(index, 'videoUrl', url)
                      updateLesson(index, 'videoFileId', fileId)
                    }}
                    handleFileUpload={handleFileUpload}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Subir Video
                  </FileUploadButton>
                </div>
                {lesson.videoFileId && uploadProgress[lesson.videoFileId] !== undefined && (
                  <ProgressBar progress={uploadProgress[lesson.videoFileId]} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={lesson.description || ''}
                onChange={(e) => updateLesson(index, 'description', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Breve descripción de lo que se verá en esta lección..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={lesson.isFree}
                  onChange={(e) => updateLesson(index, 'isFree', e.target.checked)}
                  className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <span className="text-gray-300 text-sm">Lección gratuita</span>
              </label>
            </div>
          </div>
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p>No hay lecciones agregadas</p>
            <p className="text-sm">Haz clic en "Agregar Lección" para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentTab