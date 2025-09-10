import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useConfigStore, useUIStore } from '../../store'
import { GUEST_ROUTES } from '../../config/routes'
import apiClient from '../../api/client'

/**
 * AreaSelection - Página de selección de área conectada a API
 * Ya no usa datos hardcodeados, lee áreas desde JSON Server
 */
const AreaSelection = () => {
  const navigate = useNavigate()
  const { setSelectedArea, setGuest } = useAuthStore()
  const { areas, setAreas } = useConfigStore()
  const { showError } = useUIStore()
  
  const [selectedAreaState, setSelectedAreaState] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar áreas desde API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasData = await apiClient.get('/areas')
        console.log('Areas loaded from API:', areasData)
        setAreas(areasData.filter(area => area.isActive)) // Solo áreas activas
      } catch (error) {
        console.error('Error loading areas:', error)
        showError('Error al cargar las áreas disponibles')
      } finally {
        setLoading(false)
      }
    }

    fetchAreas()
  }, [setAreas, showError])

  // Handlers
  const handleAreaSelect = (areaSlug) => {
    setSelectedAreaState(areaSlug)
  }

  const handleContinue = () => {
    if (selectedAreaState) {
      // Generar ID único para sesión de invitado
      const deviceId = crypto.randomUUID()
      
      // Configurar usuario como invitado con área seleccionada
      setGuest(selectedAreaState, deviceId)
      setSelectedArea(selectedAreaState)
      
      console.log('Guest session created:', { area: selectedAreaState, deviceId })
      
      // Redirigir al home
      navigate(GUEST_ROUTES.HOME)
    }
  }

  // Render de iconos SVG basados en slug del área
  const renderAreaIcon = (areaSlug) => {
    const icons = {
      metalurgia: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 4L8 16v32l24 12 24-12V16L32 4zm-16 36V24l16-8 16 8v16l-16 8-16-8z"/>
          <path d="M28 20v24l8-4V20l-8 4z"/>
        </svg>
      ),
      mineria: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M8 48h48v8H8zm4-4h40l-4-8H16zm2-12l6-8h20l6 8zm4-16l4-8h12l4 8z"/>
          <rect x="28" y="52" width="8" height="8"/>
        </svg>
      ),
      geologia: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 40c-8.837 0-16-7.163-16-16s7.163-16 16-16 16 7.163 16 16-7.163 16-16 16z"/>
          <circle cx="32" cy="28" r="4"/>
          <path d="M24 40l8-8 8 8"/>
        </svg>
      )
    }

    return icons[areaSlug] || (
      <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
        <span className="text-2xl">📚</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando áreas disponibles...</p>
        </div>
      </div>
    )
  }

  if (areas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Sin áreas disponibles
          </h2>
          <p className="text-text-secondary mb-4">
            El administrador aún no ha configurado áreas de estudio.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-accent text-background rounded-lg font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Elige tu área de especialización
            </h1>
            <p className="text-text-secondary">
              Selecciona el área que más te interese para ver cursos personalizados
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {areas.map((area) => (
            <div
              key={area.id}
              onClick={() => handleAreaSelect(area.slug)}
              className={`
                relative bg-surface border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                ${selectedAreaState === area.slug 
                  ? 'border-accent shadow-lg ring-2 ring-accent ring-opacity-50' 
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              {/* Selection indicator */}
              {selectedAreaState === area.slug && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-background" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div 
                className="mb-6 flex justify-center"
                style={{ color: area.color }}
              >
                {renderAreaIcon(area.slug)}
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: area.color }}
                >
                  {area.name}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {area.description}
                </p>
              </div>

              {/* Hover effect */}
              <div 
                className={`
                  absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent rounded-xl opacity-0 transition-opacity duration-300
                  ${selectedAreaState === area.slug ? 'opacity-10' : 'group-hover:opacity-5'}
                `}
                style={{ 
                  background: selectedAreaState === area.slug 
                    ? `linear-gradient(135deg, ${area.color}20, transparent)` 
                    : undefined 
                }}
              />
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedAreaState}
            className={`
              px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
              ${selectedAreaState
                ? 'bg-accent text-background hover:bg-accent/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {selectedAreaState ? 'Continuar' : 'Selecciona un área'}
          </button>
          
          {selectedAreaState && (
            <p className="text-text-secondary text-sm mt-3">
              Continuarás como invitado. Podrás registrarte más tarde para guardar tu progreso.
            </p>
          )}
        </div>

        {/* Debug info (desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-accent mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-400">
              {JSON.stringify({ 
                areasLoaded: areas.length,
                selectedArea: selectedAreaState,
                areasFromAPI: areas.map(a => ({ id: a.id, name: a.name, slug: a.slug }))
              }, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}

export default AreaSelection