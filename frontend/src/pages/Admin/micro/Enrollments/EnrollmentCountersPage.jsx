import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import CourseEnrollmentManagement from '../../../../components/AdminDashboard/CourseEnrollmentManagement'

const EnrollmentCountersPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Contadores de Inscripciones">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Control de contadores de inscripciones por curso
        </p>

        {/* Usar el componente ya refactorizado */}
        <CourseEnrollmentManagement />

        <div className="bg-surface p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">💡 Información</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Los contadores se actualizan en tiempo real</li>
            <li>• Puedes ajustar manualmente el número de inscripciones</li>
            <li>• Los cambios se reflejan inmediatamente en la plataforma</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default EnrollmentCountersPage