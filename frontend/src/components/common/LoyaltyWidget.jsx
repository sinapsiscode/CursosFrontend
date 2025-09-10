import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loyaltyService } from '../../services/loyaltyService'
import { useAuthStore } from '../../store'

const LoyaltyWidget = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [loyaltyData, setLoyaltyData] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadLoyaltyData()
    }
  }, [isAuthenticated])

  const loadLoyaltyData = () => {
    const data = loyaltyService.getUserPoints()
    const currentLevel = loyaltyService.getCurrentLevel()
    const levelConfig = loyaltyService.config.levels[currentLevel]
    const levelProgress = loyaltyService.getLevelProgress()
    
    setLoyaltyData({
      points: data.availablePoints,
      level: currentLevel,
      levelConfig,
      levelProgress
    })
  }

  if (!isAuthenticated || !loyaltyData) {
    return null
  }

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Botón minimizado */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
          title="Mostrar programa de fidelización"
        >
          <span className="text-xl">{loyaltyData.levelConfig.icon}</span>
        </button>
      ) : (
        <>
          {/* Widget compacto */}
          <div className="relative">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span className="text-2xl">{loyaltyData.levelConfig.icon}</span>
              <div className="text-left">
                <p className="text-xs font-medium">Mis Puntos</p>
                <p className="text-lg font-bold">{loyaltyData.points.toLocaleString()}</p>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            {/* Botón de minimizar */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(true)
                setIsExpanded(false)
              }}
              className="absolute -top-2 -right-2 bg-gray-800 text-gray-400 hover:text-white rounded-full p-1 shadow-lg"
              title="Minimizar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Panel expandido */}
      {isExpanded && (
        <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-xl shadow-2xl p-6 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Programa de Fidelización</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nivel actual */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{loyaltyData.levelConfig.icon}</span>
                <div>
                  <p className="text-sm text-gray-400">Nivel actual</p>
                  <p className="font-bold" style={{ color: loyaltyData.levelConfig.color }}>
                    {loyaltyData.levelConfig.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{loyaltyData.points.toLocaleString()}</p>
                <p className="text-xs text-gray-400">puntos</p>
              </div>
            </div>

            {/* Progreso de nivel */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progreso</span>
                <span>{loyaltyData.levelProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${loyaltyData.levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Beneficios actuales */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-400 mb-2">Tus beneficios:</p>
            <div className="flex items-center justify-between bg-green-600/20 border border-green-500/50 rounded-lg p-3">
              <span className="text-green-400 font-medium">Descuento activo</span>
              <span className="text-xl font-bold text-green-400">
                {loyaltyData.levelConfig.discountPercentage}%
              </span>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate('/loyalty')
                setIsExpanded(false)
              }}
              className="w-full bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Ver Programa Completo
            </button>
            <button
              onClick={() => {
                navigate('/loyalty')
                setIsExpanded(false)
              }}
              className="w-full bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Canjear Puntos
            </button>
          </div>

          {/* Cómo ganar puntos */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Gana puntos con:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-green-400">•</span>
                <span className="text-gray-300">Comprar cursos</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">•</span>
                <span className="text-gray-300">Completar lecciones</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">•</span>
                <span className="text-gray-300">Referir amigos</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-400">•</span>
                <span className="text-gray-300">Dejar reseñas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoyaltyWidget