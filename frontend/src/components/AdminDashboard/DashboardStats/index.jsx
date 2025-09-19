import { useAdminAnalytics } from '../../../hooks/useAdminAnalytics'
import { STAT_CARDS_CONFIG } from '../../../constants/adminDashboardConstants'
import { LoadingSpinner } from '../../common'
import StatCard from './StatCard'
import UserChart from './UserChart'
import PopularCourses from './PopularCourses'
import RecentUsers from './RecentUsers'

const DashboardStats = () => {
  const {
    loading,
    metrics,
    userChartData
  } = useAdminAnalytics()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      {/* Stats Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STAT_CARDS_CONFIG.map((config) => (
          <StatCard
            key={config.key}
            title={config.title}
            value={metrics[config.key]}
            change={config.change}
            color={config.color}
            icon={config.icon}
          />
        ))}
      </div>

      {/* Charts y Analytics */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <UserChart
          newUsersThisWeek={metrics.newUsersThisWeek}
          chartData={userChartData}
        />
      </div>

      {/* Tablas */}
      <div className="grid lg:grid-cols-2 gap-8">
        <PopularCourses topCourses={metrics.topCourses} />
        <RecentUsers recentUsers={metrics.recentUsers} />
      </div>
    </>
  )
}

export default DashboardStats