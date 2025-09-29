import { COURSE_STATUS } from '../../../constants/formConstants'

const SettingsTab = ({ formData, updateFormData, lessons, materials }) => {
  const totalDuration = formData.duration + lessons.reduce((acc, lesson) => acc + lesson.duration, 0)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Configuración del Curso</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-medium mb-4">Estado de Publicación</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado del Curso
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData({
                    status: e.target.value,
                    publishedAt: e.target.value === COURSE_STATUS.PUBLISHED && !formData.publishedAt
                      ? new Date().toISOString()
                      : formData.publishedAt
                  })}
                  className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value={COURSE_STATUS.DRAFT}>📝 Borrador</option>
                  <option value={COURSE_STATUS.PUBLISHED}>✅ Publicado</option>
                  <option value={COURSE_STATUS.ARCHIVED}>📦 Archivado</option>
                  <option value={COURSE_STATUS.MAINTENANCE}>🔧 Mantenimiento</option>
                </select>
                <p className="text-gray-400 text-xs mt-1">
                  Solo los cursos publicados son visibles para los estudiantes
                </p>
              </div>

              {formData.status === COURSE_STATUS.PUBLISHED && formData.publishedAt && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">
                    📅 Publicado el: {new Date(formData.publishedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Configuraciones de Funcionalidad</h4>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.enableEnrollment}
                  onChange={(e) => updateFormData({ enableEnrollment: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Permitir Inscripciones</span>
                  <p className="text-gray-400 text-sm">Los estudiantes pueden inscribirse al curso</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.enableComments}
                  onChange={(e) => updateFormData({ enableComments: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Permitir Comentarios</span>
                  <p className="text-gray-400 text-sm">Los estudiantes pueden comentar en las lecciones</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.enableRating}
                  onChange={(e) => updateFormData({ enableRating: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Permitir Calificaciones</span>
                  <p className="text-gray-400 text-sm">Los estudiantes pueden calificar el curso</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Etiquetas y Promociones</h4>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isDemo}
                  onChange={(e) => updateFormData({ isDemo: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Curso Demo</span>
                  <p className="text-gray-400 text-sm">Permite acceso gratuito a algunas lecciones</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => updateFormData({ featured: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Curso Destacado</span>
                  <p className="text-gray-400 text-sm">Aparece en la sección de cursos destacados</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => updateFormData({ popular: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Curso Popular</span>
                  <p className="text-gray-400 text-sm">Marca el curso como popular</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => updateFormData({ isNew: e.target.checked })}
                  className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                />
                <div>
                  <span className="text-white">Curso Nuevo</span>
                  <p className="text-gray-400 text-sm">Muestra badge de "Nuevo" en el curso</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg p-6">
          <h4 className="text-white font-medium mb-4">Resumen del Curso</h4>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Lecciones:</span>
              <span className="text-white">{lessons.length}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Duración total:</span>
              <span className="text-white">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Materiales:</span>
              <span className="text-white">{materials.length}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Lecciones gratuitas:</span>
              <span className="text-white">{lessons.filter(l => l.isFree).length}</span>
            </div>

            <hr className="border-gray-600" />

            <div className="flex justify-between font-medium">
              <span className="text-gray-300">Gratis:</span>
              <span className="text-accent">
                Gratis
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-medium">URL de Inscripción</h4>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Link de Inscripción/Compra Personalizado
          </label>
          <input
            type="url"
            value={formData.enrollmentUrl}
            onChange={(e) => updateFormData({ enrollmentUrl: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="https://ejemplo.com/inscribirse-curso"
          />
          <p className="text-gray-400 text-xs mt-2">
            Si se especifica, el botón "Inscribirse" redirigirá a esta URL en lugar del proceso de inscripción interno
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab