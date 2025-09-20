import { STUDENT_AREAS } from '../../constants/studentManagerConstants'

const StudentFormModal = ({
  showCreateForm,
  editingStudent,
  formData,
  validationErrors,
  handleInputChange,
  handleSubmit,
  handleCloseForm
}) => {
  if (!showCreateForm) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            {editingStudent ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
          </h3>
          <button
            onClick={handleCloseForm}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                required
              />
              {validationErrors.name && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Teléfono <span className="text-xs text-gray-400">(9 dígitos, inicia con 9)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.phone
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                placeholder="987654321"
                maxLength="9"
              />
              {validationErrors.phone && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Área de Estudio *
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
                <option value="">-- Selecciona un área --</option>
                {STUDENT_AREAS.map(area => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              {validationErrors.area && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.area}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                DNI <span className="text-xs text-gray-400">(8 dígitos)</span>
              </label>
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => handleInputChange('dni', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.dni
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                placeholder="12345678"
                maxLength="8"
              />
              {validationErrors.dni && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.dni}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Universidad
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Carrera
              </label>
              <input
                type="text"
                value={formData.career}
                onChange={(e) => handleInputChange('career', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              {editingStudent ? 'Actualizar' : 'Crear'} Estudiante
            </button>
            <button
              type="button"
              onClick={handleCloseForm}
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

export default StudentFormModal