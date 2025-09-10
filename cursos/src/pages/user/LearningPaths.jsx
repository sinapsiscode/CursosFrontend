import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Modal } from '../../components/ui'
import apiClient from '../../api/client'

const LearningPaths = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [paths, setPaths] = useState([])
  const [enrolledPaths, setEnrolledPaths] = useState([])
  const [selectedPath, setSelectedPath] = useState(null)
  const [showPathModal, setShowPathModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [userProgress, setUserProgress] = useState({})
  
  useEffect(() => {
    loadLearningPaths()
  }, [])
  
  const loadLearningPaths = async () => {
    setLoading(true)
    try {
      // Simulated learning paths data
      const pathsData = [
        {
          id: '1',
          title: 'Full Stack Developer',
          description: 'Conviértete en un desarrollador Full Stack completo con React y Node.js',
          level: 'intermediate',
          duration: '6 meses',
          courses: [
            { id: '1', title: 'HTML y CSS Fundamentals', completed: true, hours: 20 },
            { id: '2', title: 'JavaScript Moderno', completed: true, hours: 30 },
            { id: '3', title: 'React desde Cero', completed: true, hours: 40 },
            { id: '4', title: 'React Avanzado', inProgress: true, hours: 35 },
            { id: '5', title: 'Node.js Backend', locked: true, hours: 45 },
            { id: '6', title: 'MongoDB y Bases de Datos', locked: true, hours: 25 },
            { id: '7', title: 'Proyecto Final Full Stack', locked: true, hours: 60 }
          ],
          totalCourses: 7,
          completedCourses: 3,
          progress: 43,
          category: 'development',
          skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
          certificate: true,
          price: 299,
          originalPrice: 499,
          enrolled: true,
          rating: 4.8,
          students: 2341,
          benefits: [
            'Certificado profesional',
            'Proyectos reales',
            'Mentoría personalizada',
            'Acceso de por vida'
          ]
        },
        {
          id: '2',
          title: 'Data Science Master',
          description: 'Domina el análisis de datos y machine learning con Python',
          level: 'advanced',
          duration: '8 meses',
          courses: [
            { id: '8', title: 'Python para Data Science', completed: false, hours: 30 },
            { id: '9', title: 'Estadística y Probabilidad', completed: false, hours: 25 },
            { id: '10', title: 'Pandas y NumPy', locked: true, hours: 35 },
            { id: '11', title: 'Machine Learning Fundamentals', locked: true, hours: 50 },
            { id: '12', title: 'Deep Learning con TensorFlow', locked: true, hours: 60 },
            { id: '13', title: 'Proyectos de ML en Producción', locked: true, hours: 40 }
          ],
          totalCourses: 6,
          completedCourses: 0,
          progress: 0,
          category: 'data-science',
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'SQL'],
          certificate: true,
          price: 399,
          originalPrice: 699,
          enrolled: false,
          rating: 4.9,
          students: 1856,
          benefits: [
            'Datasets reales',
            'Competencias Kaggle',
            'Portfolio de proyectos',
            'Certificación reconocida'
          ]
        },
        {
          id: '3',
          title: 'Mobile Developer Path',
          description: 'Crea aplicaciones móviles con React Native',
          level: 'intermediate',
          duration: '4 meses',
          courses: [
            { id: '14', title: 'React Native Basics', completed: true, hours: 30 },
            { id: '15', title: 'Navegación y Routing', completed: false, hours: 20 },
            { id: '16', title: 'Estado Global y Redux', locked: true, hours: 25 },
            { id: '17', title: 'APIs y Backend Integration', locked: true, hours: 30 },
            { id: '18', title: 'Publicación en App Stores', locked: true, hours: 15 }
          ],
          totalCourses: 5,
          completedCourses: 1,
          progress: 20,
          category: 'mobile',
          skills: ['React Native', 'Redux', 'JavaScript', 'iOS', 'Android'],
          certificate: true,
          price: 199,
          originalPrice: 349,
          enrolled: true,
          rating: 4.7,
          students: 987,
          benefits: [
            'Apps para iOS y Android',
            'Publicación en tiendas',
            'Código reutilizable',
            'Soporte continuo'
          ]
        },
        {
          id: '4',
          title: 'DevOps Engineer',
          description: 'Automatiza y optimiza el ciclo de desarrollo de software',
          level: 'advanced',
          duration: '5 meses',
          courses: [
            { id: '19', title: 'Linux y Línea de Comandos', completed: false, hours: 20 },
            { id: '20', title: 'Docker Containerization', completed: false, hours: 30 },
            { id: '21', title: 'Kubernetes Orchestration', locked: true, hours: 40 },
            { id: '22', title: 'CI/CD con Jenkins', locked: true, hours: 35 },
            { id: '23', title: 'AWS Cloud Services', locked: true, hours: 50 },
            { id: '24', title: 'Monitoring y Logging', locked: true, hours: 25 }
          ],
          totalCourses: 6,
          completedCourses: 0,
          progress: 0,
          category: 'devops',
          skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
          certificate: true,
          price: 349,
          originalPrice: 599,
          enrolled: false,
          rating: 4.8,
          students: 765,
          benefits: [
            'Certificación AWS prep',
            'Laboratorios en la nube',
            'Herramientas enterprise',
            'Casos de uso reales'
          ]
        },
        {
          id: '5',
          title: 'UX/UI Designer Pro',
          description: 'Diseña experiencias digitales excepcionales',
          level: 'beginner',
          duration: '3 meses',
          courses: [
            { id: '25', title: 'Fundamentos de UX', completed: false, hours: 20 },
            { id: '26', title: 'UI Design con Figma', completed: false, hours: 30 },
            { id: '27', title: 'Design Systems', locked: true, hours: 25 },
            { id: '28', title: 'Prototipado Interactivo', locked: true, hours: 20 },
            { id: '29', title: 'Portfolio y Caso de Estudio', locked: true, hours: 15 }
          ],
          totalCourses: 5,
          completedCourses: 0,
          progress: 0,
          category: 'design',
          skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing'],
          certificate: true,
          price: 179,
          originalPrice: 299,
          enrolled: false,
          rating: 4.6,
          students: 1234,
          benefits: [
            'Portfolio profesional',
            'Recursos de diseño',
            'Feedback de expertos',
            'Comunidad activa'
          ]
        }
      ]
      
      setPaths(pathsData)
      setEnrolledPaths(['1', '3']) // Simulated enrolled paths
      
      // Simulated user progress
      setUserProgress({
        '1': { currentCourse: 4, nextMilestone: 'Node.js Backend' },
        '3': { currentCourse: 2, nextMilestone: 'Estado Global y Redux' }
      })
      
    } catch (error) {
      console.error('Error loading paths:', error)
      showError('Error al cargar las rutas de aprendizaje')
    } finally {
      setLoading(false)
    }
  }
  
  const handleEnrollPath = (path) => {
    if (!isAuthenticated) {
      showError('Debes iniciar sesión para inscribirte')
      navigate('/login')
      return
    }
    
    setSelectedPath(path)
    setShowPathModal(true)
  }
  
  const confirmEnrollment = () => {
    if (selectedPath) {
      setEnrolledPaths([...enrolledPaths, selectedPath.id])
      showSuccess(`¡Te has inscrito en la ruta ${selectedPath.title}!`)
      setShowPathModal(false)
      
      // Navigate to first course
      const firstCourse = selectedPath.courses[0]
      if (firstCourse) {
        setTimeout(() => {
          navigate(`/course/${firstCourse.id}`)
        }, 1500)
      }
    }
  }
  
  const handleContinuePath = (path) => {
    const progress = userProgress[path.id]
    if (progress && progress.currentCourse) {
      navigate(`/course/${path.courses[progress.currentCourse - 1].id}`)
    }
  }
  
  const calculateDiscount = (path) => {
    if (!path.originalPrice || path.originalPrice <= path.price) return 0
    return Math.round(((path.originalPrice - path.price) / path.originalPrice) * 100)
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      'development': 'from-blue-500 to-purple-500',
      'data-science': 'from-green-500 to-teal-500',
      'mobile': 'from-pink-500 to-rose-500',
      'devops': 'from-orange-500 to-red-500',
      'design': 'from-purple-500 to-pink-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }
  
  const getCategoryIcon = (category) => {
    const icons = {
      'development': '💻',
      'data-science': '📊',
      'mobile': '📱',
      'devops': '⚙️',
      'design': '🎨'
    }
    return icons[category] || '📚'
  }
  
  const getLevelBadge = (level) => {
    const badges = {
      'beginner': { text: 'Principiante', class: 'bg-green-500/20 text-green-400' },
      'intermediate': { text: 'Intermedio', class: 'bg-yellow-500/20 text-yellow-400' },
      'advanced': { text: 'Avanzado', class: 'bg-red-500/20 text-red-400' }
    }
    return badges[level] || badges['beginner']
  }
  
  const filteredPaths = activeTab === 'enrolled' 
    ? paths.filter(p => enrolledPaths.includes(p.id))
    : paths
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Rutas de Aprendizaje
        </h1>
        <p className="text-text-secondary mb-6">
          Sigue un camino estructurado para dominar nuevas habilidades
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-text-primary">{paths.length}</p>
            <p className="text-sm text-text-secondary">Rutas disponibles</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-accent">{enrolledPaths.length}</p>
            <p className="text-sm text-text-secondary">Rutas activas</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">
              {paths.reduce((acc, p) => acc + (enrolledPaths.includes(p.id) ? p.completedCourses : 0), 0)}
            </p>
            <p className="text-sm text-text-secondary">Cursos completados</p>
          </div>
          <div className="bg-surface/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">
              {paths.reduce((acc, p) => acc + p.courses.length, 0)}
            </p>
            <p className="text-sm text-text-secondary">Total de cursos</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Todas las Rutas
        </button>
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'enrolled'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Mis Rutas ({enrolledPaths.length})
        </button>
      </div>
      
      {/* Learning Paths Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando rutas...</p>
          </div>
        </div>
      ) : filteredPaths.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🛤️</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No tienes rutas activas
          </h3>
          <p className="text-text-secondary mb-4">
            Inscríbete en una ruta para comenzar tu aprendizaje estructurado
          </p>
          <Button onClick={() => setActiveTab('all')}>
            Ver Todas las Rutas
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPaths.map(path => {
            const isEnrolled = enrolledPaths.includes(path.id)
            const progress = userProgress[path.id]
            const discount = calculateDiscount(path)
            
            return (
              <Card key={path.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* Path Header */}
                <div className={`h-32 bg-gradient-to-r ${getCategoryColor(path.category)} p-6 relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-4xl">{getCategoryIcon(path.category)}</span>
                        <h3 className="text-xl font-bold text-white mt-2">
                          {path.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelBadge(path.level).class}`}>
                          {getLevelBadge(path.level).text}
                        </span>
                        {isEnrolled && (
                          <div className="mt-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            ✓ Inscrito
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Path Info */}
                <div className="p-6">
                  <p className="text-text-secondary mb-4 line-clamp-2">
                    {path.description}
                  </p>
                  
                  {/* Path Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-text-secondary">Duración</p>
                      <p className="font-semibold text-text-primary">{path.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Cursos</p>
                      <p className="font-semibold text-text-primary">{path.totalCourses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Estudiantes</p>
                      <p className="font-semibold text-text-primary">{path.students}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {isEnrolled && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">Progreso</span>
                        <span className="text-accent font-medium">{path.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      {progress && (
                        <p className="text-xs text-text-secondary mt-2">
                          Próximo: {progress.nextMilestone}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Course List Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-text-primary mb-2">
                      Contenido del Path:
                    </p>
                    <div className="space-y-1">
                      {path.courses.slice(0, 3).map((course, idx) => (
                        <div key={course.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            course.completed 
                              ? 'bg-green-500 text-white' 
                              : course.inProgress
                              ? 'bg-accent text-white'
                              : course.locked
                              ? 'bg-gray-700 text-gray-500'
                              : 'bg-gray-600 text-gray-400'
                          }`}>
                            {course.completed ? '✓' : course.locked ? '🔒' : idx + 1}
                          </span>
                          <span className={`flex-1 ${
                            course.completed 
                              ? 'text-green-400' 
                              : course.inProgress
                              ? 'text-accent'
                              : course.locked
                              ? 'text-gray-500'
                              : 'text-text-secondary'
                          }`}>
                            {course.title}
                          </span>
                          <span className="text-gray-500">{course.hours}h</span>
                        </div>
                      ))}
                      {path.courses.length > 3 && (
                        <p className="text-xs text-text-secondary pl-7">
                          +{path.courses.length - 3} cursos más...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {path.skills.map(skill => (
                      <span 
                        key={skill}
                        className="text-xs px-2 py-1 bg-surface rounded text-text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div>
                      {!isEnrolled && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-accent">
                              ${path.price}
                            </span>
                            {discount > 0 && (
                              <>
                                <span className="text-sm text-text-secondary line-through">
                                  ${path.originalPrice}
                                </span>
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                  -{discount}%
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-sm text-text-secondary">
                              {path.rating} ({path.students} estudiantes)
                            </span>
                          </div>
                        </>
                      )}
                      {isEnrolled && (
                        <div>
                          <p className="text-sm text-text-secondary">
                            {path.completedCourses} de {path.totalCourses} completados
                          </p>
                          {path.certificate && path.progress === 100 && (
                            <span className="text-xs text-green-400">
                              ✓ Certificado disponible
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {isEnrolled ? (
                        <Button 
                          size="small"
                          onClick={() => handleContinuePath(path)}
                        >
                          Continuar →
                        </Button>
                      ) : (
                        <Button 
                          size="small"
                          onClick={() => handleEnrollPath(path)}
                        >
                          Inscribirse
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      
      {/* Enrollment Modal */}
      <Modal
        isOpen={showPathModal}
        onClose={() => setShowPathModal(false)}
        title="Inscripción en Ruta de Aprendizaje"
      >
        {selectedPath && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-5xl">{getCategoryIcon(selectedPath.category)}</span>
              <h3 className="text-xl font-bold text-text-primary mt-4">
                {selectedPath.title}
              </h3>
              <p className="text-text-secondary mt-2">
                {selectedPath.description}
              </p>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-3">
                Lo que obtendrás:
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-text-secondary">
                    {selectedPath.totalCourses} cursos completos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-text-secondary">
                    {selectedPath.courses.reduce((acc, c) => acc + c.hours, 0)} horas de contenido
                  </span>
                </div>
                {selectedPath.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Precio total:</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent">
                    ${selectedPath.price}
                  </p>
                  {selectedPath.originalPrice > selectedPath.price && (
                    <p className="text-sm text-text-secondary line-through">
                      ${selectedPath.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowPathModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmEnrollment}
                className="flex-1"
              >
                Confirmar Inscripción
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default LearningPaths