import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Input } from '../../components/ui'
import apiClient from '../../api/client'

const MyCourses = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showError, loading, setLoading } = useUIStore()
  
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  
  // Simulated enrolled courses data
  const [enrolledCourses] = useState([
    { id: '1', status: 'in-progress', progress: 65, lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '2', status: 'in-progress', progress: 30, lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: '3', status: 'completed', progress: 100, completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: '4', status: 'not-started', progress: 0, enrolledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: '5', status: 'completed', progress: 100, completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  ])

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterAndSortCourses()
  }, [courses, activeTab, searchTerm, sortBy])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const allCourses = await apiClient.get('/courses')
      
      // Merge course data with enrollment data
      const myCoursesData = allCourses
        .filter(course => enrolledCourses.some(ec => ec.id === course.id))
        .map(course => {
          const enrollment = enrolledCourses.find(ec => ec.id === course.id)
          return {
            ...course,
            ...enrollment,
            certificateAvailable: enrollment.status === 'completed'
          }
        })
      
      setCourses(myCoursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
      showError('Error al cargar tus cursos')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCourses = () => {
    let filtered = [...courses]
    
    // Filter by tab
    if (activeTab === 'in-progress') {
      filtered = filtered.filter(c => c.status === 'in-progress')
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(c => c.status === 'completed')
    } else if (activeTab === 'not-started') {
      filtered = filtered.filter(c => c.status === 'not-started')
    }
    
    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search) ||
        c.instructor?.toLowerCase().includes(search)
      )
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return (b.lastAccessed || b.enrolledAt || 0) - (a.lastAccessed || a.enrolledAt || 0)
        case 'progress':
          return b.progress - a.progress
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
    
    setFilteredCourses(filtered)
  }

  const handleContinueCourse = (courseId) => {
    navigate(`/course/${courseId}/learn`)
  }

  const handleViewCertificate = (courseId) => {
    navigate(`/certificates/${courseId}`)
  }

  const getStatusBadge = (status) => {
    const badges = {
      'in-progress': { text: 'En Progreso', class: 'bg-blue-500/20 text-blue-400' },
      'completed': { text: 'Completado', class: 'bg-green-500/20 text-green-400' },
      'not-started': { text: 'No Iniciado', class: 'bg-gray-500/20 text-gray-400' }
    }
    return badges[status] || badges['not-started']
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const formatDate = (date) => {
    if (!date) return ''
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} días`
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`
    return `Hace ${Math.floor(days / 30)} meses`
  }

  const stats = {
    total: courses.length,
    inProgress: courses.filter(c => c.status === 'in-progress').length,
    completed: courses.filter(c => c.status === 'completed').length,
    certificates: courses.filter(c => c.certificateAvailable).length,
    totalHours: courses.reduce((acc, c) => acc + (parseInt(c.duration) || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Mis Cursos
        </h1>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-sm text-text-secondary">Total Cursos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
            <p className="text-sm text-text-secondary">En Progreso</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-sm text-text-secondary">Completados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">{stats.certificates}</p>
            <p className="text-sm text-text-secondary">Certificados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{stats.totalHours}h</p>
            <p className="text-sm text-text-secondary">Total Horas</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1">
          {[
            { id: 'all', label: 'Todos', count: stats.total },
            { id: 'in-progress', label: 'En Progreso', count: stats.inProgress },
            { id: 'completed', label: 'Completados', count: stats.completed },
            { id: 'not-started', label: 'No Iniciados', count: courses.filter(c => c.status === 'not-started').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex gap-3">
          <Input
            type="search"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="recent">Más reciente</option>
            <option value="progress">Por progreso</option>
            <option value="title">Por título</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando cursos...</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {searchTerm ? 'No se encontraron cursos' : 'No tienes cursos en esta categoría'}
          </h3>
          <p className="text-text-secondary mb-4">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda' 
              : activeTab === 'all' 
                ? 'Explora nuestro catálogo y comienza tu aprendizaje'
                : 'No tienes cursos ' + (
                    activeTab === 'in-progress' ? 'en progreso' :
                    activeTab === 'completed' ? 'completados' :
                    'sin iniciar'
                  )
            }
          </p>
          {activeTab === 'all' && (
            <Button onClick={() => navigate('/courses')}>
              Explorar Cursos
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative">
                <span className="text-6xl opacity-50">{course.icon || '📚'}</span>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(course.status).class}`}>
                    {getStatusBadge(course.status).text}
                  </span>
                </div>
                
                {/* Progress Overlay */}
                {course.status === 'in-progress' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="flex items-center justify-between text-xs text-white mb-1">
                      <span>Progreso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-1 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  Por {course.instructor}
                </p>
                
                <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>
                
                {/* Last Activity */}
                <p className="text-xs text-text-secondary mb-4">
                  {course.status === 'completed' 
                    ? `Completado ${formatDate(course.completedAt)}`
                    : course.status === 'in-progress'
                    ? `Último acceso ${formatDate(course.lastAccessed)}`
                    : `Inscrito ${formatDate(course.enrolledAt)}`
                  }
                </p>
                
                {/* Actions */}
                <div className="flex gap-2">
                  {course.status === 'completed' ? (
                    <>
                      <Button 
                        size="small" 
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleContinueCourse(course.id)}
                      >
                        Repasar
                      </Button>
                      <Button 
                        size="small"
                        className="flex-1"
                        onClick={() => handleViewCertificate(course.id)}
                      >
                        Certificado
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="small"
                      className="w-full"
                      onClick={() => handleContinueCourse(course.id)}
                    >
                      {course.status === 'not-started' ? 'Comenzar' : 'Continuar'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Learning Path Suggestion */}
      {stats.completed > 0 && (
        <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                🎯 Continúa tu camino de aprendizaje
              </h3>
              <p className="text-text-secondary">
                Basado en tus cursos completados, te recomendamos estos cursos avanzados
              </p>
            </div>
            <Button onClick={() => navigate('/courses')}>
              Ver Recomendaciones
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default MyCourses