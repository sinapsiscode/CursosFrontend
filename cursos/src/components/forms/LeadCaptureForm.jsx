import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Input, Modal } from '../ui'
import apiClient from '../../api/client'
import { whatsappService } from '../../services/whatsappService'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const LeadCaptureForm = ({ 
  isOpen, 
  onClose, 
  course = null,
  area = null,
  trigger = 'unknown',
  examResults = null
}) => {
  const { selectedArea, guestMode } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  const [hardcodedValues, setHardcodedValues] = useState({})

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
        setHardcodedValues({
          placeholders: {
            email: 'tu@email.com',
            phone: '+51 999 999 999'
          }
        })
      }
    }
    loadHardcodedValues()
  }, [])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interestedIn: course?.title || '',
    preferredContact: 'whatsapp'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^\+?[\d\s-()]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const leadData = {
        ...formData,
        area: area || selectedArea,
        courseId: course?.id,
        source: trigger,
        status: 'new',
        createdAt: new Date().toISOString(),
        examResults: examResults,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          guestMode,
          ...(examResults && {
            examScore: examResults.totalPoints,
            examDiscount: examResults.discount,
            examCompletedAt: examResults.completedAt
          })
        }
      }

      const newLead = await apiClient.post('/api/leads', leadData)
      
      // Enviar notificación por WhatsApp
      await whatsappService.notifyNewLead(newLead)
      
      // Si completó examen, enviar resultados por WhatsApp
      if (examResults && formData.preferredContact === 'whatsapp') {
        await whatsappService.sendExamResults(newLead, examResults)
      }
      
      showSuccess('¡Información enviada correctamente! Te contactaremos pronto.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        interestedIn: course?.title || '',
        preferredContact: 'whatsapp'
      })
      
      onClose()
      
    } catch (error) {
      console.error('Error submitting lead:', error)
      showError('Error al enviar la información. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitar Información"
      size="medium"
    >
      <div className="mb-4">
        {examResults ? (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-accent mb-2">
              🎉 ¡Felicidades por completar el examen!
            </h3>
            <p className="text-text-secondary text-sm">
              Obtuviste <strong>{examResults.totalPoints} puntos</strong> y ganaste un 
              <strong className="text-accent"> {examResults.discount}% de descuento</strong>. 
              Déjanos tus datos para enviarte el código de descuento.
            </p>
          </div>
        ) : (
          <p className="text-text-secondary">
            {course 
              ? `Interesado en: ${course.title}`
              : 'Cuéntanos sobre tu interés en nuestros cursos'
            }
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Tu nombre"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder={hardcodedValues?.placeholders?.email || 'tu@email.com'}
            required
          />
        </div>

        <Input
          label="Teléfono"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder={hardcodedValues?.placeholders?.phone || '+51 999 999 999'}
          required
        />

        <Input
          label="¿En qué curso estás interesado?"
          value={formData.interestedIn}
          onChange={(e) => handleInputChange('interestedIn', e.target.value)}
          placeholder="Curso específico o área de interés"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-primary">
            Mensaje adicional
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            rows={3}
            placeholder="Cuéntanos más sobre tus objetivos..."
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-primary">
            Forma preferida de contacto
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="whatsapp"
                checked={formData.preferredContact === 'whatsapp'}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                className="mr-2"
              />
              <span className="text-text-primary text-sm">WhatsApp</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="email"
                checked={formData.preferredContact === 'email'}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                className="mr-2"
              />
              <span className="text-text-primary text-sm">Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preferredContact"
                value="phone"
                checked={formData.preferredContact === 'phone'}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                className="mr-2"
              />
              <span className="text-text-primary text-sm">Llamada</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-text-secondary">
          Al enviar este formulario aceptas que nos comuniquemos contigo para brindarte información sobre nuestros cursos.
        </p>
      </div>
    </Modal>
  )
}

export default LeadCaptureForm