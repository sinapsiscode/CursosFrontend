import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import NotificationCenter from './NotificationCenter'

const Navbar = () => {
  const { user, isAuthenticated, selectedArea } = useAuthStore()
  const { searchQuery, setSearchQuery, openModal } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const areaColors = {
    metalurgia: 'text-primary-metalurgia',
    mineria: 'text-primary-mineria', 
    geologia: 'text-primary-geologia'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Lógica de búsqueda se manejará en la página correspondiente
  }

  return (
    <nav className="bg-surface border-b border-gray-700 sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-white">MetSel</span>
            </div>
            {selectedArea && (
              <div className={`text-sm px-2 py-1 rounded ${areaColors[selectedArea]} bg-opacity-20`}>
                {selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1)}
              </div>
            )}
          </div>

          {/* Buscador - Solo en desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-background text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="¿Qué quieres aprender hoy?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Usuario / Login */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Centro de notificaciones */}
                <NotificationCenter />
                
                <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-accent transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                    alt={user?.name || 'Usuario'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                  />
                  <span className="hidden md:block text-sm">{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg py-2 border border-gray-600 z-50">
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background transition-colors"
                    >
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => {
                        navigate('/my-courses')
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background transition-colors"
                    >
                      Mis Cursos
                    </button>
                    <button
                      onClick={() => {
                        navigate('/certificates')
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background transition-colors"
                    >
                      Certificados
                    </button>
                    <button
                      onClick={() => {
                        navigate('/loyalty')
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background transition-colors"
                    >
                      Programa de Puntos
                    </button>
                    {user?.role === 'admin' && (
                      <>
                        <hr className="my-2 border-gray-600" />
                        <button
                          onClick={() => {
                            navigate('/admin')
                            setShowUserMenu(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background transition-colors"
                        >
                          Panel Admin
                        </button>
                      </>
                    )}
                    <hr className="my-2 border-gray-600" />
                    <button
                      onClick={() => {
                        useAuthStore.getState().logout()
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-background transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openModal('login')}
                  className="text-white hover:text-accent transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => openModal('register')}
                  className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cerrar menú cuando se hace click fuera */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}

export default Navbar