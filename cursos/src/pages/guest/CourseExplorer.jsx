import React, { useState, useEffect } from 'react'
import { useConfigStore, useAuthStore, useUIStore } from '../../store'
import { CourseCard } from '../../components/features/courses'
import { Button } from '../../components/ui'
import apiClient from '../../api/client'

const CourseExplorer = () => {
  const { areas } = useConfigStore()
  const { selectedArea } = useAuthStore()
  const { showError } = useUIStore()
  
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    area: null,
    level: null,
    duration: null,
    search: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchQuery }))
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const loadCourses = async () => {
    try {
      const coursesData = await apiClient.get('/courses')
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
      showError('Error al cargar los cursos')
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesArea = !filters.area || course.area === filters.area
    const matchesLevel = !filters.level || course.level === filters.level
    const matchesDuration = !filters.duration || course.duration === filters.duration
    const matchesSearch = !filters.search || 
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesArea && matchesLevel && matchesDuration && matchesSearch
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      area: null,
      level: null,
      duration: null,
      search: ''
    })
    setSearchQuery('')
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== null && value !== ''
  ).length

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-12 bg-surface rounded-lg mb-8 animate-pulse"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-surface rounded-xl p-6 animate-pulse">
              <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Explorar Cursos</h1>
          <p className="text-text-secondary">
            Descubre {filteredCourses.length} cursos disponibles
            {selectedArea && ` en ${selectedArea}`}
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-accent text-black' 
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-accent text-black' 
                : 'bg-surface text-text-secondary hover:text-text-primary'
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
            <svg className="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-surface text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            placeholder="Buscar cursos, instructores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface rounded-xl p-6 mb-8 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Filtros</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-accent hover:text-accent/80 transition-colors text-sm"
            >
              Limpiar filtros ({activeFiltersCount})
            </button>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Área</label>
            <div className="space-y-2">
              {areas.filter(area => area.isActive).map(area => (
                <button
                  key={area.slug}
                  onClick={() => handleFilterChange('area', area.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                    filters.area === area.slug
                      ? 'bg-accent text-black'
                      : 'bg-background text-text-primary hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  <span>{area.icon}</span>
                  <span>{area.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nivel */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Nivel</label>
            <div className="space-y-2">
              {['básico', 'intermedio', 'avanzado'].map(level => (
                <button
                  key={level}
                  onClick={() => handleFilterChange('level', level)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.level === level
                      ? 'bg-accent text-black'
                      : 'bg-background text-text-primary hover:bg-gray-700 border border-gray-600'
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
                      ? 'bg-accent text-black'
                      : 'bg-background text-text-primary hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  {duration.label}
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
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No se encontraron cursos
          </h3>
          <p className="text-text-secondary mb-4">
            Intenta ajustar tus filtros o términos de búsqueda
          </p>
          <Button onClick={clearAllFilters}>
            Limpiar filtros
          </Button>
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
              variant={viewMode === 'list' ? 'large' : 'default'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseExplorer