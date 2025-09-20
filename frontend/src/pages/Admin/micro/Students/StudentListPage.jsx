import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import StudentManagement from '../../../../components/AdminDashboard/StudentManagement'

const StudentListPage = () => {
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
      title="Gestión de Estudiantes"
      action={{
        label: "Nuevo Estudiante",
        href: "/admin/students/create"
      }}
    >
      <div className="space-y-6">
        <p className="text-text-secondary">
          Gestión y registro de estudiantes de la plataforma
        </p>

        {/* Usar el componente ya refactorizado */}
        <StudentManagement />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => console.log('Exportar estudiantes')}
            className="bg-card hover:bg-card/80 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📊 Exportar Lista
          </button>

          <button
            onClick={() => window.location.href = '/admin/students/enrollments'}
            className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg transition-colors"
          >
            📝 Inscripciones Manuales
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default StudentListPage