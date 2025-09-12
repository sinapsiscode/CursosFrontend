import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Input } from '../../components/ui'
import { validateEmail, validatePhone } from '../../utils/testUtils'
import apiClient from '../../api/client'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const Register = () => {
  const navigate = useNavigate()
  const { login, setSelectedArea } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [hardcodedValues, setHardcodedValues] = useState(null)

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
      }
    }
    loadHardcodedValues()
  }, [])
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    phone: '',
    // Step 2: Password
    password: '',
    confirmPassword: '',
    // Step 3: Preferences
    area: '',
    interests: [],
    acceptTerms: false,
    acceptMarketing: false
  })
  const [errors, setErrors] = useState({})
  const [areas, setAreas] = useState([])

  React.useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      const data = await apiClient.get('/areas')
      setAreas(data)
    } catch (error) {
      console.error('Error loading areas:', error)
    }
  }

  const validateStep = (stepNumber) => {
    const newErrors = {}
    
    if (stepNumber === 1) {
      if (!formData.name) {
        newErrors.name = 'El nombre es requerido'
      } else if (formData.name.length < 3) {
        newErrors.name = 'El nombre debe tener al menos 3 caracteres'
      }
      
      if (!formData.email) {
        newErrors.email = 'El email es requerido'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Email inválido'
      }
      
      if (!formData.phone) {
        newErrors.phone = 'El teléfono es requerido'
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Teléfono inválido'
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida'
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener mayúsculas, minúsculas y números'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }
    
    if (stepNumber === 3) {
      if (!formData.area) {
        newErrors.area = 'Selecciona un área de interés'
      }
      
      // Términos opcionales para testing
      // if (!formData.acceptTerms) {
      //   newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
      // }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('=== INICIANDO REGISTRO ===')
    console.log('Datos del formulario:', formData)
    
    if (!validateStep(3)) {
      console.log('Validación del paso 3 falló')
      return
    }
    
    setLoading(true)
    try {
      // Crear usuario en la base de datos
      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // En producción, esto debería estar hasheado
        role: 'user',
        avatar: null,
        points: 100, // Puntos de bienvenida
        area: formData.area,
        interests: formData.interests,
        acceptMarketing: formData.acceptMarketing,
        createdAt: new Date().toISOString()
      }
      
      console.log('Usuario a crear:', newUser)
      console.log('Enviando a:', '/users')
      
      // Guardar usuario en JSON Server
      const savedUser = await apiClient.post('/users', newUser)
      console.log('Usuario guardado:', savedUser)
      
      // Guardar lead si acepta marketing
      if (formData.acceptMarketing) {
        await apiClient.post('/leads', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          area: formData.area,
          source: 'registration',
          status: 'new',
          preferredContact: 'email',
          createdAt: new Date().toISOString()
        })
      }
      
      // Auto-login con el usuario guardado
      login(savedUser, true)
      setSelectedArea(formData.area)
      
      showSuccess('¡Cuenta creada exitosamente! Bienvenido a MetSel Academy')
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Error al registrar:', error)
      showError(error.message || 'Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const getPasswordStrength = () => {
    const pass = formData.password
    if (!pass) return 0
    
    let strength = 0
    if (pass.length >= 8) strength++
    if (pass.length >= 12) strength++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[^a-zA-Z\d]/.test(pass)) strength++
    
    return strength
  }

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength()
    if (strength === 0) return ''
    if (strength <= 2) return 'Débil'
    if (strength <= 3) return 'Media'
    if (strength <= 4) return 'Fuerte'
    return 'Muy fuerte'
  }

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength()
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-green-500'
    return 'bg-green-600'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            MetSel Academy
          </h1>
          <h2 className="text-2xl font-semibold text-text-primary">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-text-secondary">
            Únete a nuestra comunidad de aprendizaje
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex-1 h-1 ${step >= 1 ? 'bg-accent' : 'bg-gray-600'} rounded`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
              step >= 1 ? 'bg-accent text-white' : 'bg-gray-600 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-accent' : 'bg-gray-600'} rounded`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
              step >= 2 ? 'bg-accent text-white' : 'bg-gray-600 text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-accent' : 'bg-gray-600'} rounded`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
              step >= 3 ? 'bg-accent text-white' : 'bg-gray-600 text-gray-400'
            }`}>
              3
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-accent' : 'bg-gray-600'} rounded`}></div>
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Información Personal
              </h3>
              
              <Input
                label="Nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Juan Pérez"
                autoFocus
                required
              />

              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="juan@email.com"
                required
              />

              <Input
                type="tel"
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder={hardcodedValues?.placeholders?.phone || "+51 999 999 999"}
                required
              />

              <div className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Crear Contraseña
              </h3>
              
              <div>
                <Input
                  type="password"
                  label="Contraseña"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="••••••••"
                  autoFocus
                  required
                />
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">Fortaleza:</span>
                      <span className={`text-xs font-medium ${
                        getPasswordStrength() <= 2 ? 'text-red-400' :
                        getPasswordStrength() <= 3 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {getPasswordStrengthLabel()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                type="password"
                label="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                placeholder="••••••••"
                required
              />

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-400">Requisitos de contraseña:</p>
                <ul className="text-xs text-text-secondary mt-1 space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-400' : ''}>
                    • Mínimo 8 caracteres
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>
                    • Al menos una mayúscula
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>
                    • Al menos una minúscula
                  </li>
                  <li className={/\d/.test(formData.password) ? 'text-green-400' : ''}>
                    • Al menos un número
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Preferencias
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Área de interés principal
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="">Selecciona un área</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.slug}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <p className="mt-1 text-sm text-red-400">{errors.area}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Otros intereses (opcional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Desarrollo Web', 'Data Science', 'Marketing Digital', 'Diseño', 'Mobile', 'DevOps'].map(interest => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="rounded border-gray-600 text-accent focus:ring-accent"
                      />
                      <span className="text-sm text-text-primary">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-600 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">
                    Acepto los{' '}
                    <Link to="/terms" className="text-accent hover:underline">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link to="/privacy" className="text-accent hover:underline">
                      política de privacidad
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-400">{errors.acceptTerms}</p>
                )}

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptMarketing}
                    onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                    className="mt-1 rounded border-gray-600 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-text-secondary">
                    Quiero recibir ofertas, descuentos y novedades por email
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent-dark">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register