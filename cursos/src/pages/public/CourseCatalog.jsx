import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Input } from '../../components/ui'
import { CourseCard } from '../../components/course'
import apiClient from '../../api/client'

const CourseCatalog = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedArea } = useAuthStore()
  const { loading, setLoading, showError } = useUIStore()
  
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [areas, setAreas] = useState([])
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    area: searchParams.get('area') || selectedArea || 'all',
    level: searchParams.get('level') || 'all',
    priceRange: searchParams.get('price') || 'all',
    sortBy: searchParams.get('sort') || 'popular'
  })
  
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
    updateURLParams()
  }, [filters, courses])

  const loadData = async () => {
    setLoading(true)
    try {
      const [coursesData, areasData] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/areas')
      ])
      
      setCourses(coursesData)
      setAreas(areasData)
    } catch (error) {
      console.error('Error loading catalog:', error)
      showError('Error al cargar el catálogo')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...courses]
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower) ||
        course.instructor?.toLowerCase().includes(searchLower)
      )
    }
    
    // Area filter
    if (filters.area !== 'all') {
      filtered = filtered.filter(course => course.area === filters.area)
    }
    
    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level)
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(course => {
        if (max) {
          return course.price >= min && course.price <= max
        } else {
          return course.price >= min
        }
      })
    }
    
    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'popular':
      default:
        filtered.sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
        break
    }
    
    setFilteredCourses(filtered)
  }

  const updateURLParams = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      }
    })
    setSearchParams(params)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      area: 'all',
      level: 'all',
      priceRange: 'all',
      sortBy: 'popular'
    })
  }

  const getLevelLabel = (level) => {
    const labels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado'
    }
    return labels[level] || level
  }

  const getPriceRangeLabel = (range) => {
    const labels = {
      '0-50': 'Menos de $50',
      '50-100': '$50 - $100',
      '100-200': '$100 - $200',
      '200': 'Más de $200'
    }
    return labels[range] || 'Todos'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Catálogo de Cursos
              </h1>
              <p className="text-text-secondary mt-2">
                {filteredCourses.length} cursos disponibles
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? '🔽' : '▶️'} Filtros
              </Button>
              
              <div className="flex bg-surface rounded-lg border border-gray-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-text-secondary'} rounded-l-lg`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-accent text-white' : 'text-text-secondary'} rounded-r-lg`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <Card className="p-4 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-text-primary">Filtros</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-accent hover:underline"
                  >
                    Limpiar
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <Input
                    type="search"
                    placeholder="Buscar cursos..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Area Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Categoría
                  </label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="all">Todas las categorías</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.slug}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nivel
                  </label>
                  <div className="space-y-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="level"
                          value={level}
                          checked={filters.level === level}
                          onChange={(e) => handleFilterChange('level', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-text-primary">
                          {level === 'all' ? 'Todos' : getLevelLabel(level)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Rango de Precio
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="all">Todos los precios</option>
                    <option value="0-50">Menos de $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200">Más de $200</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="popular">Más populares</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="newest">Más recientes</option>
                    <option value="price-low">Precio: Menor a Mayor</option>
                    <option value="price-high">Precio: Mayor a Menor</option>
                  </select>
                </div>
              </Card>
            </aside>
          )}

          {/* Course Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                  <p className="mt-4 text-text-secondary">Cargando cursos...</p>
                </div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No se encontraron cursos
                </h3>
                <p className="text-text-secondary mb-4">
                  Intenta ajustar los filtros o realizar otra búsqueda
                </p>
                <Button onClick={resetFilters}>
                  Limpiar Filtros
                </Button>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map(course => (
                  <Card 
                    key={course.id} 
                    hover 
                    className="p-4 cursor-pointer"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-32 h-20 bg-accent/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {course.icon || '📚'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-text-primary text-lg">
                              {course.title}
                            </h3>
                            <p className="text-sm text-text-secondary mt-1">
                              Por {course.instructor} • {course.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-accent">
                              ${course.price}
                            </div>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <div className="text-sm text-text-secondary line-through">
                                ${course.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-text-secondary mt-2 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-yellow-400">
                            ⭐ {course.rating || '4.5'}
                          </span>
                          <span className="text-text-secondary text-sm">
                            {course.students || '0'} estudiantes
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {getLevelLabel(course.level)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCatalog