import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const AreaListPage = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Reemplazar con llamada a API
    const timer = setTimeout(() => {
      setAreas([
        {
          id: 1,
          key: 'metalurgia',
          name: 'Metalurgia',
          icon: '🔥',
          description: 'Ciencia y tecnología de los metales',
          active: true,
          borderColor: 'border-red-500'
        },
        {
          id: 2,
          key: 'mineria',
          name: 'Minería',
          icon: '⛏️',
          description: 'Extracción y procesamiento de minerales',
          active: true,
          borderColor: 'border-blue-500'
        },
        {
          id: 3,
          key: 'geologia',
          name: 'Geología',
          icon: '🌍',
          description: 'Estudio de la estructura y composición terrestre',
          active: true,
          borderColor: 'border-cyan-500'
        },
        {
          id: 4,
          key: 'ingenieria-civil',
          name: 'Ingeniería Civil',
          icon: '🏗️',
          description: 'Diseño y construcción de infraestructura',
          active: false,
          borderColor: 'border-orange-500'
        }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const toggleAreaStatus = async (areaId) => {
    // TODO: Conectar con API
    setAreas(prev => prev.map(area =>
      area.id === areaId ? { ...area, active: !area.active } : area
    ))
  }

  const deleteArea = async (areaId) => {
    if (confirm('¿Estás seguro de eliminar esta área?')) {
      // TODO: Conectar con API
      setAreas(prev => prev.filter(area => area.id !== areaId))
    }
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Gestión de Áreas de Estudio"
      action={{
        label: "Crear Área",
        href: "/admin/areas/create"
      }}
    >
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
                    <p className="text-sm text-text-secondary">{area.key}</p>
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
              <p className="text-sm text-text-secondary leading-relaxed">
                {area.description}
              </p>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.location.href = `/admin/areas/create?edit=${area.id}`}
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
    </PageLayout>
  )
}

export default AreaListPage
