import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'

const AreaSelection = () => {
  const navigate = useNavigate()
  const { setSelectedArea, generateDeviceId, setGuest } = useAuthStore()
  const [selectedAreaState, setSelectedAreaState] = useState(null)

  const areas = [
    {
      id: 'metalurgia',
      name: 'Metalurgia',
      description: 'Desarrolla aplicaciones web desde cero y haz realidad tu carrera como Web Developer. Sé parte de la industria con los empleos mejor pagados a nivel global.',
      color: 'bg-primary-metalurgia',
      textColor: 'text-primary-metalurgia',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 4L8 16v32l24 12 24-12V16L32 4zm-16 36V24l16-8 16 8v16l-16 8-16-8z"/>
          <path d="M28 20v24l8-4V20l-8 4z"/>
        </svg>
      )
    },
    {
      id: 'mineria',
      name: 'Minería',
      description: 'Especialízate en técnicas de extracción y procesamiento de minerales. Domina las mejores prácticas de la industria minera moderna.',
      color: 'bg-primary-mineria',
      textColor: 'text-primary-mineria',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M8 48h48v8H8zm4-4h40l-4-8H16zm2-12l6-8h20l6 8zm4-16l4-8h12l4 8z"/>
          <rect x="28" y="52" width="8" height="8"/>
        </svg>
      )
    },
    {
      id: 'geologia',
      name: 'Geología',
      description: 'Explora la estructura terrestre y los procesos geológicos. Comprende la formación de minerales y recursos naturales.',
      color: 'bg-primary-geologia',
      textColor: 'text-primary-geologia',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 40c-8.837 0-16-7.163-16-16s7.163-16 16-16 16 7.163 16 16-7.163 16-16 16z"/>
          <circle cx="32" cy="28" r="4"/>
          <path d="M24 40l8-8 8 8"/>
        </svg>
      )
    }
  ]

  const handleAreaSelect = (areaId) => {
    setSelectedAreaState(areaId)
  }

  const handleContinue = () => {
    if (selectedAreaState) {
      // Generar ID de dispositivo para modo invitado
      const deviceId = generateDeviceId()
      
      // Configurar usuario como invitado
      setGuest(deviceId)
      
      // Guardar área seleccionada
      setSelectedArea(selectedAreaState)
      
      // Redirigir al home
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-2xl">M</span>
            </div>
            <span className="text-3xl font-bold text-white">MetSel</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Descubre lo que puedes aprender
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Elige tu área de especialización y comienza tu viaje de aprendizaje
          </p>
        </div>

        {/* Selección de áreas */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {areas.map((area) => (
            <div
              key={area.id}
              onClick={() => handleAreaSelect(area.id)}
              className={`
                relative p-8 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105
                ${selectedAreaState === area.id 
                  ? `${area.color} shadow-2xl` 
                  : 'bg-surface hover:bg-opacity-80 border border-gray-600'
                }
              `}
            >
              {/* Ícono */}
              <div className={`
                flex justify-center mb-6 transition-colors duration-300
                ${selectedAreaState === area.id ? 'text-white' : area.textColor}
              `}>
                {area.icon}
              </div>

              {/* Título */}
              <h3 className={`
                text-2xl font-bold text-center mb-4 transition-colors duration-300
                ${selectedAreaState === area.id ? 'text-white' : 'text-white'}
              `}>
                {area.name}
              </h3>

              {/* Descripción */}
              <p className={`
                text-center leading-relaxed transition-colors duration-300
                ${selectedAreaState === area.id ? 'text-white text-opacity-90' : 'text-text-secondary'}
              `}>
                {area.description}
              </p>

              {/* Indicador de selección */}
              {selectedAreaState === area.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botón de continuar */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedAreaState}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
              ${selectedAreaState
                ? 'bg-accent text-background hover:bg-opacity-90 hover:scale-105 shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {selectedAreaState ? 'Comenzar mi aprendizaje' : 'Selecciona un área para continuar'}
          </button>
        </div>

        {/* Nota informativa */}
        <div className="text-center mt-8">
          <p className="text-text-secondary text-sm">
            Podrás cambiar tu área de especialización en cualquier momento desde tu perfil
          </p>
        </div>
      </div>
    </div>
  )
}

export default AreaSelection