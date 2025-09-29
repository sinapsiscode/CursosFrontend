import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import CourseManagement from '../../../../components/AdminDashboard/CourseManagement'

const CourseListPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Gestión de Cursos"
    >
      <div className="space-y-6">
        <p className="text-text-secondary">
          Gestión y administración de cursos de la plataforma
        </p>

        {/* Usar el componente ya refactorizado */}
        <CourseManagement />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => window.location.href = '/admin/enrollments'}
            className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg transition-colors"
          >
            📊 Ver Contadores
          </button>

          <button
            onClick={() => console.log('Exportar cursos')}
            className="bg-card hover:bg-card/80 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📋 Exportar Lista
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default CourseListPage