import React, { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { showSuccess } = useUIStore()

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    showSuccess('Sesión cerrada exitosamente')
    navigate('/')
  }

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { path: '/admin/courses', label: 'Cursos', icon: '📚', badge: null },
    { path: '/admin/areas', label: 'Áreas', icon: '📁', badge: null },
    { path: '/admin/leads', label: 'Leads', icon: '👥', badge: 'new' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐', badge: '5' },
    { path: '/admin/whatsapp', label: 'WhatsApp', icon: '💬', badge: null },
    { path: '/admin/config', label: 'Configuración', icon: '⚙️', badge: null },
    { path: '/admin/system', label: 'Sistema', icon: '🔧', badge: null }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administrador</h1>
            <p className="text-text-secondary">Gestión y administración de la plataforma</p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Quick Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">152</p>
                <p className="text-xs text-text-secondary">Usuarios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">28</p>
                <p className="text-xs text-text-secondary">Cursos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">47</p>
                <p className="text-xs text-text-secondary">Leads</p>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Configuración
                  </Link>
                  <hr className="my-1 border-gray-700" />
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Ver Sitio
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1 mb-8 shadow-lg overflow-x-auto">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive(item.path)
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.badge === 'new' ? 'bg-green-500 text-white' :
                  'bg-accent/20 text-accent'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-surface rounded-lg shadow-lg p-6 min-h-96">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-text-secondary">
          <p>© 2024 MetSel Academy - Panel Administrativo | Versión 2.0.0</p>
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
