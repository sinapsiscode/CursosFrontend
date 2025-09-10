import { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { examService } from '../../services/examService'

const AdminExams = () => {
  const { showToast } = useUIStore()
  
  // Estados
  const [questions, setQuestions] = useState([])
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    id: null,
    question: '',
    questionImage: '',
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''],
    correct: 0,
    area: 'metalurgia'
  })

  // Cargar preguntas al montar
  useEffect(() => {
    loadQuestions()
  }, [])

  // Cargar preguntas desde localStorage
  const loadQuestions = () => {
    try {
      const storedQuestions = localStorage.getItem('exam_questions')
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions))
      } else {
        // Si no hay preguntas guardadas, usar las predeterminadas
        const defaultQuestions = getDefaultQuestions()
        setQuestions(defaultQuestions)
        localStorage.setItem('exam_questions', JSON.stringify(defaultQuestions))
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      showToast('Error al cargar las preguntas', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Obtener preguntas predeterminadas
  const getDefaultQuestions = () => {
    return [
      {
        id: 1,
        question: "¿Cuál es el principal componente del acero?",
        questionImage: "",
        options: ["Hierro", "Carbono", "Níquel", "Cromo"],
        optionImages: ["", "", "", ""],
        correct: 0,
        area: "metalurgia"
      },
      {
        id: 2,
        question: "¿Qué tipo de roca se forma por enfriamiento del magma?",
        questionImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Igneous_rock_formation.jpg/400px-Igneous_rock_formation.jpg",
        options: ["Sedimentaria", "Metamórfica", "Ígnea", "Calcárea"],
        optionImages: ["", "", "", ""],
        correct: 2,
        area: "geologia"
      }
    ]
  }

  // Guardar preguntas en localStorage
  const saveQuestions = (updatedQuestions) => {
    localStorage.setItem('exam_questions', JSON.stringify(updatedQuestions))
    setQuestions(updatedQuestions)
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.question.trim()) {
      showToast('La pregunta es obligatoria', 'error')
      return
    }
    
    if (formData.options.some(opt => !opt.trim())) {
      showToast('Todas las opciones deben tener texto', 'error')
      return
    }

    if (editingQuestion) {
      // Actualizar pregunta existente
      const updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id ? { ...formData, id: editingQuestion.id } : q
      )
      saveQuestions(updatedQuestions)
      showToast('Pregunta actualizada correctamente', 'success')
    } else {
      // Crear nueva pregunta
      const newQuestion = {
        ...formData,
        id: Date.now(),
      }
      saveQuestions([...questions, newQuestion])
      showToast('Pregunta creada correctamente', 'success')
    }

    // Resetear formulario
    resetForm()
  }

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      id: null,
      question: '',
      questionImage: '',
      options: ['', '', '', ''],
      optionImages: ['', '', '', ''],
      correct: 0,
      area: 'metalurgia'
    })
    setEditingQuestion(null)
    setShowQuestionForm(false)
  }

  // Editar pregunta
  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      ...question,
      questionImage: question.questionImage || '',
      optionImages: question.optionImages || ['', '', '', '']
    })
    setShowQuestionForm(true)
  }

  // Eliminar pregunta
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      const updatedQuestions = questions.filter(q => q.id !== id)
      saveQuestions(updatedQuestions)
      showToast('Pregunta eliminada', 'success')
    }
  }

  // Manejar cambio en opciones
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  // Manejar cambio en imágenes de opciones
  const handleOptionImageChange = (index, value) => {
    const newOptionImages = [...formData.optionImages]
    newOptionImages[index] = value
    setFormData({ ...formData, optionImages: newOptionImages })
  }

  // Previsualizar imagen
  const ImagePreview = ({ src, alt }) => {
    if (!src) return null
    
    return (
      <div className="mt-2">
        <img 
          src={src} 
          alt={alt}
          className="max-w-xs h-32 object-contain rounded border border-gray-600"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Error+al+cargar+imagen'
          }}
        />
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Cargando preguntas...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gestión de Exámenes</h2>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            + Nueva Pregunta
          </button>
        </div>

        {/* Formulario de pregunta */}
        {showQuestionForm && (
          <div className="bg-background rounded-lg p-6 mb-6 border border-gray-600">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pregunta */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pregunta *
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                  required
                />
              </div>

              {/* Imagen de la pregunta */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de imagen de la pregunta (opcional)
                </label>
                <input
                  type="url"
                  value={formData.questionImage}
                  onChange={(e) => setFormData({ ...formData, questionImage: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <ImagePreview src={formData.questionImage} alt="Vista previa de la pregunta" />
              </div>

              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Área *
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="metalurgia">Metalurgia</option>
                  <option value="mineria">Minería</option>
                  <option value="geologia">Geología</option>
                </select>
              </div>

              {/* Opciones */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Opciones de respuesta *
                </label>
                
                {formData.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={formData.correct === index}
                        onChange={() => setFormData({ ...formData, correct: index })}
                        className="text-accent focus:ring-accent"
                      />
                      <span className="text-white font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                    
                    {/* Imagen de la opción */}
                    <div className="ml-8">
                      <input
                        type="url"
                        value={formData.optionImages[index]}
                        onChange={(e) => handleOptionImageChange(index, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="URL de imagen para esta opción (opcional)"
                      />
                      <ImagePreview 
                        src={formData.optionImages[index]} 
                        alt={`Vista previa opción ${String.fromCharCode(65 + index)}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  {editingQuestion ? 'Actualizar' : 'Crear'} Pregunta
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de preguntas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Preguntas del examen ({questions.length})
          </h3>
          
          {questions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No hay preguntas. Crea la primera pregunta.
            </p>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-background rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-bold text-accent">
                          #{index + 1}
                        </span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {question.area}
                        </span>
                      </div>
                      
                      <p className="text-white mb-3">{question.question}</p>
                      
                      {question.questionImage && (
                        <img 
                          src={question.questionImage} 
                          alt="Imagen de pregunta"
                          className="max-w-xs h-24 object-contain rounded mb-3"
                        />
                      )}
                      
                      <div className="space-y-1">
                        {question.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <span className={`text-sm ${
                              question.correct === optIndex 
                                ? 'text-green-400 font-medium' 
                                : 'text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}. {opt}
                            </span>
                            {question.optionImages?.[optIndex] && (
                              <img 
                                src={question.optionImages[optIndex]} 
                                alt={`Opción ${String.fromCharCode(65 + optIndex)}`}
                                className="h-8 w-8 object-cover rounded"
                              />
                            )}
                            {question.correct === optIndex && (
                              <span className="text-xs text-green-400">(Correcta)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(question)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">Información importante:</h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Las preguntas se guardan automáticamente en el navegador</li>
            <li>• Para subir imágenes, usa servicios como Imgur, ImgBB o Cloudinary</li>
            <li>• Se recomienda tener al menos 10 preguntas para un examen completo</li>
            <li>• Marca la respuesta correcta con el radio button</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminExams