import React, { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { Button, Input, Modal } from '../../components/ui'
import apiClient from '../../api/client'

const LeadManager = () => {
  const { showSuccess, showError } = useUIStore()
  
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    dateRange: 'all',
    search: ''
  })
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [notes, setNotes] = useState('')

  const statusOptions = [
    { value: 'new', label: 'Nuevo', color: 'bg-blue-500' },
    { value: 'contacted', label: 'Contactado', color: 'bg-yellow-500' },
    { value: 'interested', label: 'Interesado', color: 'bg-green-500' },
    { value: 'converted', label: 'Convertido', color: 'bg-accent' },
    { value: 'not_interested', label: 'No Interesado', color: 'bg-red-500' },
    { value: 'follow_up', label: 'Seguimiento', color: 'bg-purple-500' }
  ]

  const sourceLabels = {
    'course_card_click': 'Card de Curso',
    'lead_magnet': 'Lead Magnet',
    'contact_form': 'Formulario Contacto',
    'course_explorer': 'Explorador de Cursos',
    'area_selection': 'Selección de Área'
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const leadsData = await apiClient.get('/leads')
      setLeads(leadsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Error loading leads:', error)
      showError('Error al cargar los leads')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const updatedLead = await apiClient.put(`/api/leads/${leadId}`, {
        ...leads.find(l => l.id === leadId),
        status: newStatus,
        lastContactAt: new Date().toISOString()
      })
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? updatedLead : lead
      ))
      
      showSuccess('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error updating lead status:', error)
      showError('Error al actualizar el estado')
    }
  }

  const handleAddNotes = async () => {
    if (!selectedLead || !notes.trim()) return

    try {
      const updatedNotes = selectedLead.notes 
        ? `${selectedLead.notes}\n\n---\n${new Date().toLocaleString()}: ${notes}`
        : `${new Date().toLocaleString()}: ${notes}`

      const updatedLead = await apiClient.put(`/api/leads/${selectedLead.id}`, {
        ...selectedLead,
        notes: updatedNotes,
        lastContactAt: new Date().toISOString()
      })
      
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      ))
      
      setSelectedLead(updatedLead)
      setNotes('')
      setIsNotesModalOpen(false)
      showSuccess('Notas añadidas correctamente')
    } catch (error) {
      console.error('Error adding notes:', error)
      showError('Error al añadir las notas')
    }
  }

  const handleDelete = async (lead) => {
    if (!confirm(`¿Estás seguro de eliminar el lead de ${lead.name}?`)) return

    try {
      await apiClient.delete(`/api/leads/${lead.id}`)
      setLeads(prev => prev.filter(l => l.id !== lead.id))
      showSuccess('Lead eliminado correctamente')
    } catch (error) {
      console.error('Error deleting lead:', error)
      showError('Error al eliminar el lead')
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = !filters.status || lead.status === filters.status
    const matchesSource = !filters.source || lead.source === filters.source
    const matchesSearch = !filters.search || 
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.phone.includes(filters.search)
    
    let matchesDate = true
    if (filters.dateRange !== 'all') {
      const leadDate = new Date(lead.createdAt)
      const now = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          matchesDate = leadDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = leadDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = leadDate >= monthAgo
          break
      }
    }

    return matchesStatus && matchesSource && matchesSearch && matchesDate
  })

  const getStatusColor = (status) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-500'
  }

  const getStatusLabel = (status) => {
    return statusOptions.find(s => s.value === status)?.label || status
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Gestión de Leads
          </h1>
          <p className="text-text-secondary">
            Administra y da seguimiento a todos los leads capturados ({filteredLeads.length} leads)
          </p>
        </div>

        {/* Stats */}
        <div className="flex space-x-4">
          <div className="bg-surface rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-text-secondary">Total</div>
            <div className="text-xl font-bold text-text-primary">{leads.length}</div>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-text-secondary">Nuevos</div>
            <div className="text-xl font-bold text-blue-400">
              {leads.filter(l => l.status === 'new').length}
            </div>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-gray-700">
            <div className="text-sm text-text-secondary">Convertidos</div>
            <div className="text-xl font-bold text-green-400">
              {leads.filter(l => l.status === 'converted').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface rounded-lg p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Filtros</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Todos los estados</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Origen</label>
            <select
              value={filters.source}
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Todos los orígenes</option>
              {Object.entries(sourceLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Fecha</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>

          <Input
            placeholder="Buscar por nombre, email, teléfono..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      {/* Lista de Leads */}
      <div className="bg-surface rounded-lg border border-gray-700 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No hay leads que mostrar
            </h3>
            <p className="text-text-secondary">
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Contacto</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Interés</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Origen</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-text-primary">{lead.name}</div>
                        <div className="text-sm text-text-secondary">{lead.email}</div>
                        <div className="text-sm text-text-secondary">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-text-primary">{lead.interestedIn || 'General'}</div>
                      <div className="text-sm text-text-secondary">{lead.area}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-text-secondary">
                        {sourceLabels[lead.source] || lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium text-white rounded ${getStatusColor(lead.status)}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => {
                            setSelectedLead(lead)
                            setIsDetailModalOpen(true)
                          }}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => {
                            setSelectedLead(lead)
                            setIsNotesModalOpen(true)
                          }}
                        >
                          Notas
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDelete(lead)}
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

      {/* Modal de Detalles */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalles del Lead"
        size="large"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Información Personal</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Nombre:</span> {selectedLead.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedLead.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {selectedLead.phone}</p>
                  <p><span className="font-medium">Preferencia de contacto:</span> {selectedLead.preferredContact}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Información del Lead</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Área:</span> {selectedLead.area}</p>
                  <p><span className="font-medium">Interesado en:</span> {selectedLead.interestedIn}</p>
                  <p><span className="font-medium">Origen:</span> {sourceLabels[selectedLead.source]}</p>
                  <p><span className="font-medium">Estado:</span> {getStatusLabel(selectedLead.status)}</p>
                </div>
              </div>
            </div>

            {selectedLead.message && (
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Mensaje</h4>
                <p className="text-text-secondary bg-background p-3 rounded-lg">
                  {selectedLead.message}
                </p>
              </div>
            )}

            {selectedLead.notes && (
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Notas de Seguimiento</h4>
                <div className="text-text-secondary bg-background p-3 rounded-lg whitespace-pre-wrap">
                  {selectedLead.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Notas */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        title="Añadir Nota de Seguimiento"
        size="medium"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nueva nota
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              rows={4}
              placeholder="Describe el seguimiento realizado..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsNotesModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddNotes} disabled={!notes.trim()}>
              Añadir Nota
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LeadManager