import PageLayout from '../../../components/Admin/Layout/PageLayout'
import DashboardStats from '../../../components/AdminDashboard/DashboardStats'

const DashboardPage = () => {
  return (
    <PageLayout
      title="Dashboard Administrativo"
      action={{
        label: "Ver Reportes",
        href: "/admin/analytics/reports"
      }}
    >
      <div className="space-y-6">
        <p className="text-text-secondary">
          Resumen de actividad de la plataforma
        </p>

        <DashboardStats />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Acceso Rápido</h3>
            <div className="space-y-2">
              <a href="/admin/students" className="block text-accent hover:underline">
                → Gestionar Estudiantes
              </a>
              <a href="/admin/courses" className="block text-accent hover:underline">
                → Gestionar Cursos
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default DashboardPage