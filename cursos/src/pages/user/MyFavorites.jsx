import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Input } from '../../components/ui'
import { CourseCard } from '../../components/course'
import apiClient from '../../api/client'

const MyFavorites = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [favorites, setFavorites] = useState([])
  const [filteredFavorites, setFilteredFavorites] = useState([])
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterArea, setFilterArea] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [areas, setAreas] = useState([])
  
  useEffect(() => {
    loadFavorites()
  }, [])
  
  useEffect(() => {
    filterAndSortFavorites()
  }, [favorites, searchTerm, filterArea, sortBy])
  
  const loadFavorites = async () => {
    setLoading(true)
    try {
      const [coursesData, areasData] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/areas')
      ])
      
      // Simulated favorite course IDs
      const favoriteIds = ['1', '3', '5', '7', '9']
      
      // Get favorite courses
      const favoriteCourses = coursesData.filter(course => 
        favoriteIds.includes(course.id)
      ).map(course => ({
        ...course,
        addedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        priceAlert: Math.random() > 0.7, // 30% have price alerts
        lastViewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
      }))
      
      setCourses(coursesData)
      setFavorites(favoriteCourses)
      setAreas(areasData)
    } catch (error) {
      console.error('Error loading favorites:', error)
      showError('Error al cargar tus favoritos')
    } finally {
      setLoading(false)
    }
  }
  
  const filterAndSortFavorites = () => {
    let filtered = [...favorites]
    
    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(search) ||
        course.instructor?.toLowerCase().includes(search)
      )
    }
    
    // Filter by area
    if (filterArea !== 'all') {
      filtered = filtered.filter(course => course.area === filterArea)
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.addedDate) - new Date(a.addedDate)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'title':
          return a.title.localeCompare(b.title)
        case 'discount':
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice * 100) : 0
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice * 100) : 0
          return discountB - discountA
        default:
          return 0
      }
    })
    
    setFilteredFavorites(filtered)
  }
  
  const handleRemoveFavorite = async (courseId) => {
    if (window.confirm('¿Estás seguro de eliminar este curso de favoritos?')) {
      try {
        setFavorites(favorites.filter(c => c.id !== courseId))
        showSuccess('Curso eliminado de favoritos')
      } catch (error) {
        showError('Error al eliminar de favoritos')
      }
    }
  }
  
  const handleTogglePriceAlert = async (courseId) => {
    try {
      const updatedFavorites = favorites.map(course => 
        course.id === courseId 
          ? { ...course, priceAlert: !course.priceAlert }
          : course
      )
      setFavorites(updatedFavorites)
      
      const course = favorites.find(c => c.id === courseId)
      showSuccess(
        course.priceAlert 
          ? 'Alerta de precio desactivada' 
          : '¡Te notificaremos cuando baje el precio!'
      )
    } catch (error) {
      showError('Error al actualizar alerta de precio')
    }
  }
  
  const handleEnrollAll = () => {
    const totalPrice = filteredFavorites.reduce((sum, course) => sum + course.price, 0)
    const discount = totalPrice * 0.15 // 15% discount for bulk purchase
    const finalPrice = totalPrice - discount
    
    if (window.confirm(`¿Inscribirte en ${filteredFavorites.length} cursos por $${finalPrice.toFixed(2)}? (Ahorro: $${discount.toFixed(2)})`)) {
      showSuccess('¡Te has inscrito en todos los cursos!')
      navigate('/my-courses')
    }
  }
  
  const handleShareList = () => {
    const shareText = `Mi lista de cursos favoritos:\n${filteredFavorites.map(c => `• ${c.title}`).join('\n')}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi lista de cursos favoritos',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      showSuccess('Lista copiada al portapapeles')
    }
  }
  
  const calculateTotalSavings = () => {
    return filteredFavorites.reduce((total, course) => {
      if (course.originalPrice && course.originalPrice > course.price) {
        return total + (course.originalPrice - course.price)
      }
      return total
    }, 0)
  }
  
  const stats = {
    total: favorites.length,
    withDiscount: favorites.filter(c => c.originalPrice && c.originalPrice > c.price).length,
    totalPrice: favorites.reduce((sum, c) => sum + c.price, 0),
    totalSavings: calculateTotalSavings(),
    withAlerts: favorites.filter(c => c.priceAlert).length
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Mis Favoritos ❤️
            </h1>
            <p className="text-text-secondary mt-2">
              Cursos que has guardado para ver más tarde
            </p>
          </div>
          
          {favorites.length > 0 && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleShareList}>
                Compartir Lista
              </Button>
              <Button onClick={handleEnrollAll}>
                Inscribirse en Todos
              </Button>
            </div>
          )}
        </div>
        
        {/* Stats */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-surface/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-sm text-text-secondary">Cursos guardados</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-400">{stats.withDiscount}</p>
              <p className="text-sm text-text-secondary">Con descuento</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-accent">${stats.totalPrice.toFixed(2)}</p>
              <p className="text-sm text-text-secondary">Valor total</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-yellow-400">${stats.totalSavings.toFixed(2)}</p>
              <p className="text-sm text-text-secondary">Ahorro potencial</p>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-purple-400">{stats.withAlerts}</p>
              <p className="text-sm text-text-secondary">Alertas activas</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Filters */}
      {favorites.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="search"
              placeholder="Buscar en favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todas las áreas</option>
              {areas.map(area => (
                <option key={area.id} value={area.slug}>{area.name}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="recent">Más recientes</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="discount">Mayor descuento</option>
              <option value="title">Por título</option>
            </select>
          </div>
        </Card>
      )}
      
      {/* Favorites Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando favoritos...</p>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {searchTerm ? 'No se encontraron cursos' : 'No tienes cursos favoritos'}
          </h3>
          <p className="text-text-secondary mb-4">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda'
              : 'Explora nuestro catálogo y guarda los cursos que te interesen'}
          </p>
          <Button onClick={() => navigate('/courses')}>
            Explorar Cursos
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map(course => (
            <div key={course.id} className="relative">
              <CourseCard course={course} />
              
              {/* Overlay Actions */}
              <div className="absolute top-3 right-3 flex gap-2">
                {/* Price Alert */}
                <button
                  onClick={() => handleTogglePriceAlert(course.id)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                    course.priceAlert 
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title={course.priceAlert ? 'Alerta activa' : 'Activar alerta de precio'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                
                {/* Remove from Favorites */}
                <button
                  onClick={() => handleRemoveFavorite(course.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 backdrop-blur-sm transition-all"
                  title="Eliminar de favoritos"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
              
              {/* Added Date Badge */}
              <div className="absolute bottom-20 left-4">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  Agregado hace {Math.floor((Date.now() - course.addedDate) / (1000 * 60 * 60 * 24))} días
                </span>
              </div>
              
              {/* Price Alert Indicator */}
              {course.priceAlert && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2">
                    <p className="text-xs text-yellow-400 text-center">
                      🔔 Te notificaremos cuando baje el precio
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Recommendations */}
      {favorites.length > 0 && favorites.length < 5 && (
        <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                💡 Sigue explorando
              </h3>
              <p className="text-text-secondary">
                Basado en tus favoritos, te podrían interesar estos cursos
              </p>
            </div>
            <Button onClick={() => navigate('/courses')}>
              Ver más cursos
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default MyFavorites