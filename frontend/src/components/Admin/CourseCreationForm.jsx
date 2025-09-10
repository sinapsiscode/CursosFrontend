import { useState, useRef, useMemo, useCallback } from 'react'
import { useUIStore } from '../../store'

const CourseCreationForm = ({ onClose, onSave, editingCourse = null, activeAreas = [], levels = [] }) => {
  const { showToast } = useUIStore()
  
  // Crear una clave única para este componente para prevenir re-inicializaciones
  const componentKey = useRef(`course-form-${Date.now()}-${Math.random()}`).current
  
  // Estado principal del formulario con protección contra re-inicialización
  const initialFormData = useMemo(() => {
    const defaultArea = activeAreas?.[0]?.key || 'metalurgia'
    const defaultLevel = levels?.[0]?.key || 'basico'
    
    const initialData = {
      title: editingCourse?.title || '',
      instructor: editingCourse?.instructor || '',
      area: editingCourse?.area || defaultArea,
      level: editingCourse?.level || defaultLevel,
      duration: editingCourse?.duration || 180,
      thumbnail: editingCourse?.thumbnail || '',
      description: editingCourse?.description || '',
      price: editingCourse?.price || 0,
      points: editingCourse?.points || 100, // Puntos estándar por defecto
      isDemo: editingCourse?.isDemo || false,
      featured: editingCourse?.featured || false,
      popular: editingCourse?.popular || false,
      isNew: editingCourse?.isNew || false,
      status: editingCourse?.status || 'draft',
      publishedAt: editingCourse?.publishedAt || null,
      enableEnrollment: editingCourse?.enableEnrollment !== false,
      enableComments: editingCourse?.enableComments !== false,
      enableRating: editingCourse?.enableRating !== false,
      maxParticipants: editingCourse?.maxParticipants || 50,
      enrollmentUrl: editingCourse?.enrollmentUrl || ''
    }
    
    console.log('🔧 Inicializando formulario con clave:', componentKey, { initialData, activeAreas: activeAreas?.length, levels: levels?.length })
    return initialData
  }, [editingCourse, activeAreas, levels, componentKey])

  const [formData, setFormData] = useState(initialFormData)
  
  // Función estable para actualizar formData
  const updateFormData = useCallback((updates) => {
    console.log('📝 Actualizando formData:', { componentKey, updates })
    setFormData(prevData => {
      const newData = typeof updates === 'function' ? updates(prevData) : { ...prevData, ...updates }
      console.log('✅ FormData actualizado exitosamente')
      return newData
    })
  }, [componentKey])

  // Estado para lecciones con protección
  const initialLessons = useMemo(() => editingCourse?.lessons || [], [editingCourse])
  const [lessons, setLessons] = useState(initialLessons)
  
  // Estado para materiales con protección  
  const initialMaterials = useMemo(() => editingCourse?.materials || [], [editingCourse])
  const [materials, setMaterials] = useState(initialMaterials)
  
  // Estado para archivos subidos
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [uploadProgress, setUploadProgress] = useState({})
  
  // Estado del formulario
  const [activeTab, setActiveTab] = useState('basic')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Referencias para inputs de archivos
  const thumbnailInputRef = useRef()
  const materialInputRef = useRef()
  const videoInputRef = useRef()

  // Simular subida de archivos
  const simulateFileUpload = (file, type, callback) => {
    try {
      const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const fileName = file.name
      
      console.log('📤 Simulando subida:', { fileId, fileName, type })
      
      // Simular progreso de subida
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0
          if (currentProgress >= 100) {
            clearInterval(interval)
            
            try {
              // Simular URL final del archivo
              const fileUrl = `https://storage.metsel.edu.co/${type}/${fileId}_${fileName}`
              setUploadedFiles(prev => ({
                ...prev,
                [fileId]: { name: fileName, url: fileUrl, type, size: file.size }
              }))
              
              console.log('✅ Subida simulada completada:', { fileId, fileUrl })
              
              if (callback && typeof callback === 'function') {
                callback(fileUrl, fileId)
              } else {
                console.warn('⚠️ Callback no es una función:', callback)
              }
              
              // Limpiar progreso
              setTimeout(() => {
                setUploadProgress(prev => {
                  const newPrev = { ...prev }
                  delete newPrev[fileId]
                  return newPrev
                })
              }, 1000)
              
            } catch (callbackError) {
              console.error('❌ Error en callback de subida:', callbackError)
              showToast('Error al procesar archivo subido', 'error')
            }
            
            return prev
          }
          
          return { ...prev, [fileId]: currentProgress + Math.random() * 20 }
        })
      }, 200)
      
      return fileId
    } catch (error) {
      console.error('❌ Error en simulateFileUpload:', error)
      showToast('Error en la simulación de subida', 'error')
      return null
    }
  }

  // SOLID: Single Responsibility - Función PURA para calcular validaciones
  const calculateValidationErrors = useCallback((formData, lessons) => {
    const newErrors = {}
    
    console.log('🔍 Calculando validaciones:', { 
      componentKey, 
      formData: formData?.title || 'Sin título', 
      lessonsCount: lessons?.length || 0 
    })
    
    // Validaciones de campos básicos
    if (!formData.title?.trim()) newErrors.title = 'El título es obligatorio'
    if (!formData.instructor?.trim()) newErrors.instructor = 'El instructor es obligatorio'
    if (!formData.description?.trim()) newErrors.description = 'La descripción es obligatoria'
    if (!formData.area) newErrors.area = 'El área es obligatoria'
    if (!formData.level) newErrors.level = 'El nivel es obligatorio'
    if (!formData.duration || formData.duration < 1) newErrors.duration = 'La duración debe ser mayor a 0'
    if (formData.price < 0) newErrors.price = 'El precio no puede ser negativo'
    
    // Validaciones de lecciones
    if (!lessons || lessons.length === 0) {
      newErrors.lessons = 'Debe agregar al menos una lección'
      console.log('❌ Error: Sin lecciones')
    } else {
      lessons.forEach((lesson, index) => {
        if (!lesson.title?.trim()) {
          newErrors[`lesson_${index}_title`] = 'El título de la lección es obligatorio'
        }
        if (!lesson.duration || lesson.duration < 1) {
          newErrors[`lesson_${index}_duration`] = 'La duración debe ser mayor a 0'
        }
      })
    }

    console.log('🔍 Errores calculados:', newErrors)
    return newErrors
  }, [componentKey])

  // SOLID: Single Responsibility - Función para actualizar estado UI
  const updateValidationState = useCallback((validationErrors) => {
    console.log('🎨 Actualizando estado de validación UI:', validationErrors)
    setErrors(validationErrors)
  }, [])

  // SOLID: Composite - Función que coordina validación completa
  const validateForm = useCallback(() => {
    const validationErrors = calculateValidationErrors(formData, lessons)
    updateValidationState(validationErrors)
    return validationErrors
  }, [calculateValidationErrors, updateValidationState, formData, lessons])

  // Manejo de archivos
  const handleFileUpload = (event, type, callback) => {
    try {
      console.log('📁 Iniciando subida de archivo:', { type, event })
      
      const file = event.target.files[0]
      if (!file) {
        console.log('❌ No se seleccionó archivo')
        return
      }

      console.log('📁 Archivo seleccionado:', { name: file.name, size: file.size, type: file.type })

      // Validaciones de archivo
      const maxSize = type === 'video' ? 500 * 1024 * 1024 : 10 * 1024 * 1024 // 500MB para videos, 10MB para otros
      if (file.size > maxSize) {
        console.log('❌ Archivo muy grande:', file.size, 'vs', maxSize)
        showToast(`El archivo es muy grande. Máximo ${type === 'video' ? '500' : '10'}MB`, 'error')
        return
      }

      const allowedTypes = {
        image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
        pdf: ['application/pdf'],
        document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }

      if (!allowedTypes[type]?.includes(file.type)) {
        console.log('❌ Tipo no permitido:', file.type, 'para', type)
        showToast(`Tipo de archivo no permitido para ${type}`, 'error')
        return
      }

      console.log('✅ Archivo válido, iniciando simulación de subida')
      simulateFileUpload(file, type, callback)
      showToast(`Subiendo ${file.name}...`, 'info')
      
    } catch (error) {
      console.error('❌ Error en handleFileUpload:', error)
      showToast('Error al procesar el archivo', 'error')
    }
  }

  // Gestión de lecciones
  const addLesson = useCallback(() => {
    setLessons(prevLessons => {
      console.log('➕ Agregando nueva lección - Estado actual:', prevLessons.length, 'lecciones')
      const newLessons = [...prevLessons, {
        id: Date.now(),
        title: '',
        duration: 15,
        videoUrl: '',
        videoFileId: '',
        isFree: false,
        description: '',
        materials: []
      }]
      console.log('✅ Lección agregada - Total:', newLessons.length, 'lecciones')
      return newLessons
    })
  }, [componentKey])

  const updateLesson = useCallback((index, field, value) => {
    try {
      console.log('📖 Actualizando lección:', { componentKey, index, field, value })
      setLessons(prevLessons => {
        const updatedLessons = prevLessons.map((lesson, i) => 
          i === index ? { ...lesson, [field]: value } : lesson
        )
        console.log('✅ Lección actualizada exitosamente:', updatedLessons.length, 'lecciones')
        return updatedLessons
      })
    } catch (error) {
      console.error('❌ Error en updateLesson:', error)
      showToast('Error al actualizar lección', 'error')
    }
  }, [componentKey, showToast])

  const removeLesson = useCallback((index) => {
    console.log('➖ Eliminando lección:', { componentKey, index })
    setLessons(prevLessons => prevLessons.filter((_, i) => i !== index))
  }, [componentKey])

  // Gestión de materiales
  const addMaterial = useCallback(() => {
    setMaterials(prevMaterials => {
      console.log('➕ Agregando nuevo material - Estado actual:', prevMaterials.length, 'materiales')
      const newMaterials = [...prevMaterials, {
        id: Date.now(),
        name: '',
        type: 'pdf',
        url: '',
        fileId: '',
        description: ''
      }]
      console.log('✅ Material agregado - Total:', newMaterials.length, 'materiales')
      return newMaterials
    })
  }, [componentKey])

  const updateMaterial = useCallback((index, field, value) => {
    try {
      console.log('📄 Actualizando material:', { componentKey, index, field, value })
      setMaterials(prevMaterials => {
        const updatedMaterials = prevMaterials.map((material, i) => 
          i === index ? { ...material, [field]: value } : material
        )
        console.log('✅ Material actualizado exitosamente:', updatedMaterials.length, 'materiales')
        return updatedMaterials
      })
    } catch (error) {
      console.error('❌ Error en updateMaterial:', error)
      showToast('Error al actualizar material', 'error')
    }
  }, [componentKey, showToast])

  const removeMaterial = useCallback((index) => {
    console.log('➖ Eliminando material:', { componentKey, index })
    setMaterials(prevMaterials => prevMaterials.filter((_, i) => i !== index))
  }, [componentKey])

  // Envío del formulario
  // SOLID: Single Responsibility - Manejo de envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    console.log('📋 Iniciando validación del formulario:', {
      componentKey,
      formData: formData?.title || 'Sin título',
      lessons: lessons?.length || 0,
      materials: materials?.length || 0
    })
    
    // SOLID: Dependency Inversion - Usar función de validación abstracta
    const validationErrors = validateForm()
    const hasValidationErrors = Object.keys(validationErrors).length > 0
    
    if (hasValidationErrors) {
      console.log('❌ Errores de validación encontrados:', validationErrors)
      showToast('Por favor corrige los errores en el formulario', 'error')
      
      // SOLID: Open/Closed - Logging extensible de errores
      Object.entries(validationErrors).forEach(([field, error]) => {
        console.log(`  📍 ${field}: ${error}`)
      })
      
      return // SOLID: Single Exit Point - Parar ejecución aquí
    }
    
    console.log('✅ Validación exitosa, procediendo con guardado...')
    
    setIsSubmitting(true)
    
    try {
      const courseData = {
        ...formData,
        lessons: (lessons || []).map(lesson => ({
          ...lesson,
          materials: lesson.materials || []
        })),
        materials: materials || [],
        createdAt: editingCourse?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      console.log('📚 Enviando datos del curso:', courseData)
      
      await onSave(courseData)
      showToast(editingCourse ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente', 'success')
      onClose()
      
    } catch (error) {
      console.error('❌ Error saving course:', error)
      showToast(`Error al guardar el curso: ${error.message || 'Error desconocido'}`, 'error')
    } finally {
      setIsSubmitting(false)
      console.log('🏁 Proceso de guardado finalizado')
    }
  }, [
    componentKey, 
    formData, 
    lessons, 
    materials, 
    validateForm, 
    editingCourse, 
    onSave, 
    onClose, 
    showToast
  ])

  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: '📝' },
    { id: 'content', label: 'Contenido y Lecciones', icon: '📚' },
    { id: 'materials', label: 'Materiales', icon: '📄' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' }
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-blue-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h2>
          <p className="text-white/90 text-sm">
            {editingCourse ? 'Modifica la información del curso' : 'Completa todos los campos para crear un curso completo'}
          </p>
        </div>

        {/* Navegación de pestañas */}
        <div className="border-b border-gray-700 bg-background">
          <nav className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-accent text-accent bg-surface'
                    : 'text-gray-400 hover:text-white hover:bg-surface/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido del formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* Pestaña: Información Básica */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título del Curso *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.title ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Ej: Fundamentos de Metalurgia"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => updateFormData({ instructor: e.target.value })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.instructor ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Dr. Juan Pérez"
                  />
                  {errors.instructor && <p className="text-red-400 text-sm mt-1">{errors.instructor}</p>}
                </div>

                {/* Área */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Área *
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => updateFormData({ area: e.target.value })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.area ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    {activeAreas.map(area => (
                      <option key={area.key} value={area.key}>
                        {area.icon} {area.name}
                      </option>
                    ))}
                  </select>
                  {errors.area && <p className="text-red-400 text-sm mt-1">{errors.area}</p>}
                </div>

                {/* Nivel */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nivel *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => updateFormData({ level: e.target.value })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.level ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    {levels.map(level => (
                      <option key={level.key} value={level.key}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                  {errors.level && <p className="text-red-400 text-sm mt-1">{errors.level}</p>}
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración (minutos) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => updateFormData({ duration: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.duration ? 'border-red-500' : 'border-gray-600'
                    }`}
                    min="1"
                  />
                  {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.price ? 'border-red-500' : 'border-gray-600'
                    }`}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* N° de participantes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    N° de participantes
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => updateFormData({ maxParticipants: parseInt(e.target.value) || 50 })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.maxParticipants ? 'border-red-500' : 'border-gray-600'
                    }`}
                    min="1"
                    placeholder="50"
                  />
                  {errors.maxParticipants && <p className="text-red-400 text-sm mt-1">{errors.maxParticipants}</p>}
                </div>

                {/* Puntos de Fidelización */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Puntos de Fidelización
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => updateFormData({ points: parseInt(e.target.value) || 100 })}
                    className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.points ? 'border-red-500' : 'border-gray-600'
                    }`}
                    min="0"
                    step="10"
                    placeholder="100"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Puntos que el estudiante ganará al completar este curso
                  </p>
                  {errors.points && <p className="text-red-400 text-sm mt-1">{errors.points}</p>}
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen de Portada
                </label>
                <div className="space-y-4">
                  {formData.thumbnail && (
                    <div className="flex items-center space-x-4">
                      <img 
                        src={formData.thumbnail} 
                        alt="Portada actual" 
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => updateFormData({ thumbnail: '' })}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Eliminar imagen
                      </button>
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                      className="flex-1 px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="URL de la imagen o sube un archivo"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('🔘 Botón de subida de imagen clickeado')
                        
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.style.display = 'none'
                        
                        input.onchange = (fileEvent) => {
                          fileEvent.preventDefault()
                          fileEvent.stopPropagation()
                          
                          try {
                            console.log('🖼️ Subiendo imagen de portada')
                            
                            // Asegurar que no hay propagación de eventos
                            setTimeout(() => {
                              try {
                                handleFileUpload(fileEvent, 'image', (url, fileId) => {
                                  try {
                                    console.log('🖼️ Callback de imagen:', { url, fileId })
                                    
                                    // Usar setTimeout para evitar problemas de re-render
                                    setTimeout(() => {
                                      updateFormData({ thumbnail: url })
                                      console.log('✅ Imagen de portada actualizada exitosamente')
                                    }, 0)
                                    
                                  } catch (updateError) {
                                    console.error('❌ Error actualizando imagen:', updateError)
                                    showToast('Error al actualizar imagen', 'error')
                                  }
                                })
                              } catch (uploadError) {
                                console.error('❌ Error en subida de imagen:', uploadError)
                                showToast('Error al subir imagen', 'error')
                              }
                            }, 0)
                            
                          } catch (outerError) {
                            console.error('❌ Error externo en subida de imagen:', outerError)
                            showToast('Error en el proceso de subida de imagen', 'error')
                          } finally {
                            // Limpiar el input
                            if (input.parentNode) {
                              input.parentNode.removeChild(input)
                            }
                          }
                        }
                        
                        // Agregar al DOM temporalmente
                        document.body.appendChild(input)
                        input.click()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Subir Imagen
                    </button>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows="4"
                  className={`w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Describe lo que los estudiantes aprenderán en este curso..."
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

            </div>
          )}

          {/* Pestaña: Contenido y Lecciones */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Lecciones del Curso</h3>
                <button
                  type="button"
                  onClick={addLesson}
                  className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  + Agregar Lección
                </button>
              </div>

              {errors.lessons && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400">{errors.lessons}</p>
                </div>
              )}

              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-background rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-medium">Lección {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Título de lección */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título *
                        </label>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(index, 'title', e.target.value)}
                          className={`w-full px-4 py-2 bg-surface border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                            errors[`lesson_${index}_title`] ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Título de la lección"
                        />
                        {errors[`lesson_${index}_title`] && <p className="text-red-400 text-sm mt-1">{errors[`lesson_${index}_title`]}</p>}
                      </div>

                      {/* Duración de lección */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Duración (minutos) *
                        </label>
                        <input
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(index, 'duration', parseInt(e.target.value) || 0)}
                          className={`w-full px-4 py-2 bg-surface border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent ${
                            errors[`lesson_${index}_duration`] ? 'border-red-500' : 'border-gray-600'
                          }`}
                          min="1"
                        />
                        {errors[`lesson_${index}_duration`] && <p className="text-red-400 text-sm mt-1">{errors[`lesson_${index}_duration`]}</p>}
                      </div>
                    </div>

                    {/* Video de la lección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Video de la Lección
                      </label>
                      <div className="space-y-2">
                        <div className="flex space-x-4">
                          <input
                            type="url"
                            value={lesson.videoUrl}
                            onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                            className="flex-1 px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="URL del video o sube un archivo"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('🔘 Botón de subida de video clickeado para lección', index)
                              
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'video/*'
                              input.style.display = 'none'
                              
                              input.onchange = (fileEvent) => {
                                fileEvent.preventDefault()
                                fileEvent.stopPropagation()
                                
                                try {
                                  console.log('🎥 Subiendo video para lección', index)
                                  
                                  // Asegurar que no hay propagación de eventos
                                  setTimeout(() => {
                                    try {
                                      handleFileUpload(fileEvent, 'video', (url, fileId) => {
                                        try {
                                          console.log('🎥 Callback de video:', { url, fileId, index })
                                          
                                          // Usar setTimeout para evitar problemas de re-render
                                          setTimeout(() => {
                                            updateLesson(index, 'videoUrl', url)
                                            updateLesson(index, 'videoFileId', fileId)
                                            console.log('✅ Video de lección actualizado exitosamente')
                                          }, 0)
                                          
                                        } catch (updateError) {
                                          console.error('❌ Error actualizando video:', updateError)
                                          showToast('Error al actualizar video', 'error')
                                        }
                                      })
                                    } catch (uploadError) {
                                      console.error('❌ Error en subida de video:', uploadError)
                                      showToast('Error al subir video', 'error')
                                    }
                                  }, 0)
                                  
                                } catch (outerError) {
                                  console.error('❌ Error externo en subida de video:', outerError)
                                  showToast('Error en el proceso de subida de video', 'error')
                                } finally {
                                  // Limpiar el input
                                  if (input.parentNode) {
                                    input.parentNode.removeChild(input)
                                  }
                                }
                              }
                              
                              // Agregar al DOM temporalmente
                              document.body.appendChild(input)
                              input.click()
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Subir Video
                          </button>
                        </div>
                        {lesson.videoFileId && uploadProgress[lesson.videoFileId] !== undefined && (
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-accent h-2 rounded-full transition-all" 
                              style={{ width: `${uploadProgress[lesson.videoFileId]}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Descripción de lección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={lesson.description || ''}
                        onChange={(e) => updateLesson(index, 'description', e.target.value)}
                        rows="2"
                        className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Breve descripción de lo que se verá en esta lección..."
                      />
                    </div>

                    {/* Configuraciones de lección */}
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={lesson.isFree}
                          onChange={(e) => updateLesson(index, 'isFree', e.target.checked)}
                          className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <span className="text-gray-300 text-sm">Lección gratuita</span>
                      </label>
                    </div>
                  </div>
                ))}

                {lessons.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>No hay lecciones agregadas</p>
                    <p className="text-sm">Haz clic en "Agregar Lección" para comenzar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pestaña: Materiales */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Materiales del Curso</h3>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  + Agregar Material
                </button>
              </div>

              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div key={material.id} className="bg-background rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-medium">Material {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Nombre del material */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre del Material
                        </label>
                        <input
                          type="text"
                          value={material.name}
                          onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="Ej: Manual de Referencia.pdf"
                        />
                      </div>

                      {/* Tipo de material */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tipo
                        </label>
                        <select
                          value={material.type}
                          onChange={(e) => updateMaterial(index, 'type', e.target.value)}
                          className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="pdf">PDF</option>
                          <option value="document">Documento</option>
                          <option value="excel">Excel</option>
                          <option value="presentation">Presentación</option>
                          <option value="image">Imagen</option>
                          <option value="video">Video</option>
                          <option value="audio">Audio</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>
                    </div>

                    {/* Archivo del material */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Archivo
                      </label>
                      <div className="space-y-2">
                        <div className="flex space-x-4">
                          <input
                            type="url"
                            value={material.url}
                            onChange={(e) => updateMaterial(index, 'url', e.target.value)}
                            className="flex-1 px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="URL del archivo o sube un archivo"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('🔘 Botón de subida clickeado para material', index)
                              
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = material.type === 'pdf' ? '.pdf' : '*/*'
                              input.style.display = 'none'
                              
                              input.onchange = (fileEvent) => {
                                fileEvent.preventDefault()
                                fileEvent.stopPropagation()
                                
                                try {
                                  console.log('📎 Subiendo archivo para material', index)
                                  
                                  // Asegurar que no hay propagación de eventos
                                  setTimeout(() => {
                                    try {
                                      handleFileUpload(fileEvent, 'document', (url, fileId) => {
                                        try {
                                          console.log('📎 Callback de material:', { url, fileId, index })
                                          
                                          // Usar setTimeout para evitar problemas de re-render
                                          setTimeout(() => {
                                            updateMaterial(index, 'url', url)
                                            updateMaterial(index, 'fileId', fileId)
                                            console.log('✅ Material actualizado exitosamente')
                                          }, 0)
                                          
                                        } catch (updateError) {
                                          console.error('❌ Error actualizando material:', updateError)
                                          showToast('Error al actualizar material', 'error')
                                        }
                                      })
                                    } catch (uploadError) {
                                      console.error('❌ Error en subida de material:', uploadError)
                                      showToast('Error al subir archivo', 'error')
                                    }
                                  }, 0)
                                  
                                } catch (outerError) {
                                  console.error('❌ Error externo en subida:', outerError)
                                  showToast('Error en el proceso de subida', 'error')
                                } finally {
                                  // Limpiar el input
                                  if (input.parentNode) {
                                    input.parentNode.removeChild(input)
                                  }
                                }
                              }
                              
                              // Agregar al DOM temporalmente
                              document.body.appendChild(input)
                              input.click()
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Subir Archivo
                          </button>
                        </div>
                        {material.fileId && uploadProgress[material.fileId] !== undefined && (
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-accent h-2 rounded-full transition-all" 
                              style={{ width: `${uploadProgress[material.fileId]}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Descripción del material */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={material.description || ''}
                        onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                        rows="2"
                        className="w-full px-4 py-2 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Breve descripción de este material..."
                      />
                    </div>
                  </div>
                ))}

                {materials.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No hay materiales agregados</p>
                    <p className="text-sm">Agrega PDFs, documentos, presentaciones y más</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pestaña: Configuración */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Configuración del Curso</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Estados del curso */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">Estado de Publicación</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estado del Curso
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => updateFormData({ 
                            status: e.target.value,
                            publishedAt: e.target.value === 'published' && !formData.publishedAt 
                              ? new Date().toISOString() 
                              : formData.publishedAt
                          })}
                          className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          <option value="draft">📝 Borrador</option>
                          <option value="published">✅ Publicado</option>
                          <option value="archived">📦 Archivado</option>
                          <option value="maintenance">🔧 Mantenimiento</option>
                        </select>
                        <p className="text-gray-400 text-xs mt-1">
                          Solo los cursos publicados son visibles para los estudiantes
                        </p>
                      </div>
                      
                      {formData.status === 'published' && formData.publishedAt && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <p className="text-green-400 text-sm">
                            📅 Publicado el: {new Date(formData.publishedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-4">Configuraciones de Funcionalidad</h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.enableEnrollment}
                          onChange={(e) => updateFormData({ enableEnrollment: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Permitir Inscripciones</span>
                          <p className="text-gray-400 text-sm">Los estudiantes pueden inscribirse al curso</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.enableComments}
                          onChange={(e) => updateFormData({ enableComments: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Permitir Comentarios</span>
                          <p className="text-gray-400 text-sm">Los estudiantes pueden comentar en las lecciones</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.enableRating}
                          onChange={(e) => updateFormData({ enableRating: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Permitir Calificaciones</span>
                          <p className="text-gray-400 text-sm">Los estudiantes pueden calificar el curso</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-4">Etiquetas y Promociones</h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.isDemo}
                          onChange={(e) => updateFormData({ isDemo: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Curso Demo</span>
                          <p className="text-gray-400 text-sm">Permite acceso gratuito a algunas lecciones</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => updateFormData({ featured: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Curso Destacado</span>
                          <p className="text-gray-400 text-sm">Aparece en la sección de cursos destacados</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.popular}
                          onChange={(e) => updateFormData({ popular: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Curso Popular</span>
                          <p className="text-gray-400 text-sm">Marca el curso como popular</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.isNew}
                          onChange={(e) => updateFormData({ isNew: e.target.checked })}
                          className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
                        />
                        <div>
                          <span className="text-white">Curso Nuevo</span>
                          <p className="text-gray-400 text-sm">Muestra badge de "Nuevo" en el curso</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Resumen del curso */}
                <div className="bg-background rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Resumen del Curso</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lecciones:</span>
                      <span className="text-white">{lessons.length}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duración total:</span>
                      <span className="text-white">
                        {Math.floor((formData.duration + lessons.reduce((acc, lesson) => acc + lesson.duration, 0)) / 60)}h {((formData.duration + lessons.reduce((acc, lesson) => acc + lesson.duration, 0)) % 60)}m
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Materiales:</span>
                      <span className="text-white">{materials.length}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lecciones gratuitas:</span>
                      <span className="text-white">{lessons.filter(l => l.isFree).length}</span>
                    </div>
                    
                    <hr className="border-gray-600" />
                    
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-300">Precio:</span>
                      <span className="text-accent">
                        {formData.price === 0 ? 'Gratis' : `$${formData.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* URL de Inscripción */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">URL de Inscripción</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Link de Inscripción/Compra Personalizado
                  </label>
                  <input
                    type="url"
                    value={formData.enrollmentUrl}
                    onChange={(e) => updateFormData({ enrollmentUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://ejemplo.com/inscribirse-curso"
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    Si se especifica, el botón "Inscribirse" redirigirá a esta URL en lugar del proceso de inscripción interno
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : (editingCourse ? 'Actualizar Curso' : 'Crear Curso')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseCreationForm