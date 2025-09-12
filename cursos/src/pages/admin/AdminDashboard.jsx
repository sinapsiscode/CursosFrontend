import { useState, useEffect, useCallback } from 'react'
import { useAdminStore, useUIStore } from '../../store'
import { LoadingSpinner } from '../../components/ui'
import { authApi, courseApi, studentApi, userApi } from '../../services/api'
import AdminNotifications from './AdminNotifications'
import AdminEvents from './AdminEvents'
import AdminExamsV2 from './AdminExamsV2'
import WhatsAppManager from './WhatsAppManager'
import StudentManagement from './StudentManagement'
import ReviewModeration from './ReviewModeration'
import LoyaltyManagement from './LoyaltyManagement'
import AdminPhotos from './AdminPhotos'
import CoursePointsManagement from './CoursePointsManagement'
import RewardsManagement from './RewardsManagement'

const AdminDashboard = () => {
  const { showToast, setLoading, isLoading } = useUIStore()
  const { 
    analytics, 
    users, 
    courses, 
    coursesWithEnrollment,
    areas,
    levels,
    updateAnalytics,
    calculateAnalytics,
    getTopCourses,
    getRecentUsers,
    setCoursesWithEnrollment,
    getCourseEnrollmentData,
    setAreas,
    setLevels
  } = useAdminStore()
  
  const [loading, setLoadingLocal] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  const loadDashboardData = useCallback(async () => {
    try {
      setLoadingLocal(true)
      setLoading('dashboard', true)
      console.log('🔄 AdminDashboard: Cargando datos del dashboard...')
      
      const allUsers = await authApi.getUsers()
      const allCourses = await courseApi.getCourses()
      const coursesWithEnrollmentData = await courseApi.getCoursesWithEnrollment() || []
      const allAreas = await courseApi.getAreas(true) || []
      const allLevels = await courseApi.getLevels() || []
      
      const adminStore = useAdminStore.getState()
      adminStore.setUsers(allUsers || [])
      adminStore.setCourses(allCourses || [])
      setCoursesWithEnrollment(coursesWithEnrollmentData)
      setAreas(allAreas)
      setLevels(allLevels)
      
      try {
        const analyticsData = await userApi.getAnalytics()
        updateAnalytics(analyticsData)
        calculateAnalytics()
      } catch (error) {
        console.warn('Error loading analytics:', error)
      }
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error)
      showToast('Error al cargar datos del dashboard', 'error')
      
      const adminStore = useAdminStore.getState()
      adminStore.setUsers([])
      adminStore.setCourses([])
      setCoursesWithEnrollment([])
      setAreas([])
      setLevels([])
    } finally {
      setLoadingLocal(false)
      setLoading('dashboard', false)
    }
  }, [showToast, setLoading, updateAnalytics, calculateAnalytics, setCoursesWithEnrollment, setAreas, setLevels])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const StatCard = ({ title, value, change, icon, color = 'bg-accent' }) => (
    <div className="bg-surface rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-600 hover:border-gray-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value?.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-1 font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? '↗ +' : '↘ '}{change}% vs período anterior
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  )

  const topCourses = getTopCourses() || []
  const recentUsers = getRecentUsers() || []
  const enrollmentData = getCourseEnrollmentData()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Usuarios" 
                value={users?.length || 0}
                change={analytics?.userGrowth || null}
                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>}
              />
              
              <StatCard 
                title="Cursos Activos" 
                value={courses?.length || 0}
                change={analytics?.courseGrowth || null}
                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>}
                color="bg-blue-600"
              />
              
              <StatCard 
                title="Inscripciones" 
                value={enrollmentData?.totalEnrollments || 0}
                change={analytics?.enrollmentGrowth || null}
                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>}
                color="bg-green-600"
              />
              
              <StatCard 
                title="Áreas Disponibles" 
                value={areas?.length || 0}
                change={analytics?.areaGrowth || null}
                icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>}
                color="bg-purple-600"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface rounded-xl p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-4">Usuarios Recientes</h3>
                <div className="space-y-3">
                  {recentUsers.slice(0, 5).map((user, idx) => (
                    <div key={user.id || idx} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-background font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name || 'Usuario'}</p>
                        <p className="text-text-secondary text-sm">{user.email}</p>
                      </div>
                      <div className="text-text-secondary text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-xl p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-4">Cursos Populares</h3>
                <div className="space-y-3">
                  {topCourses.slice(0, 5).map((course, idx) => (
                    <div key={course.id || idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{course.title}</p>
                        <p className="text-text-secondary text-sm">
                          {course.enrollments || 0} inscripciones
                        </p>
                      </div>
                      <div className="text-accent font-semibold">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'students':
        return <StudentManagement />
      
      case 'whatsapp':
        return <WhatsAppManager />
      
      case 'notifications':
        return <AdminNotifications />
      
      case 'events':
        return <AdminEvents />
      
      case 'exams':
        return <AdminExamsV2 />
      
      case 'reviews':
        return <ReviewModeration />
      
      case 'loyalty':
        return <LoyaltyManagement />
      
      case 'photos':
        return <AdminPhotos />
      
      case 'points':
        return <CoursePointsManagement />
      
      case 'rewards':
        return <RewardsManagement />
      
      default:
        return <div className="text-white">Sección no encontrada</div>
    }
  }

  if (loading && isLoading('dashboard')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-text-secondary">Gestiona usuarios, cursos y configuraciones del sistema</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'students', label: 'Estudiantes', icon: '👥' },
              { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
              { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
              { id: 'events', label: 'Eventos', icon: '📅' },
              { id: 'exams', label: 'Exámenes', icon: '📝' },
              { id: 'reviews', label: 'Reseñas', icon: '⭐' },
              { id: 'loyalty', label: 'Fidelización', icon: '🏆' },
              { id: 'photos', label: 'Fotos', icon: '📸' },
              { id: 'points', label: 'Puntos', icon: '🎯' },
              { id: 'rewards', label: 'Recompensas', icon: '🎁' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-background shadow-md'
                    : 'bg-surface text-white hover:bg-gray-700 border border-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard