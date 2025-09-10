import { useState, useEffect } from 'react'
import { loyaltyService } from '../../services/loyaltyService'
import { LoadingSpinner } from '../../components/common'
import CoursePointsManagement from './CoursePointsManagement'
import RewardsManagement from './RewardsManagement'
import Swal from 'sweetalert2'

const LoyaltyManagement = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loyaltyData, setLoyaltyData] = useState(null)
  const [userPoints, setUserPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [pointsToAdd, setPointsToAdd] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLoyaltyData()
  }, [])

  const loadLoyaltyData = () => {
    setLoading(true)
    try {
      // Cargar configuración del programa
      const config = loyaltyService.config
      
      // Cargar datos reales de usuarios
      const realUsers = loyaltyService.getAllUsersWithPoints()
      
      // Si no hay usuarios reales, crear algunos de prueba
      if (realUsers.length === 0) {
        // Generar usuarios de prueba
        const testUsers = [
          { id: 'user_1', name: 'Ana García', email: 'ana@email.com' },
          { id: 'user_2', name: 'Carlos López', email: 'carlos@email.com' },
          { id: 'user_3', name: 'María Rodríguez', email: 'maria@email.com' },
          { id: 'user_4', name: 'Juan Pérez', email: 'juan@email.com' },
          { id: 'user_5', name: 'Laura Martínez', email: 'laura@email.com' }
        ]
        
        // Guardar usuarios en auth storage
        const authData = localStorage.getItem('auth-storage')
        if (authData) {
          const auth = JSON.parse(authData)
          auth.state.allUsers = testUsers
          localStorage.setItem('auth-storage', JSON.stringify(auth))
        }
        
        // Asignar puntos de prueba a algunos usuarios
        loyaltyService.adminAddPoints('user_1', 2500, 'Puntos iniciales de prueba')
        loyaltyService.adminAddPoints('user_2', 1200, 'Puntos iniciales de prueba')
        loyaltyService.adminAddPoints('user_3', 500, 'Puntos iniciales de prueba')
        loyaltyService.adminAddPoints('user_4', 8500, 'Puntos iniciales de prueba')
        loyaltyService.adminAddPoints('user_5', 3200, 'Puntos iniciales de prueba')
        
        // Volver a cargar usuarios con puntos
        const updatedUsers = loyaltyService.getAllUsersWithPoints()
        setUserPoints(updatedUsers)
      } else {
        setUserPoints(realUsers)
      }
      
      setLoyaltyData(config)
    } catch (error) {
      console.error('Error loading loyalty data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPoints = async (userId, userName) => {
    const { value: points } = await Swal.fire({
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
      // Usar el método administrativo para agregar puntos
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
      
      loadLoyaltyData()
    }
  }

  const handleRemovePoints = async (userId, userName, currentPoints) => {
    const { value: points } = await Swal.fire({
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
      // Usar el método administrativo para remover puntos
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
      
      loadLoyaltyData()
    }
  }

  const filteredUsers = userPoints.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLevelConfig = (level) => {
    return loyaltyData?.levels[level] || {}
  }

  const totalPoints = userPoints.reduce((sum, user) => sum + user.points, 0)
  const totalUsers = userPoints.length
  const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0
  const totalCoursesCompleted = Math.floor(totalPoints / 100) // 100 puntos por curso

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Programa de Fidelización</h1>
        <p className="text-text-secondary">
          Gestiona puntos, niveles y recompensas del programa de lealtad
        </p>
      </div>

      {/* Test Button - Solo para desarrollo */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            // Simular completar curso para usuario de prueba
            const testUserId = 'user_test_' + Date.now()
            loyaltyService.adminAddPoints(testUserId, 100, 'Test: Curso completado')
              .then(() => {
                loadLoyaltyData()
                Swal.fire({
                  title: 'Prueba Exitosa',
                  text: 'Se agregó un usuario de prueba con 100 puntos',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                  customClass: {
                    popup: 'bg-gray-800 text-white',
                    title: 'text-white'
                  }
                })
              })
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
        >
          🧪 Agregar Usuario de Prueba
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-text-secondary text-sm">
            Puntos Totales
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {totalCoursesCompleted}
          </div>
          <div className="text-text-secondary text-sm">
            Cursos Completados
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            100
          </div>
          <div className="text-text-secondary text-sm">
            Puntos por Curso
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {totalUsers}
          </div>
          <div className="text-text-secondary text-sm">
            Estudiantes Activos
          </div>
        </div>
        <div className="bg-surface rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-400 mb-2">
            4
          </div>
          <div className="text-text-secondary text-sm">
            Niveles de Beneficios
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface rounded-lg p-6 mb-8">
        <div className="flex space-x-4 border-b border-gray-700 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Vista General
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('levels')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'levels'
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Niveles
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'actions'
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Acciones de Puntos
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Puntos por Curso
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'rewards'
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Recompensas
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Resumen del Programa</h3>
            
            {/* Distribution by Level */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Distribución por Nivel</h4>
                {Object.entries(loyaltyData?.levels || {}).map(([key, level]) => {
                  const usersInLevel = userPoints.filter(u => u.level === key).length
                  const percentage = totalUsers > 0 ? (usersInLevel / totalUsers * 100).toFixed(1) : 0
                  return (
                    <div key={key} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{level.icon}</span>
                          <div>
                            <span className="font-medium" style={{ color: level.color }}>
                              {level.name}
                            </span>
                            <div className="text-xs text-gray-500">
                              {level.coursesRequired || `${level.minPoints}+ pts`}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">
                          {usersInLevel} usuarios ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: level.color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Puntos otorgados hoy</span>
                    <span className="text-green-400 font-medium">+350</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Puntos canjeados hoy</span>
                    <span className="text-red-400 font-medium">-120</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Nuevos miembros (7 días)</span>
                    <span className="text-blue-400 font-medium">15</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Tasa de canje</span>
                    <span className="text-yellow-400 font-medium">34%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Gestión de Usuarios</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-accent focus:outline-none w-64"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Nivel</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Cursos</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Puntos</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Total Ganado</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const level = getLevelConfig(user.level)
                    const coursesCompleted = user.completedCourses || Math.floor((user.lifetimePoints || user.points) / 100)
                    return (
                      <tr key={user.userId} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-text-secondary text-sm">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{level.icon}</span>
                            <div>
                              <span className="font-medium block" style={{ color: level.color }}>
                                {level.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                Próximo: {level.maxPoints ? Math.ceil((level.maxPoints + 1 - (user.points || 0)) / 100) : 0} cursos
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div>
                            <span className="text-white font-bold text-lg">{coursesCompleted}</span>
                            <div className="text-xs text-gray-500">completados</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-white font-bold">{(user.points || 0).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-green-400">{(user.lifetimePoints || user.totalEarned || 0).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleAddPoints(user.userId, user.name)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              + Agregar
                            </button>
                            <button
                              onClick={() => handleRemovePoints(user.userId, user.name, user.points)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              - Remover
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'levels' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Configuración de Niveles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(loyaltyData?.levels || {}).map(([key, level]) => (
                <div key={key} className="bg-gray-800 rounded-lg p-6 border-2" style={{ borderColor: level.color + '40' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{level.icon}</span>
                      <div>
                        <h4 className="text-xl font-bold" style={{ color: level.color }}>
                          {level.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {level.coursesRequired || `${level.minPoints} - ${level.maxPoints || '∞'} puntos`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.floor(level.minPoints / 100)} - {level.maxPoints ? Math.floor(level.maxPoints / 100) : '∞'} cursos completados
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                      <span className="text-gray-300">Descuento</span>
                      <span className="text-green-400 font-bold text-lg">
                        {level.discountPercentage}%
                      </span>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-gray-300 mb-2">Beneficios:</p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {level.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Sistema de Puntos Estándar</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sistema de puntos por curso */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Cómo Ganar Puntos
                </h4>
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Curso Completado</span>
                      <span className="text-green-400 font-bold text-lg">+100 pts</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Puntos estándar por cada curso finalizado
                    </p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Primer Curso</span>
                      <span className="text-blue-400 font-bold text-lg">+150 pts</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Bonus especial por completar tu primer curso
                    </p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Dejar Reseña</span>
                      <span className="text-purple-400 font-bold">+25 pts</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Puntos extra por compartir tu experiencia
                    </p>
                  </div>
                </div>
              </div>

              {/* Canje de puntos */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="text-red-400 mr-2">-</span>
                  Opciones de canje
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Descuento 10%</span>
                    <span className="text-red-400 font-medium">500 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Descuento 20%</span>
                    <span className="text-red-400 font-medium">1000 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Curso gratis (básico)</span>
                    <span className="text-red-400 font-medium">2000 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Certificado premium</span>
                    <span className="text-red-400 font-medium">800 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de multiplicadores */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Multiplicadores Activos</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-medium">Fin de semana</span>
                    <span className="text-purple-400 font-bold">2x</span>
                  </div>
                  <p className="text-xs text-gray-400">Puntos dobles en compras de fin de semana</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-medium">Primer curso</span>
                    <span className="text-blue-400 font-bold">3x</span>
                  </div>
                  <p className="text-xs text-gray-400">Puntos triples en la primera compra</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-medium">Referidos</span>
                    <span className="text-green-400 font-bold">1.5x</span>
                  </div>
                  <p className="text-xs text-gray-400">Puntos extra por cada amigo referido</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Course Points Management Tab */}
        {activeTab === 'courses' && (
          <CoursePointsManagement />
        )}
        
        {/* Rewards Management Tab */}
        {activeTab === 'rewards' && (
          <RewardsManagement />
        )}
      </div>
    </div>
  )
}

export default LoyaltyManagement