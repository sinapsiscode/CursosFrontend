import { useState, useEffect } from 'react'
import { loyaltyService } from '../../services/loyaltyService'
import { LoadingSpinner } from '../../components/common'
import Swal from 'sweetalert2'

const RewardsManagement = () => {
  const [rewards, setRewards] = useState([])
  const [editingReward, setEditingReward] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  
  const categories = [
    { key: 'all', label: 'Todas', icon: '📦' },
    { key: 'cupones', label: 'Cupones', icon: '🎟️' },
    { key: 'cursos', label: 'Cursos', icon: '📚' },
    { key: 'servicios', label: 'Servicios', icon: '⚡' },
    { key: 'merchandising', label: 'Merchandising', icon: '🎁' },
    { key: 'eventos', label: 'Eventos', icon: '🎭' }
  ]

  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points: 100,
    category: 'cupones',
    type: 'discount',
    value: '',
    icon: '🎁',
    stock: null,
    active: true
  })

  useEffect(() => {
    loadRewards()
  }, [])

  const loadRewards = () => {
    setLoading(true)
    try {
      // Cargar recompensas desde localStorage o usar las del servicio
      const storedRewards = localStorage.getItem('loyalty_rewards')
      if (storedRewards) {
        setRewards(JSON.parse(storedRewards))
      } else {
        // Usar las recompensas por defecto del servicio
        setRewards(loyaltyService.config.rewards)
        localStorage.setItem('loyalty_rewards', JSON.stringify(loyaltyService.config.rewards))
      }
    } catch (error) {
      console.error('Error loading rewards:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveRewards = (updatedRewards) => {
    localStorage.setItem('loyalty_rewards', JSON.stringify(updatedRewards))
    // Actualizar también en el servicio
    loyaltyService.config.rewards = updatedRewards
    setRewards(updatedRewards)
  }

  const handleAddReward = () => {
    if (!newReward.name || !newReward.points) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos requeridos',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
      return
    }

    const reward = {
      ...newReward,
      id: `reward_${Date.now()}`,
      points: parseInt(newReward.points),
      createdAt: new Date().toISOString()
    }

    const updatedRewards = [...rewards, reward]
    saveRewards(updatedRewards)
    
    setShowAddForm(false)
    setNewReward({
      name: '',
      description: '',
      points: 100,
      category: 'cupones',
      type: 'discount',
      value: '',
      icon: '🎁',
      stock: null,
      active: true
    })

    Swal.fire({
      title: '¡Recompensa Creada!',
      text: `${reward.name} agregada exitosamente`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white'
      }
    })
  }

  const handleEditReward = (reward) => {
    setEditingReward({ ...reward })
  }

  const handleSaveEdit = () => {
    const updatedRewards = rewards.map(r => 
      r.id === editingReward.id ? editingReward : r
    )
    saveRewards(updatedRewards)
    setEditingReward(null)

    Swal.fire({
      title: '¡Actualizado!',
      text: 'Recompensa actualizada exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white'
      }
    })
  }

  const handleDeleteReward = async (reward) => {
    const result = await Swal.fire({
      title: '¿Eliminar recompensa?',
      text: `¿Estás seguro de eliminar "${reward.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      }
    })

    if (result.isConfirmed) {
      const updatedRewards = rewards.filter(r => r.id !== reward.id)
      saveRewards(updatedRewards)

      Swal.fire({
        title: '¡Eliminada!',
        text: 'La recompensa ha sido eliminada',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
    }
  }

  const handleToggleActive = (reward) => {
    const updatedRewards = rewards.map(r => 
      r.id === reward.id ? { ...r, active: !r.active } : r
    )
    saveRewards(updatedRewards)
  }

  const filteredRewards = rewards.filter(reward => 
    activeCategory === 'all' || reward.category === activeCategory
  )

  const totalRedemptions = 0 // En un sistema real, esto vendría de la base de datos
  const activeRewards = rewards.filter(r => r.active !== false).length
  const totalPointsRequired = rewards.reduce((sum, r) => sum + r.points, 0)

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
        <h2 className="text-2xl font-bold text-white mb-2">Gestión de Recompensas</h2>
        <p className="text-text-secondary">
          Administra las recompensas que los estudiantes pueden canjear con sus puntos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {rewards.length}
          </div>
          <div className="text-text-secondary text-sm">Recompensas Totales</div>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {activeRewards}
          </div>
          <div className="text-text-secondary text-sm">Activas</div>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {totalRedemptions}
          </div>
          <div className="text-text-secondary text-sm">Canjes Totales</div>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {Math.round(totalPointsRequired / rewards.length || 0)}
          </div>
          <div className="text-text-secondary text-sm">Puntos Promedio</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-surface rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeCategory === cat.key
                  ? 'bg-accent text-background'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                {rewards.filter(r => cat.key === 'all' || r.category === cat.key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Reward Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Recompensa
        </button>
      </div>

      {/* Add Reward Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Nueva Recompensa</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                placeholder="Ej: Cupón 20% Descuento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Puntos Requeridos *
              </label>
              <input
                type="number"
                value={newReward.points}
                onChange={(e) => setNewReward({ ...newReward, points: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                min="0"
                step="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={newReward.category}
                onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
              >
                {categories.filter(c => c.key !== 'all').map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icono
              </label>
              <input
                type="text"
                value={newReward.icon}
                onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                placeholder="🎁"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                rows="3"
                placeholder="Describe la recompensa..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddReward}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Guardar Recompensa
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <div 
            key={reward.id} 
            className={`bg-surface rounded-lg p-6 ${
              reward.active === false ? 'opacity-60' : ''
            }`}
          >
            {editingReward?.id === reward.id ? (
              // Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingReward.name}
                  onChange={(e) => setEditingReward({ ...editingReward, name: e.target.value })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-accent focus:outline-none"
                />
                <input
                  type="number"
                  value={editingReward.points}
                  onChange={(e) => setEditingReward({ ...editingReward, points: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-accent focus:outline-none"
                  min="0"
                  step="50"
                />
                <textarea
                  value={editingReward.description}
                  onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-accent focus:outline-none"
                  rows="2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingReward(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Display Mode
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{reward.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{reward.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reward.category === 'cupones' ? 'bg-purple-900/50 text-purple-400' :
                        reward.category === 'cursos' ? 'bg-blue-900/50 text-blue-400' :
                        reward.category === 'servicios' ? 'bg-green-900/50 text-green-400' :
                        reward.category === 'eventos' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-gray-900/50 text-gray-400'
                      }`}>
                        {reward.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(reward)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      reward.active !== false
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {reward.active !== false ? 'Activa' : 'Inactiva'}
                  </button>
                </div>
                
                <p className="text-text-secondary text-sm mb-4">
                  {reward.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">🏆</span>
                    <span className="text-white font-bold text-lg">{reward.points}</span>
                    <span className="text-text-secondary text-sm">puntos</span>
                  </div>
                  {reward.stock && (
                    <span className="text-sm text-gray-400">
                      Stock: {reward.stock}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReward(reward)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteReward(reward)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RewardsManagement