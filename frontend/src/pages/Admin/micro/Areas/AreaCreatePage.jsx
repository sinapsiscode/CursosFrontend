import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const AreaCreatePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditing = Boolean(editId)

  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    icon: '📚',
    color: '#3b82f6',
    active: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      // Simular carga de datos para edición
      const timer = setTimeout(() => {
        setFormData({
          key: 'metalurgia',
          name: 'Metalurgia',
          description: 'Ciencia de los metales y sus propiedades',
          icon: '🔧',
          color: '#3b82f6',
          active: true
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Generar key automáticamente si está vacío
      const finalData = {
        ...formData,
        key: formData.key || formData.name.toLowerCase().replace(/\s+/g, '-')
      }

      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log(isEditing ? 'Área actualizada:' : 'Área creada:', finalData)
      navigate('/admin/areas')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const iconOptions = ['📚', '🔧', '⚙️', '🏭', '🔨', '⚡', '🛠️', '💡']
  const colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

  return (
    <PageLayout title={isEditing ? 'Editar Área' : 'Nueva Área'}>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre del Área
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                placeholder="Ej: Metalurgia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Key (identificador)
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                placeholder="Se genera automáticamente"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
              rows="3"
              placeholder="Descripción del área de estudio"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`p-3 text-2xl border rounded-lg transition-colors bg-background ${
                      formData.icon === icon
                        ? 'border-accent bg-accent/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                      formData.color === color
                        ? 'border-white'
                        : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 text-accent"
            />
            <label htmlFor="active" className="text-white">
              Área activa (visible para usuarios)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/areas')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent text-black font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : (isEditing ? 'Actualizar Área' : 'Crear Área')}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default AreaCreatePage