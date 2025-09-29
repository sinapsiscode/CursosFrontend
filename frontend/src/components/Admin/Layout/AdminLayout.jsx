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
      path: '/admin/dashboard'
    },
    {
      id: 'courses',
      label: 'Cursos',
      path: '/admin/courses'
    },
    {
      id: 'students',
      label: 'Estudiantes',
      path: '/admin/students'
    },
    {
      id: 'reviews',
      label: 'Reseñas',
      path: '/admin/reviews'
    },
    {
      id: 'loyalty',
      label: 'Fidelización',
      path: '/admin/loyalty'
    },
    {
      id: 'coupons',
      label: 'Cupones',
      path: '/admin/coupons'
    },
    {
      id: 'areas',
      label: 'Áreas',
      path: '/admin/areas'
    },
    {
      id: 'analytics',
      label: 'Reportes',
      path: '/admin/analytics'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      path: '/admin/whatsapp'
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      path: '/admin/notifications'
    },
    {
      id: 'events',
      label: 'Eventos',
      path: '/admin/events'
    },
    {
      id: 'exams',
      label: 'Exámenes',
      path: '/admin/exams'
    },
    {
      id: 'photos',
      label: 'Fotos',
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
    <div className="min-h-screen bg-background" style={{ overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Header con tabs */}
      <div className="w-full border-b border-gray-700 bg-surface" style={{ maxWidth: '100vw' }}>
        <div className="w-full px-4 py-3" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`
                  px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md
                  transition-all duration-200
                  ${currentTabId === tab.id
                    ? 'bg-accent text-background'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la página actual */}
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout