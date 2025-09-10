import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card } from '../../components/ui'
import { CourseCard } from '../../components/course'
import { LeadCaptureForm } from '../../components/forms'
import apiClient from '../../api/client'

const HomePage = () => {
  const navigate = useNavigate()
  const { selectedArea, isAuthenticated } = useAuthStore()
  const { showError } = useUIStore()
  
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [areas, setAreas] = useState([])
  const [stats, setStats] = useState({
    students: 5000,
    courses: 50,
    certificates: 2000,
    satisfaction: 98
  })
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [testimonials] = useState([
    {
      id: 1,
      name: "María García",
      role: "Desarrolladora Full Stack",
      content: "Los cursos de MetSel Academy transformaron mi carrera. Pasé de ser junior a senior en solo 1 año.",
      avatar: "MG",
      rating: 5
    },
    {
      id: 2,
      name: "Carlos López",
      role: "Data Scientist",
      content: "La calidad del contenido y el soporte de los instructores es excepcional. 100% recomendado.",
      avatar: "CL",
      rating: 5
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "UX Designer",
      content: "Aprendí más en 3 meses que en 2 años de universidad. Los proyectos prácticos marcan la diferencia.",
      avatar: "AM",
      rating: 5
    }
  ])

  useEffect(() => {
    loadHomeData()
  }, [selectedArea])

  const loadHomeData = async () => {
    try {
      const [coursesData, areasData] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/areas')
      ])
      
      // Filtrar cursos destacados
      const featured = selectedArea 
        ? coursesData.filter(c => c.area === selectedArea && c.featured).slice(0, 3)
        : coursesData.filter(c => c.featured).slice(0, 3)
      
      setFeaturedCourses(featured)
      setAreas(areasData)
    } catch (error) {
      console.error('Error loading home data:', error)
      showError('Error al cargar los datos')
    }
  }

  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const handleExploreArea = (areaSlug) => {
    navigate(`/courses?area=${areaSlug}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-surface to-background py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Aprende las habilidades del
            <span className="gradient-text"> futuro</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Cursos online de programación, diseño, marketing y más. 
            Aprende de expertos de la industria y transforma tu carrera profesional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="large"
              onClick={handleStartLearning}
              className="px-8 py-4 text-lg"
            >
              Comienza Ahora
            </Button>
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => navigate('/exam')}
              className="px-8 py-4 text-lg"
            >
              Hacer Test y Ganar Descuento
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{stats.students.toLocaleString()}+</div>
              <div className="text-text-secondary">Estudiantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{stats.courses}+</div>
              <div className="text-text-secondary">Cursos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{stats.certificates.toLocaleString()}+</div>
              <div className="text-text-secondary">Certificados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{stats.satisfaction}%</div>
              <div className="text-text-secondary">Satisfacción</div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Cursos Destacados
              </h2>
              <p className="text-text-secondary">
                Los cursos más populares elegidos por nuestra comunidad
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                variant="secondary"
                onClick={() => navigate('/courses')}
              >
                Ver Todos los Cursos
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Areas Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Explora por Categorías
            </h2>
            <p className="text-text-secondary">
              Encuentra el área perfecta para tu desarrollo profesional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map(area => (
              <Card 
                key={area.id}
                hover
                onClick={() => handleExploreArea(area.slug)}
                className="p-6 cursor-pointer group"
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{area.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {area.courses?.length || 0} cursos
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">
                  {area.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-text-secondary">
              Tu camino hacia el éxito en 4 simples pasos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Elige tu curso</h3>
              <p className="text-sm text-text-secondary">
                Explora nuestro catálogo y encuentra el curso perfecto
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Aprende a tu ritmo</h3>
              <p className="text-sm text-text-secondary">
                Accede al contenido 24/7 desde cualquier dispositivo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Practica con proyectos</h3>
              <p className="text-sm text-text-secondary">
                Aplica lo aprendido en proyectos reales
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">4</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Obtén tu certificado</h3>
              <p className="text-sm text-text-secondary">
                Demuestra tus nuevas habilidades con certificación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-text-secondary">
              Miles de profesionales han transformado sus carreras con nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(testimonial => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-text-secondary italic">"{testimonial.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent/20 to-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            ¿Listo para empezar tu viaje de aprendizaje?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Únete a miles de estudiantes y transforma tu carrera hoy mismo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="large"
              onClick={handleStartLearning}
              className="px-8 py-4 text-lg"
            >
              Crear Cuenta Gratis
            </Button>
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => setShowLeadForm(true)}
              className="px-8 py-4 text-lg"
            >
              Solicitar Información
            </Button>
          </div>
          
          <p className="text-sm text-text-secondary mt-6">
            Sin tarjeta de crédito • Cancela cuando quieras • Garantía de satisfacción
          </p>
        </div>
      </section>

      {/* Lead Capture Form */}
      <LeadCaptureForm 
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        trigger="homepage_cta"
      />
    </div>
  )
}

export default HomePage