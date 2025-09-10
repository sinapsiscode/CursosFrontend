import { useState, useEffect } from 'react'
import { useAuthStore, useCourseStore, useUIStore } from '../store'
import { CourseCard, LoadingSpinner, CourseCardSkeleton } from '../components/common'
import { apiService } from '../services/api'
import { whatsappService } from '../services/whatsappService'
import { eventService } from '../services/eventService'

const CourseExplorer = () => {
  const { selectedArea } = useAuthStore()
  const { 
    filteredCourses, 
    filters, 
    setFilters, 
    viewMode, 
    setViewMode,
    setCourses 
  } = useCourseStore()
  const { searchQuery, setSearchQuery } = useUIStore()
  const [loading, setLoading] = useState(true)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [whatsappTriggered, setWhatsappTriggered] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [selectedArea])

  useEffect(() => {
    // Debounce search
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
      setFilters({ search: searchQuery })
      
      // WhatsApp Lead Generation: Trigger cuando usuario busca cursos
      if (searchQuery.trim().length > 2 && !whatsappTriggered) {
        whatsappService.triggerCourseSearch(searchQuery, selectedArea)
        setWhatsappTriggered(true)
        
        // Tracking de intereses para eventos personalizados
        eventService.trackUserInterest('search', {
          query: searchQuery,
          area: selectedArea
        })
        
        // Reset trigger después de 30 segundos para permitir nuevas búsquedas
        setTimeout(() => setWhatsappTriggered(false), 30000)
      }
    }, 300)
    
    setSearchTimeout(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchQuery, selectedArea, whatsappTriggered])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const courses = await apiService.getCourses()
      setCourses(courses)
      
      // Asegurar que los cursos dinámicos estén incluidos
      useCourseStore.getState().initializeDynamicCourses()
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters }
    
    if (newFilters[filterType] === value) {
      newFilters[filterType] = null // Toggle off if same value
    } else {
      newFilters[filterType] = value
    }
    
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({
      area: null,
      level: null,
      duration: null,
      price: null,
      search: ''
    })
    setSearchQuery('')
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== null && value !== ''
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-12 bg-surface rounded-lg mb-8 animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explorar Cursos</h1>
            <p className="text-text-secondary">
              Descubre {filteredCourses.length} cursos disponibles
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' 
                ? 'bg-accent text-background' 
                : 'bg-surface text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' 
                ? 'bg-accent text-background' 
                : 'bg-surface text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-surface text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Buscar cursos, instructores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-surface rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-accent hover:text-accent-light transition-colors text-sm"
              >
                Limpiar filtros ({activeFiltersCount})
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Área</label>
              <div className="space-y-2">
                {/* TODO: REFACTOR - Áreas hardcodeadas, usar useAreasStore() */}
                {['metalurgia', 'mineria', 'geologia'].map(area => (
                  <button
                    key={area}
                    onClick={() => handleFilterChange('area', area)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.area === area
                        ? 'bg-accent text-background'
                        : 'bg-background text-white hover:bg-gray-700'
                    }`}
                  >
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Nivel */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Nivel</label>
              <div className="space-y-2">
                {/* TODO: REFACTOR - Niveles hardcodeados, usar useLevelsStore() */}
                {['básico', 'intermedio', 'avanzado'].map(level => (
                  <button
                    key={level}
                    onClick={() => handleFilterChange('level', level)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.level === level
                        ? 'bg-accent text-background'
                        : 'bg-background text-white hover:bg-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Duración</label>
              <div className="space-y-2">
                {[
                  { key: 'short', label: 'Corto (< 2h)' },
                  { key: 'medium', label: 'Medio (2-5h)' },
                  { key: 'long', label: 'Largo (> 5h)' }
                ].map(duration => (
                  <button
                    key={duration.key}
                    onClick={() => handleFilterChange('duration', duration.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.duration === duration.key
                        ? 'bg-accent text-background'
                        : 'bg-background text-white hover:bg-gray-700'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Precio</label>
              <div className="space-y-2">
                {[
                  { key: 'free', label: 'Gratis' },
                  { key: 'premium', label: 'Premium' }
                ].map(price => (
                  <button
                    key={price.key}
                    onClick={() => handleFilterChange('price', price.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.price === price.key
                        ? 'bg-accent text-background'
                        : 'bg-background text-white hover:bg-gray-700'
                    }`}
                  >
                    {price.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron cursos</h3>
            <p className="text-text-secondary mb-4">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant={viewMode === 'list' ? 'large' : 'medium'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseExplorer