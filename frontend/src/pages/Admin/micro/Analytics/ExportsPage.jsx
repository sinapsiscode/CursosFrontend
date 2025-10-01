import { useState } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ExportsPage = () => {
  const [exporting, setExporting] = useState(false)
  const [exportType, setExportType] = useState('students')

  const handleExport = async (type) => {
    setExporting(true)
    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(`Exportando ${type}...`)
      alert(`${type} exportado exitosamente`)
    } catch (error) {
      console.error('Error en exportación:', error)
    } finally {
      setExporting(false)
    }
  }

  const exportOptions = [
    { id: 'students', name: 'Lista de Estudiantes', icon: '👥', description: 'Exportar todos los estudiantes registrados' },
    { id: 'courses', name: 'Catálogo de Cursos', icon: '📚', description: 'Exportar información de cursos y estadísticas' },
    { id: 'analytics', name: 'Datos Analytics', icon: '📊', description: 'Exportar métricas y reportes consolidados' },
    { id: 'enrollments', name: 'Inscripciones', icon: '📝', description: 'Exportar datos de inscripciones por curso' }
  ]

  return (
    <PageLayout title="Exportar Datos">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Exporta datos de la plataforma en formato Excel
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportOptions.map(option => (
            <div key={option.id} className="bg-surface p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h3 className="font-medium text-white">{option.name}</h3>
                    <p className="text-sm text-text-secondary">{option.description}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExport(option.id)}
                disabled={exporting}
                className="w-full bg-accent hover:bg-accent/80 text-background py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exportando...' : 'Exportar a Excel'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-surface p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">💡 Información</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Los archivos se descargan automáticamente</li>
            <li>• Formato: Excel (.xlsx)</li>
            <li>• Datos actualizados en tiempo real</li>
            <li>• Máximo 10,000 registros por exportación</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default ExportsPage