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

      </div>
    </PageLayout>
  )
}

export default DashboardPage