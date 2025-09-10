import React, { useState, useEffect } from 'react'
import { useConfigStore, useUIStore } from '../../store'
import { Button, Input, Modal } from '../../components/ui'
import apiClient from '../../api/client'

/**
 * ContentManager - CRUD completo de áreas
 * MOMENTO DE LIBERACIÓN TOTAL DEL HARDCODE
 */
const ContentManager = () => {
  const { areas, setAreas, addArea, updateArea, removeArea } = useConfigStore()
  const { showSuccess, showError } = useUIStore()
  
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#98d932',
    icon: '📚',
    isActive: true
  })
  const [formErrors, setFormErrors] = useState({})

  // Cargar áreas al montar
  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      const areasData = await apiClient.get('/areas')
      setAreas(areasData)
    } catch (error) {
      console.error('Error loading areas:', error)
      showError('Error al cargar las áreas')
    } finally {
      setLoading(false)
    }
  }

  // Validaciones
  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido'
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'El slug es requerido'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida'
    }
    
    if (!formData.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.color = 'El color debe ser un código hexadecimal válido'
    }

    // Verificar slug único
    if (areas.some(area => 
      area.slug === formData.slug && 
      (!editingArea || area.id !== editingArea.id)
    )) {
      errors.slug = 'Ya existe un área con este slug'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handlers del formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generar slug desde nombre
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      setFormData(prev => ({ ...prev, slug }))
    }
    
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (editingArea) {
        // Actualizar área existente
        const updatedArea = await apiClient.put(
          `/api/content/areas/${editingArea.id}`,
          { ...formData, id: editingArea.id, updatedAt: new Date().toISOString() }
        )
        updateArea(editingArea.id, updatedArea)
        showSuccess('Área actualizada exitosamente')
      } else {
        // Crear nueva área
        const newArea = await apiClient.post('/api/content/areas', {
          ...formData,
          createdAt: new Date().toISOString()
        })
        addArea(newArea)
        showSuccess('Área creada exitosamente')
      }
      
      closeModal()
    } catch (error) {
      console.error('Error saving area:', error)
      showError(editingArea ? 'Error al actualizar el área' : 'Error al crear el área')
    }
  }

  const handleDelete = async (area) => {
    if (!confirm(`¿Estás seguro de eliminar el área "${area.name}"?`)) return

    try {
      await apiClient.delete(`/api/content/areas/${area.id}`)
      removeArea(area.id)
      showSuccess('Área eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting area:', error)
      showError('Error al eliminar el área')
    }
  }

  const handleToggleActive = async (area) => {
    try {
      const updatedArea = await apiClient.put(`/api/content/areas/${area.id}`, {
        ...area,
        isActive: !area.isActive,
        updatedAt: new Date().toISOString()
      })
      updateArea(area.id, updatedArea)
      showSuccess(`Área ${updatedArea.isActive ? 'activada' : 'desactivada'}`)
    } catch (error) {
      console.error('Error toggling area status:', error)
      showError('Error al cambiar el estado del área')
    }
  }

  // Modal handlers
  const openCreateModal = () => {
    setEditingArea(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#98d932',
      icon: '📚',
      isActive: true
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (area) => {
    setEditingArea(area)
    setFormData(area)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingArea(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#98d932',
      icon: '📚',
      isActive: true
    })
    setFormErrors({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Gestión de Áreas
          </h1>
          <p className="text-text-secondary">
            Configura las áreas de estudio disponibles para los estudiantes
          </p>
        </div>
        
        <Button onClick={openCreateModal}>
          Nueva Área
        </Button>
      </div>

      {/* Areas List */}
      <div className="bg-surface rounded-lg border border-gray-700">
        {areas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No hay áreas configuradas
            </h3>
            <p className="text-text-secondary mb-4">
              Crea la primera área de estudio para empezar
            </p>
            <Button onClick={openCreateModal}>
              Crear Primera Área
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Área</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Descripción</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Color</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.id} className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{area.icon}</span>
                        <div>
                          <div className="font-medium text-text-primary">
                            {area.name}
                          </div>
                          <div className="text-sm text-text-secondary">
                            /{area.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-text-secondary text-sm line-clamp-2">
                        {area.description}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: area.color }}
                        />
                        <span className="text-sm text-text-secondary font-mono">
                          {area.color}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(area)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          area.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {area.isActive ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => openEditModal(area)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDelete(area)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingArea ? 'Editar Área' : 'Nueva Área'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del área"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={formErrors.name}
            placeholder="ej. Metalurgia"
            required
          />

          <Input
            label="Slug (URL amigable)"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            error={formErrors.slug}
            placeholder="ej. metalurgia"
            helperText="Se genera automáticamente desde el nombre"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 bg-surface border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                formErrors.description ? 'border-red-500' : 'border-gray-600'
              }`}
              rows={3}
              placeholder="Descripción del área de estudio..."
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Color (hex)"
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              error={formErrors.color}
            />

            <Input
              label="Icono (emoji)"
              value={formData.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              placeholder="📚"
              maxLength={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
            />
            <label htmlFor="isActive" className="text-sm text-text-primary">
              Área activa (visible para usuarios)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingArea ? 'Actualizar' : 'Crear'} Área
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ContentManager