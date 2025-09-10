import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loyaltyService } from '../services/loyaltyService'
import { useUIStore, useAuthStore } from '../store'

const LoyaltyProgram = () => {
  const navigate = useNavigate()
  const { showToast } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview') // overview, rewards, history
  const [userLoyaltyData, setUserLoyaltyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redeemingReward, setRedeemingReward] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    loadLoyaltyData()
  }, [isAuthenticated])

  const loadLoyaltyData = () => {
    const data = loyaltyService.getUserPoints()
    const currentLevel = loyaltyService.getCurrentLevel()
    const levelProgress = loyaltyService.getLevelProgress()
    const pointsToNext = loyaltyService.getPointsToNextLevel()
    const config = loyaltyService.config

    setUserLoyaltyData({
      ...data,
      currentLevel,
      levelProgress,
      pointsToNext,
      levelConfig: config.levels[currentLevel],
      availableRewards: loyaltyService.getAvailableRewards(),
      redeemedRewards: loyaltyService.getRedeemedRewards(),
      transactions: loyaltyService.getTransactionHistory(20)
    })
    setLoading(false)
  }

  const handleRedeemReward = async (rewardId) => {
    setRedeemingReward(rewardId)
    
    const result = await loyaltyService.redeemReward(rewardId)
    
    if (result.success) {
      showToast('¡Recompensa canjeada exitosamente!', 'success')
      loadLoyaltyData()
    } else {
      showToast(result.error || 'Error al canjear la recompensa', 'error')
    }
    
    setRedeemingReward(null)
  }

  const handleClaimDailyBonus = async () => {
    const result = await loyaltyService.addDailyLoginPoints()
    
    if (result.success) {
      showToast(`¡+${result.transaction.amount} puntos diarios reclamados!`, 'success')
      loadLoyaltyData()
    } else {
      showToast(result.error, 'info')
    }
  }

  if (loading || !userLoyaltyData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando programa de fidelización...</p>
        </div>
      </div>
    )
  }

  const categoryIcons = {
    cupones: '🎟️',
    cursos: '📚',
    servicios: '🛠️',
    eventos: '🎭',
    merchandising: '🎁'
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con información del usuario */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Información de puntos */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Programa de Fidelización</h1>
              <p className="text-gray-300 mb-6">Gana puntos y canjéalos por increíbles recompensas</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Puntos disponibles</span>
                  <span className="text-3xl font-bold text-white">{userLoyaltyData.availablePoints.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Puntos totales</span>
                  <span className="text-xl text-gray-300">{userLoyaltyData.lifetimePoints.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleClaimDailyBonus}
                  className="w-full bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  🎁 Reclamar Bonus Diario (+10 pts)
                </button>
              </div>
            </div>

            {/* Información de nivel */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-400">Tu Nivel</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl">{userLoyaltyData.levelConfig.icon}</span>
                    <span className="text-2xl font-bold" style={{ color: userLoyaltyData.levelConfig.color }}>
                      {userLoyaltyData.levelConfig.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Descuento activo</p>
                  <p className="text-2xl font-bold text-green-400">
                    {userLoyaltyData.levelConfig.discountPercentage}%
                  </p>
                </div>
              </div>

              {/* Progreso al siguiente nivel */}
              {userLoyaltyData.pointsToNext !== null && (
                <>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progreso al siguiente nivel</span>
                      <span>{userLoyaltyData.pointsToNext.toLocaleString()} pts restantes</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-accent to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${userLoyaltyData.levelProgress}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Beneficios del nivel */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-400 mb-2">Beneficios de tu nivel:</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  {userLoyaltyData.levelConfig.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                  {userLoyaltyData.levelConfig.benefits.length > 3 && (
                    <li className="text-accent">
                      +{userLoyaltyData.levelConfig.benefits.length - 3} beneficios más...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'rewards'
                ? 'text-white border-b-2 border-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tienda de Recompensas
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-white border-b-2 border-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Historial
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Todos los niveles */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Niveles del Programa</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(loyaltyService.config.levels).map(([key, level]) => (
                  <div
                    key={key}
                    className={`bg-surface rounded-xl p-6 border-2 transition-all ${
                      key === userLoyaltyData.currentLevel
                        ? 'border-accent shadow-lg shadow-accent/20'
                        : 'border-gray-700'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{level.icon}</div>
                      <h3 className="text-xl font-bold" style={{ color: level.color }}>
                        {level.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {level.minPoints.toLocaleString()}+ puntos
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-center py-2 bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">{level.discountPercentage}%</p>
                        <p className="text-xs text-gray-400">Descuento</p>
                      </div>
                      
                      <ul className="space-y-1 text-xs text-gray-300">
                        {level.benefits.slice(0, 2).map((benefit, idx) => (
                          <li key={idx} className="truncate">• {benefit}</li>
                        ))}
                        {level.benefits.length > 2 && (
                          <li className="text-accent">+{level.benefits.length - 2} más...</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cómo ganar puntos */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">¿Cómo ganar puntos?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(loyaltyService.config.pointsRules).map(([key, rule]) => (
                  <div key={key} className="bg-surface rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{rule.description}</h3>
                    </div>
                    <p className="text-2xl font-bold text-accent">
                      {key === 'coursePurchase' 
                        ? `${rule.rate} pts/$1`
                        : `+${rule.points} pts`
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recompensas canjeadas */}
            {userLoyaltyData.redeemedRewards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Mis Recompensas Canjeadas</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {userLoyaltyData.redeemedRewards.slice(0, 4).map(redemption => (
                    <div key={redemption.id} className="bg-surface rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{redemption.reward.icon}</span>
                            <h3 className="font-medium text-white">{redemption.reward.name}</h3>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{redemption.reward.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          redemption.status === 'active' ? 'bg-green-600/20 text-green-400' :
                          redemption.status === 'used' ? 'bg-gray-600/20 text-gray-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {redemption.status === 'active' ? 'Activo' :
                           redemption.status === 'used' ? 'Usado' : 'Expirado'}
                        </span>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Código de canje</p>
                        <p className="font-mono text-sm text-white">{redemption.code}</p>
                      </div>
                      
                      {redemption.status === 'active' && (
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Expira en {redemption.daysUntilExpiration} días
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Tienda de Recompensas</h2>
            
            {/* Categorías de recompensas */}
            {Object.entries(
              userLoyaltyData.availableRewards.reduce((acc, reward) => {
                if (!acc[reward.category]) acc[reward.category] = []
                acc[reward.category].push(reward)
                return acc
              }, {})
            ).map(([category, rewards]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">{categoryIcons[category]}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map(reward => (
                    <div
                      key={reward.id}
                      className={`bg-surface rounded-xl p-6 border transition-all ${
                        reward.canRedeem
                          ? 'border-gray-700 hover:border-accent hover:shadow-lg'
                          : 'border-gray-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{reward.icon}</div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{reward.points.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">puntos</p>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-white mb-2">{reward.name}</h4>
                      <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                      
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!reward.canRedeem || redeemingReward === reward.id}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          reward.canRedeem
                            ? 'bg-accent text-background hover:bg-opacity-90'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {redeemingReward === reward.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Canjeando...
                          </span>
                        ) : reward.canRedeem ? (
                          'Canjear'
                        ) : (
                          `Necesitas ${(reward.points - userLoyaltyData.availablePoints).toLocaleString()} pts más`
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Historial de Transacciones</h2>
            
            {userLoyaltyData.transactions.length > 0 ? (
              <div className="bg-surface rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Descripción</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-400">Puntos</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-400">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {userLoyaltyData.transactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {new Date(transaction.timestamp).toLocaleDateString('es-ES')}
                        </td>
                        <td className="py-3 px-4 text-sm text-white">
                          {transaction.description}
                        </td>
                        <td className={`py-3 px-4 text-sm font-medium text-right ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            transaction.type === 'earned' ? 'bg-green-600/20 text-green-400' :
                            transaction.type === 'redeemed' ? 'bg-blue-600/20 text-blue-400' :
                            transaction.type === 'bonus' ? 'bg-purple-600/20 text-purple-400' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {transaction.type === 'earned' ? 'Ganado' :
                             transaction.type === 'redeemed' ? 'Canjeado' :
                             transaction.type === 'bonus' ? 'Bonus' :
                             'Otro'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-surface rounded-xl">
                <p className="text-gray-400">No hay transacciones aún</p>
                <p className="text-sm text-gray-500 mt-2">Comienza a ganar puntos comprando cursos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoyaltyProgram