import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import StudentEnrollmentManagement from '../../../../components/StudentEnrollmentManagement'

const StudentEnrollmentsPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Inscripciones de Estudiantes">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Gestión manual de inscripciones y asignaciones de estudiantes a cursos
        </p>

        {/* Usar el componente ya refactorizado */}
        <StudentEnrollmentManagement setActiveTab={() => {}} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📊 Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Inscripciones hoy:</span>
                <span className="text-green-400">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Pendientes:</span>
                <span className="text-yellow-400">7</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">⚡ Acciones</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                ✅ Inscripción Manual
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                📋 Importar Excel
              </button>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">💡 Ayuda</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Inscribe estudiantes directamente</li>
              <li>• Cambia estado de inscripciones</li>
              <li>• Gestiona pagos pendientes</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default StudentEnrollmentsPage