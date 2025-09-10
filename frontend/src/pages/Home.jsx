import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useCourseStore, useProgressStore } from '../store'
import { CourseCard, LoadingSpinner, CourseCardSkeleton } from '../components/common'
import { apiService } from '../services/api'
import { eventService } from '../services/eventService'

const Home = () => {
  const navigate = useNavigate()
  const { selectedArea, isAuthenticated } = useAuthStore()
  const { courses, setCourses } = useCourseStore()
  const { courseProgress } = useProgressStore()
  const [loading, setLoading] = useState(true)
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [continueLearning, setContineLearning] = useState([])
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)

  const areaNames = {
    metalurgia: 'Metalurgia',
    mineria: 'Minería', 
    geologia: 'Geología'
  }

  const areaColors = {
    metalurgia: 'text-primary-metalurgia',
    mineria: 'text-primary-mineria',
    geologia: 'text-primary-geologia'
  }

  useEffect(() => {
    if (!selectedArea) {
      navigate('/area-selection')
      return
    }
    loadHomeData()
    
    // Verificar eventos relevantes basados en el historial del usuario
    setTimeout(() => {
      const interests = eventService.getUserInterests()
      if (interests.interestScore[selectedArea] > 0) {
        eventService.checkRelevantEvents()
      }
    }, 5000) // Esperar 5 segundos después de cargar
  }, [selectedArea])

  useEffect(() => {
    // Auto-rotación del carrusel
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => 
        (prev + 1) % featuredCourses.length
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredCourses.length])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      
      // Cargar cursos del área seleccionada
      const allCourses = await apiService.getCourses(selectedArea)
      setCourses(allCourses)
      
      // Asegurar que los cursos dinámicos estén incluidos
      useCourseStore.getState().initializeDynamicCourses()
      
      // Filtrar cursos destacados
      const featured = allCourses.filter(course => course.featured)
      setFeaturedCourses(featured)
      
      // Cursos recomendados (populares y nuevos)
      const recommended = allCourses.filter(course => 
        course.popular || course.isNew
      ).slice(0, 6)
      setRecommendedCourses(recommended)
      
      // Cursos para continuar (solo si está autenticado)
      if (isAuthenticated) {
        const inProgress = allCourses.filter(course => {
          const progress = courseProgress[course.id]
          return progress && progress.percentage > 0 && progress.percentage < 100
        }).slice(0, 4)
        setContineLearning(inProgress)
      }
      
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCarouselNavigation = (direction) => {
    if (direction === 'prev') {
      setCurrentFeaturedIndex(prev => 
        prev === 0 ? featuredCourses.length - 1 : prev - 1
      )
    } else {
      setCurrentFeaturedIndex(prev => 
        (prev + 1) % featuredCourses.length
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Skeleton */}
          <div className="h-64 bg-surface rounded-xl mb-8 animate-pulse"></div>
          
          {/* Cards Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
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
        
        {/* Header de bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Escuela de{' '}
            <span className={`${areaColors[selectedArea]}`}>
              {areaNames[selectedArea]}
            </span>
          </h1>
          <p className="text-text-secondary text-lg">
            Desarrolla tu carrera profesional en {areaNames[selectedArea].toLowerCase()} con cursos especializados
          </p>
        </div>

        {/* Carrusel de cursos destacados */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <div className="relative bg-gradient-to-r from-surface to-background rounded-2xl overflow-hidden">
              <div className="md:flex items-center">
                {/* Contenido del curso */}
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-accent text-background text-xs font-bold px-3 py-1 rounded-full">
                        DESTACADO
                      </span>
                      {featuredCourses[currentFeaturedIndex].isNew && (
                        <span className="bg-primary-metalurgia text-white text-xs font-bold px-3 py-1 rounded-full">
                          NUEVO
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {featuredCourses[currentFeaturedIndex].title}
                    </h2>
                    
                    <p className="text-text-secondary mb-6">
                      {featuredCourses[currentFeaturedIndex].description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        <span className="text-white font-medium">
                          {featuredCourses[currentFeaturedIndex].rating}
                        </span>
                      </div>
                      <span className="text-text-secondary">
                        {featuredCourses[currentFeaturedIndex].students?.toLocaleString()} estudiantes
                      </span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => navigate(`/course/${featuredCourses[currentFeaturedIndex].id}`)}
                        className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                      >
                        Ver curso
                      </button>
                      {featuredCourses[currentFeaturedIndex].isDemo && (
                        <button className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-background transition-colors">
                          Vista previa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Imagen del curso */}
                <div className="md:w-1/2">
                  <img
                    src={featuredCourses[currentFeaturedIndex].thumbnail}
                    alt={featuredCourses[currentFeaturedIndex].title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              </div>
              
              {/* Controles del carrusel */}
              {featuredCourses.length > 1 && (
                <>
                  <button
                    onClick={() => handleCarouselNavigation('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleCarouselNavigation('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Indicadores */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {featuredCourses.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeaturedIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentFeaturedIndex ? 'bg-accent' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Continúa aprendiendo */}
        {continueLearning.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Continúa aprendiendo</h2>
              <button
                onClick={() => navigate('/my-courses')}
                className="text-accent hover:text-accent-light transition-colors"
              >
                Ver todos
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {continueLearning.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="small"
                  showProgress={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cursos recomendados */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Cursos recomendados para ti</h2>
            <button
              onClick={() => navigate('/courses')}
              className="text-accent hover:text-accent-light transition-colors"
            >
              Ver todos
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Sección de rutas de aprendizaje */}
        <div className="bg-surface rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Listo para una ruta completa de aprendizaje?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Sigue una ruta estructurada de cursos que te llevarán desde principiante hasta experto en {areaNames[selectedArea].toLowerCase()}
          </p>
          <button
            onClick={() => navigate('/learning-paths')}
            className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Explorar rutas de aprendizaje
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home