import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../../components/ui'
import { useAuthStore, useUIStore } from '../../store'

const LoyaltyProgram = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  
  const [points, setPoints] = useState({
    available: 0,
    pending: 0,
    total: 0,
    level: 'bronze',
    nextLevel: 'silver',
    pointsToNext: 500
  })
  
  const [history, setHistory] = useState([])
  const [rewards, setRewards] = useState([])
  const [selectedReward, setSelectedReward] = useState(null)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLoyaltyData()
  }, [])

  const loadLoyaltyData = async () => {
    try {
      setLoading(true)
      
      // Simular carga de datos de puntos
      setPoints({
        available: user?.points || 1250,
        pending: 150,
        total: 3450,
        level: getLevelFromPoints(user?.points || 1250),
        nextLevel: getNextLevel(user?.points || 1250),
        pointsToNext: getPointsToNextLevel(user?.points || 1250)
      })
      
      // Simular historial de transacciones
      setHistory([
        {
          id: 1,
          type: 'earned',
          amount: 100,
          description: 'Completaste el curso de JavaScript Avanzado',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          status: 'completed',
          icon: 'course'
        },
        {
          id: 2,
          type: 'earned',
          amount: 50,
          description: 'Referiste a un nuevo estudiante',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          status: 'completed',
          icon: 'referral'
        },
        {
          id: 3,
          type: 'redeemed',
          amount: -200,
          description: 'Canjeaste descuento del 20%',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          status: 'completed',
          icon: 'discount'
        },
        {
          id: 4,
          type: 'earned',
          amount: 150,
          description: 'Completaste examen con 100%',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          status: 'pending',
          icon: 'exam'
        },
        {
          id: 5,
          type: 'earned',
          amount: 25,
          description: 'Escribiste una reseña',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
          status: 'completed',
          icon: 'review'
        },
        {
          id: 6,
          type: 'earned',
          amount: 75,
          description: 'Asististe a evento en vivo',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          status: 'completed',
          icon: 'event'
        },
        {
          id: 7,
          type: 'expired',
          amount: -50,
          description: 'Puntos expirados (más de 1 año)',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          status: 'completed',
          icon: 'expired'
        }
      ])
      
      // Simular catálogo de recompensas
      setRewards([
        {
          id: 1,
          title: 'Descuento 10%',
          description: 'En tu próximo curso',
          points: 500,
          category: 'discount',
          available: true,
          popular: false
        },
        {
          id: 2,
          title: 'Descuento 20%',
          description: 'En cualquier curso',
          points: 1000,
          category: 'discount',
          available: true,
          popular: true
        },
        {
          id: 3,
          title: 'Curso Gratis',
          description: 'Curso básico a elección',
          points: 2000,
          category: 'course',
          available: false,
          popular: true
        },
        {
          id: 4,
          title: 'Mentoría 1:1',
          description: 'Sesión de 30 minutos',
          points: 1500,
          category: 'mentoring',
          available: false,
          popular: false
        },
        {
          id: 5,
          title: 'Certificado Premium',
          description: 'Con verificación blockchain',
          points: 750,
          category: 'certificate',
          available: true,
          popular: false
        },
        {
          id: 6,
          title: 'Acceso VIP',
          description: 'Eventos exclusivos por 3 meses',
          points: 2500,
          category: 'vip',
          available: false,
          popular: true
        }
      ])
      
    } catch (error) {
      showError('Error al cargar datos del programa')
    } finally {
      setLoading(false)
    }
  }

  const getLevelFromPoints = (points) => {
    if (points < 500) return 'bronze'
    if (points < 1500) return 'silver'
    if (points < 3000) return 'gold'
    if (points < 5000) return 'platinum'
    return 'diamond'
  }

  const getNextLevel = (points) => {
    if (points < 500) return 'silver'
    if (points < 1500) return 'gold'
    if (points < 3000) return 'platinum'
    if (points < 5000) return 'diamond'
    return null
  }

  const getPointsToNextLevel = (points) => {
    if (points < 500) return 500 - points
    if (points < 1500) return 1500 - points
    if (points < 3000) return 3000 - points
    if (points < 5000) return 5000 - points
    return 0
  }

  const getLevelColor = (level) => {
    const colors = {
      bronze: 'text-orange-600',
      silver: 'text-gray-400',
      gold: 'text-yellow-500',
      platinum: 'text-purple-500',
      diamond: 'text-blue-400'
    }
    return colors[level] || 'text-gray-400'
  }

  const getLevelIcon = (level) => {
    const icons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎',
      diamond: '💠'
    }
    return icons[level] || '🏅'
  }

  const getTransactionIcon = (icon) => {
    const icons = {
      course: '📚',
      referral: '👥',
      discount: '🎟️',
      exam: '✅',
      review: '⭐',
      event: '🎤',
      expired: '⏰'
    }
    return icons[icon] || '💰'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      discount: '🎟️',
      course: '📚',
      mentoring: '👨‍🏫',
      certificate: '📜',
      vip: '👑'
    }
    return icons[category] || '🎁'
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const handleRedeemReward = (reward) => {
    if (reward.points > points.available) {
      showError('No tienes suficientes puntos')
      return
    }
    setSelectedReward(reward)
    setShowRedeemModal(true)
  }

  const confirmRedeem = async () => {
    try {
      // Simular canje
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Actualizar puntos
      setPoints(prev => ({
        ...prev,
        available: prev.available - selectedReward.points
      }))
      
      // Agregar al historial
      const newTransaction = {
        id: history.length + 1,
        type: 'redeemed',
        amount: -selectedReward.points,
        description: `Canjeaste ${selectedReward.title}`,
        date: new Date(),
        status: 'completed',
        icon: 'discount'
      }
      setHistory([newTransaction, ...history])
      
      showSuccess('¡Recompensa canjeada exitosamente!')
      setShowRedeemModal(false)
      setSelectedReward(null)
    } catch (error) {
      showError('Error al canjear recompensa')
    }
  }

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true
    if (filter === 'earned') return item.type === 'earned'
    if (filter === 'redeemed') return item.type === 'redeemed' || item.type === 'expired'
    if (filter === 'pending') return item.status === 'pending'
    return true
  })

  const filteredRewards = rewards.filter(reward => 
    reward.available ? reward.points <= points.available : true
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Programa de Lealtad
        </h1>
        <p className="text-text-secondary">
          Gana puntos con cada acción y canjéalos por increíbles recompensas
        </p>
      </div>

      {/* Resumen de Puntos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Puntos Disponibles</p>
              <p className="text-3xl font-bold text-accent">{points.available.toLocaleString()}</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
          <div className="text-sm text-text-secondary">
            +{points.pending} pendientes
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Nivel Actual</p>
              <p className={`text-2xl font-bold capitalize ${getLevelColor(points.level)}`}>
                {points.level}
              </p>
            </div>
            <span className="text-4xl">{getLevelIcon(points.level)}</span>
          </div>
          {points.nextLevel && (
            <div>
              <div className="flex items-center justify-between text-sm text-text-secondary mb-1">
                <span>Próximo: {points.nextLevel}</span>
                <span>{points.pointsToNext} pts</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ 
                    width: `${((points.available % 1500) / 1500) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Histórico</p>
              <p className="text-3xl font-bold text-text-primary">{points.total.toLocaleString()}</p>
            </div>
            <span className="text-4xl">📈</span>
          </div>
          <div className="text-sm text-primary">
            Top 5% de usuarios
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'history', 'rewards', 'rules'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab === 'overview' && 'Resumen'}
              {tab === 'history' && 'Historial'}
              {tab === 'rewards' && 'Recompensas'}
              {tab === 'rules' && 'Cómo Funciona'}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de Tabs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad Reciente */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {history.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTransactionIcon(item.icon)}</span>
                    <div>
                      <p className="text-sm text-text-primary">{item.description}</p>
                      <p className="text-xs text-text-secondary">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    item.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              variant="secondary" 
              size="small" 
              className="w-full mt-4"
              onClick={() => setActiveTab('history')}
            >
              Ver Todo el Historial
            </Button>
          </Card>

          {/* Recompensas Destacadas */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recompensas Disponibles
            </h3>
            <div className="space-y-3">
              {rewards.filter(r => r.available && r.points <= points.available).slice(0, 3).map(reward => (
                <div key={reward.id} className="border border-gray-700 rounded-lg p-4 hover:border-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(reward.category)}</span>
                      <div>
                        <p className="font-medium text-text-primary">{reward.title}</p>
                        <p className="text-sm text-text-secondary">{reward.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleRedeemReward(reward)}
                    >
                      {reward.points} pts
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="secondary" 
              size="small" 
              className="w-full mt-4"
              onClick={() => setActiveTab('rewards')}
            >
              Ver Todas las Recompensas
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Historial de Transacciones
            </h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todas</option>
              <option value="earned">Ganados</option>
              <option value="redeemed">Canjeados</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-text-secondary text-sm font-medium">Fecha</th>
                  <th className="text-left py-3 px-4 text-text-secondary text-sm font-medium">Descripción</th>
                  <th className="text-left py-3 px-4 text-text-secondary text-sm font-medium">Estado</th>
                  <th className="text-right py-3 px-4 text-text-secondary text-sm font-medium">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map(item => (
                  <tr key={item.id} className="border-b border-gray-700/50 hover:bg-surface-light">
                    <td className="py-3 px-4">
                      <p className="text-sm text-text-primary">{formatDate(item.date)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getTransactionIcon(item.icon)}</span>
                        <p className="text-sm text-text-primary">{item.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${
                        item.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map(reward => (
            <Card 
              key={reward.id} 
              className={`p-6 relative ${
                !reward.available || reward.points > points.available 
                  ? 'opacity-60' 
                  : 'hover:shadow-lg hover:shadow-accent/20'
              } transition-all`}
            >
              {reward.popular && (
                <span className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
              
              <div className="text-center mb-4">
                <span className="text-4xl">{getCategoryIcon(reward.category)}</span>
              </div>
              
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                {reward.title}
              </h4>
              <p className="text-text-secondary text-sm mb-4">
                {reward.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-accent">
                  {reward.points.toLocaleString()} pts
                </span>
                <Button
                  variant={reward.points <= points.available ? 'primary' : 'secondary'}
                  size="small"
                  disabled={!reward.available || reward.points > points.available}
                  onClick={() => handleRedeemReward(reward)}
                >
                  {reward.points > points.available 
                    ? `Faltan ${reward.points - points.available}`
                    : 'Canjear'
                  }
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Cómo Ganar Puntos
            </h3>
            <div className="space-y-4">
              {[
                { action: 'Completar un curso', points: '100-200', icon: '📚' },
                { action: 'Aprobar examen (>80%)', points: '50-150', icon: '✅' },
                { action: 'Escribir una reseña', points: '25', icon: '⭐' },
                { action: 'Referir a un amigo', points: '50', icon: '👥' },
                { action: 'Asistir a evento en vivo', points: '75', icon: '🎤' },
                { action: 'Completar perfil', points: '10', icon: '👤' },
                { action: 'Primera compra', points: '100', icon: '🛒' },
                { action: 'Compartir en redes', points: '15', icon: '📱' }
              ].map((rule, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rule.icon}</span>
                    <span className="text-text-primary">{rule.action}</span>
                  </div>
                  <span className="font-bold text-accent">+{rule.points}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Niveles y Beneficios
            </h3>
            <div className="space-y-4">
              {[
                { level: 'Bronze', range: '0-499', benefits: 'Acceso básico', icon: '🥉' },
                { level: 'Silver', range: '500-1,499', benefits: '5% descuento extra', icon: '🥈' },
                { level: 'Gold', range: '1,500-2,999', benefits: '10% descuento + Envío gratis', icon: '🥇' },
                { level: 'Platinum', range: '3,000-4,999', benefits: '15% descuento + Acceso VIP', icon: '💎' },
                { level: 'Diamond', range: '5,000+', benefits: '20% descuento + Mentoría gratis', icon: '💠' }
              ].map((level, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{level.icon}</span>
                      <span className={`font-semibold ${getLevelColor(level.level.toLowerCase())}`}>
                        {level.level}
                      </span>
                    </div>
                    <span className="text-sm text-text-secondary">{level.range} pts</span>
                  </div>
                  <p className="text-sm text-text-secondary">{level.benefits}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-400">
                ⚠️ Los puntos expiran después de 12 meses de inactividad
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Confirmación de Canje */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Confirmar Canje
            </h3>
            
            <div className="text-center mb-6">
              <span className="text-5xl">{getCategoryIcon(selectedReward.category)}</span>
              <h4 className="text-lg font-semibold text-text-primary mt-4">
                {selectedReward.title}
              </h4>
              <p className="text-text-secondary mt-2">
                {selectedReward.description}
              </p>
            </div>
            
            <div className="bg-surface-light rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary">Costo:</span>
                <span className="font-bold text-accent">
                  {selectedReward.points.toLocaleString()} puntos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Saldo después:</span>
                <span className="font-bold text-text-primary">
                  {(points.available - selectedReward.points).toLocaleString()} puntos
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowRedeemModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmRedeem}
              >
                Confirmar Canje
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LoyaltyProgram