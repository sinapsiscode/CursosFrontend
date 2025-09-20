import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const AreaListPage = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de áreas
    const timer = setTimeout(() => {
      setAreas([
        { id: 1, key: 'metalurgia', name: 'Metalurgia', description: 'Ciencia de los metales', active: true, courses: 5 },
        { id: 2, key: 'soldadura', name: 'Soldadura', description: 'Técnicas de unión de metales', active: true, courses: 3 },
        { id: 3, key: 'mecanica', name: 'Mecánica Industrial', description: 'Sistemas mecánicos', active: false, courses: 2 }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const toggleAreaStatus = async (areaId) => {
    setAreas(prev => prev.map(area =>
      area.id === areaId ? { ...area, active: !area.active } : area
    ))
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Gestión de Áreas"
      action={{
        label: "Nueva Área",
        href: "/admin/areas/create"
      }}
    >
      <div className="space-y-6">
        <p className="text-text-secondary">
          Configuración de áreas de estudio disponibles en la plataforma
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map(area => (
            <div key={area.id} className="bg-card p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h3 className="font-medium text-white">{area.name}</h3>
                    <p className="text-sm text-text-secondary">{area.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  area.active
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {area.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  {area.courses} cursos
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAreaStatus(area.id)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      area.active
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {area.active ? 'Desactivar' : 'Activar'}
                  </button>

                  <button
                    onClick={() => window.location.href = `/admin/areas/create?edit=${area.id}`}
                    className="px-3 py-1 rounded text-xs bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">💡 Información</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Las áreas inactivas no aparecen en la selección del usuario</li>
            <li>• Cada área debe tener al menos un curso asociado</li>
            <li>• El key del área se usa para filtros y URLs</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default AreaListPage