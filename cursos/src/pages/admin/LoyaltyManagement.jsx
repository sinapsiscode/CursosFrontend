import { useState, useEffect } from 'react'
import { loyaltyService } from '../../services/loyaltyService'
import { LoadingSpinner } from '../../components/ui'
import { useUIStore } from '../../store'
import hardcodedValuesService from '../../services/hardcodedValuesService'
import Swal from 'sweetalert2'

const LoyaltyManagement = () => {
  const { showToast } = useUIStore()
  const [hardcodedValues, setHardcodedValues] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [loyaltyData, setLoyaltyData] = useState(null)
  const [userPoints, setUserPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadHardcodedValues()
    loadLoyaltyData()
  }, [])

  const loadHardcodedValues = async () => {
    try {
      const values = await hardcodedValuesService.getValues()
      setHardcodedValues(values)
    } catch (error) {
      console.error('Error loading hardcoded values:', error)
      setHardcodedValues({
        examples: {
          testUserEmail1: 'ana@email.com',
          testUserEmail2: 'carlos@email.com',
          testUserEmail3: 'maria@email.com',
          testUserEmail4: 'juan@email.com',
          testUserEmail5: 'laura@email.com'
        },
        points: {
          demoUserPoints1: 2500,
          demoUserPoints2: 1200,
          demoUserPoints3: 500,
          demoUserPoints4: 8500,
          demoUserPoints5: 3200
        }
      })
    }
  }

  const loadLoyaltyData = async () => {
    setLoading(true)
    try {
      // Cargar configuración del programa
      const config = loyaltyService.config
      
      // Cargar datos reales de usuarios
      const realUsers = loyaltyService.getAllUsersWithPoints()
      
      // Si no hay usuarios reales, crear algunos de demostración
      if (realUsers.length === 0) {
        await createTestUsers()
        const updatedUsers = loyaltyService.getAllUsersWithPoints()
        setUserPoints(updatedUsers)
      } else {
        setUserPoints(realUsers)
      }
      
      setLoyaltyData(config)
    } catch (error) {
      console.error('Error loading loyalty data:', error)
      showToast('Error al cargar datos de fidelidad', 'error')
    } finally {
      setLoading(false)
    }
  }

  const createTestUsers = async () => {
    const testUsers = [
      { id: 'user_1', name: 'Ana García', email: hardcodedValues?.examples?.testUserEmail1 || 'ana@email.com' },
      { id: 'user_2', name: 'Carlos López', email: hardcodedValues?.examples?.testUserEmail2 || 'carlos@email.com' },
      { id: 'user_3', name: 'María Rodríguez', email: hardcodedValues?.examples?.testUserEmail3 || 'maria@email.com' },
      { id: 'user_4', name: 'Juan Pérez', email: hardcodedValues?.examples?.testUserEmail4 || 'juan@email.com' },
      { id: 'user_5', name: 'Laura Martínez', email: hardcodedValues?.examples?.testUserEmail5 || 'laura@email.com' }
    ]
    
    // Guardar usuarios en auth storage si existe
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const auth = JSON.parse(authData)
        auth.state.allUsers = testUsers
        localStorage.setItem('auth-storage', JSON.stringify(auth))
      }
    } catch (error) {
      console.warn('No se pudo actualizar auth storage:', error)
    }
    
    // Asignar puntos de demostración
    loyaltyService.adminAddPoints('user_1', hardcodedValues?.points?.demoUserPoints1 || 2500, 'Puntos iniciales de demostración')
    loyaltyService.adminAddPoints('user_2', hardcodedValues?.points?.demoUserPoints2 || 1200, 'Puntos iniciales de demostración')
    loyaltyService.adminAddPoints('user_3', hardcodedValues?.points?.demoUserPoints3 || 500, 'Puntos iniciales de demostración')
    loyaltyService.adminAddPoints('user_4', hardcodedValues?.points?.demoUserPoints4 || 8500, 'Puntos iniciales de demostración')
    loyaltyService.adminAddPoints('user_5', hardcodedValues?.points?.demoUserPoints5 || 3200, 'Puntos iniciales de demostración')
  }

  const handleAddPoints = async (userId, userName) => {
    const { value } = await Swal.fire({
      title: 'Agregar Puntos',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Usuario:</strong> ${userName}</p>
          <input id="points-input" type="number" class="swal2-input" placeholder="Cantidad de puntos" min="1">
          <input id="reason-input" type="text" class="swal2-input" placeholder="Razón (opcional)">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      },
      preConfirm: () => {
        const pointsValue = document.getElementById('points-input').value
        const reason = document.getElementById('reason-input').value
        if (!pointsValue || pointsValue <= 0) {
          Swal.showValidationMessage('Por favor ingresa una cantidad válida')
          return false
        }
        return { points: parseInt(pointsValue), reason }
      }
    })

    if (value) {
      try {
        await loyaltyService.adminAddPoints(
          userId, 
          value.points, 
          value.reason || 'Puntos agregados por administrador'
        )
        
        Swal.fire({
          title: '¡Puntos agregados!',
          text: `Se agregaron ${value.points} puntos a ${userName}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
        
        await loadLoyaltyData()
      } catch (error) {
        console.error('Error adding points:', error)
        showToast('Error al agregar puntos', 'error')
      }
    }
  }

  const handleRemovePoints = async (userId, userName, currentPoints) => {
    const { value } = await Swal.fire({
      title: 'Remover Puntos',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Usuario:</strong> ${userName}</p>
          <p class="mb-2"><strong>Puntos actuales:</strong> ${currentPoints}</p>
          <input id="points-input" type="number" class="swal2-input" placeholder="Cantidad a remover" min="1" max="${currentPoints}">
          <input id="reason-input" type="text" class="swal2-input" placeholder="Razón (opcional)">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      },
      preConfirm: () => {
        const pointsValue = document.getElementById('points-input').value
        const reason = document.getElementById('reason-input').value
        if (!pointsValue || pointsValue <= 0 || pointsValue > currentPoints) {
          Swal.showValidationMessage('Por favor ingresa una cantidad válida')
          return false
        }
        return { points: parseInt(pointsValue), reason }
      }
    })

    if (value) {
      try {
        await loyaltyService.adminRemovePoints(
          userId, 
          value.points, 
          value.reason || 'Puntos removidos por administrador'
        )
        
        Swal.fire({
          title: '¡Puntos removidos!',
          text: `Se removieron ${value.points} puntos de ${userName}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
        
        await loadLoyaltyData()
      } catch (error) {
        console.error('Error removing points:', error)
        showToast('Error al remover puntos', 'error')
      }
    }
  }

  const filteredUsers = userPoints.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLevelConfig = (level) => {
    return loyaltyData?.levels[level] || { name: 'Sin nivel', icon: '⭐', color: 'gray' }
  }

  const getLevelFromPoints = (points) => {
    if (!loyaltyData) return 'bronce'
    
    if (points >= loyaltyData.levelThresholds.oro) return 'oro'
    if (points >= loyaltyData.levelThresholds.plata) return 'plata'
    return 'bronce'
  }

  const totalPoints = userPoints.reduce((sum, user) => sum + user.points, 0)
  const totalUsers = userPoints.length
  const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0
  const totalCoursesCompleted = Math.floor(totalPoints / 100) // Estimación: 100 puntos por curso

  const getUserStats = () => {
    const levels = { bronce: 0, plata: 0, oro: 0 }
    userPoints.forEach(user => {
      const level = getLevelFromPoints(user.points)
      levels[level]++
    })
    return levels
  }

  const userStats = getUserStats()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
        <span className="ml-3 text-white">Cargando datos de fidelidad...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sistema de Fidelidad</h1>
        <p className="text-text-secondary">
          Gestiona puntos, niveles y recompensas del programa de fidelidad
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-accent text-background'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-accent text-background'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Gestión de Puntos
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Usuarios</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Puntos</p>
                  <p className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Promedio Puntos</p>
                  <p className="text-2xl font-bold text-white">{averagePoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Cursos Completados</p>
                  <p className="text-2xl font-bold text-white">{totalCoursesCompleted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distribución por Niveles */}
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Distribución por Niveles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🥉</span>
                  <div>
                    <p className="font-medium text-white">Bronce</p>
                    <p className="text-2xl font-bold text-amber-400">{userStats.bronce}</p>
                    <p className="text-sm text-gray-400">usuarios</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/20 border border-gray-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🥈</span>
                  <div>
                    <p className="font-medium text-white">Plata</p>
                    <p className="text-2xl font-bold text-gray-400">{userStats.plata}</p>
                    <p className="text-sm text-gray-400">usuarios</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🥇</span>
                  <div>
                    <p className="font-medium text-white">Oro</p>
                    <p className="text-2xl font-bold text-yellow-400">{userStats.oro}</p>
                    <p className="text-sm text-gray-400">usuarios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración del Sistema */}
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuración del Sistema</h3>
            {loyaltyData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-300 mb-3">Umbrales de Niveles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">🥉 Bronce:</span>
                      <span className="text-white">0 puntos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">🥈 Plata:</span>
                      <span className="text-white">{loyaltyData.levelThresholds.plata} puntos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">🥇 Oro:</span>
                      <span className="text-white">{loyaltyData.levelThresholds.oro} puntos</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-300 mb-3">Puntos por Actividad</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">📚 Completar lección:</span>
                      <span className="text-white">{loyaltyData.pointsPerActivity.lessonComplete} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">🎓 Completar curso:</span>
                      <span className="text-white">{loyaltyData.pointsPerActivity.courseComplete} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">⭐ Dejar reseña:</span>
                      <span className="text-white">{loyaltyData.pointsPerActivity.review} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">📅 Asistir evento:</span>
                      <span className="text-white">{loyaltyData.pointsPerActivity.eventAttendance} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Búsqueda */}
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {filteredUsers.length} de {totalUsers} usuarios
              </div>
            </div>
          </div>

          {/* Lista de Usuarios */}
          <div className="bg-surface rounded-xl overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios'}
                </h3>
                <p className="text-text-secondary">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda' 
                    : 'Los usuarios aparecerán aquí cuando se registren'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Usuario</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-400">Nivel</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-400">Puntos</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-400">Progreso</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => {
                      const userLevel = getLevelFromPoints(user.points)
                      const levelConfig = getLevelConfig(userLevel)
                      const nextLevel = userLevel === 'bronce' ? 'plata' : userLevel === 'plata' ? 'oro' : null
                      const nextThreshold = nextLevel ? loyaltyData?.levelThresholds[nextLevel] : null
                      const progressPercentage = nextThreshold 
                        ? Math.min((user.points / nextThreshold) * 100, 100)
                        : 100

                      return (
                        <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              userLevel === 'oro' ? 'bg-yellow-900/20 text-yellow-400' :
                              userLevel === 'plata' ? 'bg-gray-700/20 text-gray-400' :
                              'bg-amber-900/20 text-amber-400'
                            }`}>
                              {levelConfig.icon} {levelConfig.name}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-white font-bold">{user.points}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {nextLevel ? (
                              <div className="w-full max-w-xs mx-auto">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>{user.points}</span>
                                  <span>{nextThreshold}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-accent h-2 rounded-full transition-all"
                                    style={{ width: `${progressPercentage}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {nextThreshold - user.points} para {nextLevel}
                                </p>
                              </div>
                            ) : (
                              <span className="text-yellow-400 text-sm">🏆 Nivel máximo</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleAddPoints(user.id, user.name)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                title="Agregar puntos"
                              >
                                + Agregar
                              </button>
                              {user.points > 0 && (
                                <button
                                  onClick={() => handleRemovePoints(user.id, user.name, user.points)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                  title="Remover puntos"
                                >
                                  - Remover
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Información del sistema */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-blue-400 font-semibold mb-3">🏆 Información del Sistema de Fidelidad:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-300">
          <ul className="space-y-2">
            <li>• Los puntos se otorgan automáticamente por actividades</li>
            <li>• Los niveles determinan beneficios y recompensas especiales</li>
            <li>• Los cambios manuales se registran en el historial</li>
          </ul>
          <ul className="space-y-2">
            <li>• Los usuarios pueden canjear puntos por descuentos</li>
            <li>• El nivel se actualiza automáticamente según los puntos</li>
            <li>• Los administradores pueden ajustar puntos según necesidad</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyManagement