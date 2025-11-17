import { useState } from 'react'

const EditStudentModal = ({ student, onConfirm, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: student.nombre || student.userName || student.name || '',
    email: student.email || student.userEmail || '',
    dni: student.dni || '',
    telefono: student.telefono || student.phone || '',
    activo: student.activo ?? true
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({ ...student, ...formData })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-lg border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-2xl">✏️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Editar Estudiante</h3>
            <p className="text-sm text-secondary">Actualizar información del estudiante</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="Nombre del estudiante"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* DNI y Teléfono en dos columnas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                DNI
              </label>
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-accent transition-colors"
                placeholder="12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-accent transition-colors"
                placeholder="+51 999 999 999"
              />
            </div>
          </div>

          {/* Estado */}
          <div className="bg-background/50 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => handleChange('activo', e.target.checked)}
                className="w-5 h-5 rounded border-gray-700 text-accent focus:ring-accent focus:ring-offset-0 bg-background"
              />
              <div>
                <span className="text-white font-medium">Estudiante activo</span>
                <p className="text-sm text-secondary">
                  {formData.activo
                    ? 'El estudiante puede acceder a la plataforma'
                    : 'El estudiante está suspendido'
                  }
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-background hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors font-medium"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStudentModal
