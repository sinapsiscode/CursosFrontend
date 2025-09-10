import React, { useEffect, useState } from 'react'
import { useConfigStore } from '../../store'
import apiClient from '../../api/client'
import { CourseCard } from '../../components/features/courses'

const Home = () => {
  const { areas, setAreas } = useConfigStore()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasData, coursesData] = await Promise.all([
          apiClient.get('/content/areas'),
          apiClient.get('/content/courses')
        ])
        
        setAreas(areasData)
        setCourses(coursesData.slice(0, 6)) // Solo mostrar 6 cursos destacados
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setAreas])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="bg-surface border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold gradient-text">
            Cursos Platform v2.0
          </h1>
          <p className="text-text-secondary mt-2">
            Conectado a JSON Server - Datos reales funcionando
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-surface p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">🎉 ¡Foundation Completa!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-accent">✅ Completado:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>API Client (Axios) configurado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Stores profesionales (Zustand)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Router con guards avanzados</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>JSON Server backend funcional</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Estructura profesional separada</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-accent">📊 Datos desde API:</h3>
              <div className="bg-background p-4 rounded border">
                <p className="text-sm text-text-secondary mb-2">Áreas cargadas:</p>
                {areas.length > 0 ? (
                  <ul className="space-y-1">
                    {areas.map(area => (
                      <li key={area.id} className="flex items-center space-x-2 text-sm">
                        <span>{area.icon}</span>
                        <span style={{ color: area.color }}>{area.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No hay áreas configuradas</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cursos destacados */}
        {courses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Cursos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  variant="medium"
                  onFavoriteToggle={(courseId) => {
                    console.log('Toggle favorite:', courseId)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h3 className="font-medium text-accent mb-2">🎉 CourseCard conectado a API!</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>✅ Datos reales desde JSON Server</li>
            <li>✅ Componente reutilizable profesional</li>
            <li>✅ Sin hardcode - Todo dinámico</li>
            <li>✅ UI responsive con Tailwind</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Home