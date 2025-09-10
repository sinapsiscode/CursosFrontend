import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card } from '../../components/ui'
import apiClient from '../../api/client'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showError } = useUIStore()
  
  const [stats, setStats] = useState({
    coursesInProgress: 3,
    coursesCompleted: 5,
    certificatesEarned: 5,
    totalHoursLearned: 120,
    currentStreak: 7,
    points: user?.points || 0
  })
  
  const [recentCourses, setRecentCourses] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Primera Clase', icon: '🎯', earned: true, description: 'Completa tu primera clase' },
    { id: 2, title: 'Racha de 7 días', icon: '🔥', earned: true, description: 'Estudia 7 días seguidos' },
    { id: 3, title: 'Certificado Pro', icon: '🏆', earned: true, description: 'Obtén tu primer certificado' },
    { id: 4, title: 'Super Estudiante', icon: '⭐', earned: false, description: 'Completa 10 cursos' }
  ])
  
  const [upcomingEvents] = useState([
    { id: 1, title: 'Workshop: React Avanzado', date: '2024-12-20', time: '18:00', type: 'online' },
    { id: 2, title: 'Meetup: Desarrollo Mobile', date: '2024-12-22', time: '19:00', type: 'presencial' }
  ])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const courses = await apiClient.get('/courses')
      
      // Simular cursos recientes y recomendaciones
      setRecentCourses(courses.slice(0, 3))
      setRecommendations(courses.slice(3, 6))
    } catch (error) {
      console.error('Error loading dashboard:', error)
      showError('Error al cargar el dashboard')
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getMotivationalMessage = () => {
    const messages = [
      '¡Sigue así! Tu progreso es increíble 🚀',
      'Cada día te acercas más a tus metas 💪',
      'El conocimiento es poder, sigue aprendiendo 📚',
      '¡Excelente racha de estudio! Mantén el ritmo 🔥'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {getGreeting()}, {user?.name || 'Estudiante'}! 👋
        </h1>
        <p className="text-text-secondary mb-4">
          {getMotivationalMessage()}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate('/courses')}>
            Explorar Cursos
          </Button>
          <Button variant="secondary" onClick={() => navigate('/my-courses')}>
            Continuar Aprendiendo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-accent">{stats.coursesInProgress}</div>
          <div className="text-sm text-text-secondary mt-1">En Progreso</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.coursesCompleted}</div>
          <div className="text-sm text-text-secondary mt-1">Completados</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.certificatesEarned}</div>
          <div className="text-sm text-text-secondary mt-1">Certificados</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.totalHoursLearned}</div>
          <div className="text-sm text-text-secondary mt-1">Horas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.currentStreak}🔥</div>
          <div className="text-sm text-text-secondary mt-1">Racha</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{stats.points}</div>
          <div className="text-sm text-text-secondary mt-1">Puntos</div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          {recentCourses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  Continuar Aprendiendo
                </h2>
                <Button variant="link" onClick={() => navigate('/my-courses')}>
                  Ver todos →
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentCourses.slice(0, 2).map(course => (
                  <Card key={course.id} className="p-4">
                    <h3 className="font-semibold text-text-primary mb-2">{course.title}</h3>
                    <p className="text-sm text-text-secondary mb-3">{course.instructor}</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-text-secondary mb-1">
                        <span>Progreso</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>
                    <Button 
                      size="small" 
                      className="w-full"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      Continuar
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  Recomendado para ti
                </h2>
                <Button variant="link" onClick={() => navigate('/courses')}>
                  Ver más →
                </Button>
              </div>
              <div className="space-y-4">
                {recommendations.slice(0, 2).map(course => (
                  <Card key={course.id} hover className="p-4 cursor-pointer" 
                    onClick={() => navigate(`/courses/${course.id}`)}>
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-accent/20 rounded-lg flex items-center justify-center text-2xl">
                        {course.icon || '📚'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">{course.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{course.instructor}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="text-yellow-400">⭐ {course.rating}</span>
                          <span className="text-text-secondary mx-2">•</span>
                          <span className="text-text-secondary">{course.duration}</span>
                          <span className="text-text-secondary mx-2">•</span>
                          <span className="text-accent font-semibold">${course.price}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card className="p-4">
            <h3 className="font-semibold text-text-primary mb-4">Logros Recientes</h3>
            <div className="space-y-3">
              {achievements.filter(a => a.earned).slice(0, 3).map(achievement => (
                <div key={achievement.id} className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{achievement.title}</p>
                    <p className="text-xs text-text-secondary">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="link" 
              size="small" 
              className="mt-3"
              onClick={() => navigate('/achievements')}
            >
              Ver todos los logros →
            </Button>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-4">
            <h3 className="font-semibold text-text-primary mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border-l-2 border-accent pl-3">
                  <p className="text-sm font-medium text-text-primary">{event.title}</p>
                  <p className="text-xs text-text-secondary">
                    {event.date} • {event.time} • {event.type}
                  </p>
                </div>
              ))}
            </div>
            <Button 
              variant="link" 
              size="small" 
              className="mt-3"
              onClick={() => navigate('/events')}
            >
              Ver calendario →
            </Button>
          </Card>

          {/* Study Streak */}
          <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <div className="text-center">
              <div className="text-5xl mb-2">🔥</div>
              <h3 className="font-semibold text-text-primary">¡{stats.currentStreak} días de racha!</h3>
              <p className="text-sm text-text-secondary mt-1">
                Sigue estudiando para mantener tu racha
              </p>
              <div className="flex justify-center mt-3 space-x-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-8 h-8 rounded ${
                      i < stats.currentStreak ? 'bg-orange-400' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-text-primary mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                size="small" 
                className="w-full justify-start"
                onClick={() => navigate('/certificates')}
              >
                📜 Mis Certificados
              </Button>
              <Button 
                variant="secondary" 
                size="small" 
                className="w-full justify-start"
                onClick={() => navigate('/loyalty')}
              >
                💎 Programa de Puntos
              </Button>
              <Button 
                variant="secondary" 
                size="small" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                👤 Mi Perfil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard