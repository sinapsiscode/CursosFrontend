import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useMemo } from 'react'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Definir las tabs del admin
  const adminTabs = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      id: 'courses',
      label: 'Cursos',
      icon: '📚',
      path: '/admin/courses'
    },
    {
      id: 'students',
      label: 'Estudiantes',
      icon: '👥',
      path: '/admin/students'
    },
    {
      id: 'reviews',
      label: 'Reseñas',
      icon: '⭐',
      path: '/admin/reviews'
    },
    {
      id: 'loyalty',
      label: 'Fidelización',
      icon: '🎁',
      path: '/admin/loyalty'
    },
    {
      id: 'coupons',
      label: 'Cupones',
      icon: '🎫',
      path: '/admin/coupons'
    },
    {
      id: 'areas',
      label: 'Áreas',
      icon: '🏷️',
      path: '/admin/areas'
    },
    {
      id: 'analytics',
      label: 'Reportes',
      icon: '📈',
      path: '/admin/analytics'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '💬',
      path: '/admin/whatsapp'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: '🔔',
      path: '/admin/notifications'
    },
    {
      id: 'events',
      label: 'Eventos',
      icon: '📅',
      path: '/admin/events'
    },
    {
      id: 'exams',
      label: 'Exámenes',
      icon: '📝',
      path: '/admin/exams'
    },
    {
      id: 'photos',
      label: 'Fotos',
      icon: '📸',
      path: '/admin/photos'
    }
  ], [])

  // Determinar la tab activa basada en la ruta actual
  const currentTabId = useMemo(() => {
    const path = location.pathname

    if (path.startsWith('/admin/dashboard')) return 'dashboard'
    if (path.startsWith('/admin/courses')) return 'courses'
    if (path.startsWith('/admin/students')) return 'students'
    if (path.startsWith('/admin/reviews')) return 'reviews'
    if (path.startsWith('/admin/loyalty')) return 'loyalty'
    if (path.startsWith('/admin/coupons')) return 'coupons'
    if (path.startsWith('/admin/areas')) return 'areas'
    if (path.startsWith('/admin/analytics')) return 'analytics'
    if (path.startsWith('/admin/whatsapp')) return 'whatsapp'
    if (path.startsWith('/admin/notifications')) return 'notifications'
    if (path.startsWith('/admin/events')) return 'events'
    if (path.startsWith('/admin/exams')) return 'exams'
    if (path.startsWith('/admin/photos')) return 'photos'

    return 'dashboard'
  }, [location.pathname])

  const handleTabClick = (tab) => {
    navigate(tab.path)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header con tabs */}
      <div className="bg-surface border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`
                  flex items-center space-x-2 px-4 py-4 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-all duration-200
                  ${currentTabId === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la página actual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout