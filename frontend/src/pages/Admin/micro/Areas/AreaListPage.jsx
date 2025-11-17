import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import { areasService } from '../../../../services/areasService'
import { useAuth } from '../../../../context/AuthContext'

const AreaListPage = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateSection, setShowCreateSection] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [error, setError] = useState(null)

  const { hasPermission } = useAuth()

  const [formData, setFormData] = useState({
    nombre: '',
    clave: '',
    icono: '📚',
    descripcion: '',
    color: 'border-blue-500'
  })

  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await areasService.getAll()

      // Normalizar datos del backend al formato que usa el componente
      const normalizedAreas = data.map(area => ({
        id: area.id,
        key: area.clave || area.key || '',
        name: area.nombre || area.name || '',
        icon: area.icono || area.icon || '📚',
        description: area.descripcion || area.description || '',
        active: area.activo !== undefined ? area.activo : true,
        borderColor: area.color || area.borderColor || 'border-blue-500'
      }))

      setAreas(normalizedAreas)
    } catch (err) {
      console.error('Error cargando áreas:', err)
      setError(err.message || 'Error al cargar áreas')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (area) => {
    setEditingArea(area)
    setFormData({
      nombre: area.name,
      clave: area.key,
      icono: area.icon,
      descripcion: area.description,
      color: area.borderColor
    })
    setShowCreateSection(true)
  }

  const handleCancelEdit = () => {
    setEditingArea(null)
    setFormData({
      nombre: '',
      clave: '',
      icono: '📚',
      descripcion: '',
      color: 'border-blue-500'
    })
    setShowCreateSection(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const areaData = {
        nombre: formData.nombre,
        clave: formData.clave,
        icono: formData.icono,
        descripcion: formData.descripcion,
        color: formData.color,
        activo: true
      }

      if (editingArea) {
        // Actualizar área existente
        await areasService.update(editingArea.id, areaData)
      } else {
        // Crear nueva área
        await areasService.create(areaData)
      }

      await loadAreas()
      handleCancelEdit()

    } catch (err) {
      console.error('Error guardando área:', err)
      alert(err.message || 'Error al guardar área')
    } finally {
      setLoading(false)
    }
  }

  const toggleAreaStatus = async (areaId) => {
    try {
      await areasService.toggleStatus(areaId)
      await loadAreas()
    } catch (err) {
      console.error('Error cambiando estado:', err)
      alert(err.message || 'Error al cambiar estado del área')
    }
  }

  const deleteArea = async (areaId) => {
    if (confirm('¿Estás seguro de eliminar esta área?')) {
      try {
        await areasService.delete(areaId)
        await loadAreas()
      } catch (err) {
        console.error('Error eliminando área:', err)
        alert(err.message || 'Error al eliminar área')
      }
    }
  }

  const colorOptions = [
    { label: 'Azul', value: 'border-blue-500' },
    { label: 'Rojo', value: 'border-red-500' },
    { label: 'Verde', value: 'border-green-500' },
    { label: 'Amarillo', value: 'border-yellow-500' },
    { label: 'Morado', value: 'border-purple-500' },
    { label: 'Rosa', value: 'border-pink-500' },
    { label: 'Cyan', value: 'border-cyan-500' },
    { label: 'Naranja', value: 'border-orange-500' }
  ]

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Áreas de Estudio">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Áreas de Estudio</h2>
          <button
            onClick={() => {
              setShowCreateSection(!showCreateSection)
              if (showCreateSection) {
                handleCancelEdit()
              }
            }}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
          >
            {showCreateSection ? 'Cancelar' : '+ Crear Área'}
          </button>
        </div>

        {/* Sección: Crear/Editar Área (colapsable) */}
        {showCreateSection && (
          <div className="bg-surface rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">
              {editingArea ? 'Editar Área' : 'Nueva Área'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre y Clave */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Nombre del Área</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Metalurgia"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Clave (slug)</label>
                  <input
                    type="text"
                    name="clave"
                    value={formData.clave}
                    onChange={handleChange}
                    placeholder="metalurgia"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              {/* Icono y Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Icono (emoji)</label>
                  <input
                    type="text"
                    name="icono"
                    value={formData.icono}
                    onChange={handleChange}
                    placeholder="🔥"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Color del borde</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-white text-sm mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción breve del área de estudio..."
                  rows={4}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                >
                  {editingArea ? 'Actualizar Área' : 'Crear Área'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cards de Áreas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => (
            <div
              key={area.id}
              className={`bg-surface rounded-lg border-l-4 ${area.borderColor} overflow-hidden`}
            >
              <div className="p-6 space-y-4">
                {/* Header con icono y badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{area.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-white">{area.name}</h3>
                      <p className="text-sm text-secondary">{area.key}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      area.active
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {area.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-sm text-secondary leading-relaxed">
                  {area.description}
                </p>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(area)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleAreaStatus(area.id)}
                    className={`flex-1 text-white text-sm font-medium py-2 rounded transition-colors ${
                      area.active
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {area.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => deleteArea(area.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default AreaListPage
