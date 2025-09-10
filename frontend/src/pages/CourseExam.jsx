import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../store'
import { examService } from '../services/examService'
import { apiService } from '../services/api'

const CourseExam = () => {
  const { courseId, examId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useUIStore()
  
  const [exam, setExam] = useState(null)
  const [course, setCourse] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState(null)

  // Cargar examen y curso
  useEffect(() => {
    loadExamAndCourse()
  }, [courseId, examId])

  const loadExamAndCourse = async () => {
    try {
      setLoading(true)
      
      // Cargar examen
      const examData = examService.getExamById(examId)
      if (!examData || !examData.isActive) {
        showToast('Examen no disponible', 'error')
        navigate(`/course/${courseId}`)
        return
      }
      
      // Cargar curso
      const courseData = await apiService.getCourseById(courseId)
      if (!courseData) {
        navigate('/courses')
        return
      }
      
      setExam(examData)
      setCourse(courseData)
      setTimeLeft(examData.duration * 60) // Convertir a segundos
    } catch (error) {
      console.error('Error loading exam:', error)
      showToast('Error al cargar el examen', 'error')
      navigate(`/course/${courseId}`)
    } finally {
      setLoading(false)
    }
  }

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit()
    }
  }, [timeLeft, showResults])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex })
  }

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    if (!exam || !exam.questions) {
      return { score: 0, discount: 0, correctAnswers: 0, totalPoints: 0 }
    }
    
    let correctAnswers = 0
    let totalPoints = 0
    
    exam.questions.forEach(question => {
      totalPoints += question.points || 10
      if (answers[question.id] === question.correct) {
        correctAnswers += question.points || 10
      }
    })
    
    // Calcular puntaje sobre 20
    const scoreOn20 = Math.round((correctAnswers / totalPoints) * 20)
    
    // Calcular descuento basado en el puntaje
    let discountPercentage = 0
    if (scoreOn20 >= 18) {
      discountPercentage = 20
    } else if (scoreOn20 >= 15) {
      discountPercentage = 15
    } else if (scoreOn20 >= 11) {
      discountPercentage = 10
    }
    
    return { score: scoreOn20, discount: discountPercentage, correctAnswers, totalPoints }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    console.log('🎯 Iniciando envío del examen...')
    setIsSubmitting(true)
    
    try {
      // Calcular resultados
      const { score: finalScore, discount: finalDiscount } = calculateScore()
      console.log('📊 Puntaje calculado:', { finalScore, finalDiscount })
      setScore(finalScore)
      setDiscount(finalDiscount)
      
      // Guardar resultado
      const examResult = {
        examId: exam.id,
        courseId: course.id,
        score: finalScore,
        discount: finalDiscount,
        answers,
        completedAt: new Date().toISOString(),
        timeSpent: exam.duration * 60 - timeLeft
      }
      
      console.log('💾 Guardando resultado del examen:', examResult)
      
      // Guardar en el servicio de exámenes
      await examService.saveCourseExamResult(user?.id, examResult)
      console.log('✅ Resultado guardado exitosamente')
      
      if (finalDiscount > 0) {
        // Generar cupón de descuento
        try {
          console.log('🎫 Generando cupón de descuento...')
          const { coupon } = await apiService.generateCoupon(examResult, user.id)
          setCouponCode(coupon.code)
          showToast(`¡Felicidades! Has ganado un ${finalDiscount}% de descuento. Código: ${coupon.code}`, 'success')
        } catch (couponError) {
          console.error('Error generating coupon:', couponError)
          showToast(`¡Felicidades! Has ganado un ${finalDiscount}% de descuento`, 'success')
        }
      }
      
      console.log('🏁 Mostrando resultados del examen')
      setShowResults(true)
      
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error)
      showToast('Error al procesar el examen', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Cargando examen...</div>
      </div>
    )
  }

  if (!exam || !course) {
    return null
  }

  const currentQuestionData = exam.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-surface rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{exam.title}</h1>
              <p className="text-gray-400">{course.title}</p>
            </div>
            {!showResults && (
              <div className="flex items-center space-x-6">
                <div className="text-white">
                  <span className="text-sm opacity-80">Pregunta</span>
                  <span className="text-xl font-bold ml-2">{currentQuestion + 1}/{exam.questions.length}</span>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-white font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-surface rounded-xl p-6">
          {!showResults ? (
            <>
              {/* Progress bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentQuestionData.question}
                </h3>
                
                {/* Question Image */}
                {currentQuestionData.questionImage && (
                  <div className="mb-6">
                    <img 
                      src={currentQuestionData.questionImage}
                      alt="Imagen de la pregunta"
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ maxHeight: '300px' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                {/* Options */}
                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestionData.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQuestionData.id] === index
                          ? 'border-accent bg-accent/20 text-white'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        <span className="flex-grow">{option}</span>
                        {currentQuestionData.optionImages && currentQuestionData.optionImages[index] && (
                          <img 
                            src={currentQuestionData.optionImages[index]}
                            alt={`Opción ${String.fromCharCode(65 + index)}`}
                            className="ml-4 h-16 w-16 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    currentQuestion === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Anterior
                </button>

                <div className="flex space-x-2">
                  {exam.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                        answers[exam.questions[index].id] !== undefined
                          ? 'bg-accent text-background'
                          : currentQuestion === index
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestion === exam.questions.length - 1 ? (
                  <button
                    onClick={() => {
                      console.log('🖱️ Click en botón Finalizar')
                      console.log('📋 Respuestas actuales:', answers)
                      console.log('⏳ isSubmitting:', isSubmitting)
                      handleSubmit()
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Procesando...' : 'Finalizar'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results */
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="inline-block mb-6">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold ${
                    score >= 15 ? 'bg-green-500/20 text-green-400' :
                    score >= 11 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {score}/20
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {score >= 15 ? '¡Excelente!' : score >= 11 ? '¡Bien hecho!' : 'Sigue aprendiendo'}
                </h3>

                {discount > 0 ? (
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                    <p className="text-lg text-white mb-2">¡Has ganado un descuento!</p>
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {discount}% OFF
                    </p>
                    <p className="text-gray-300 mt-2">
                      En el curso: {course.title}
                    </p>
                    {couponCode && (
                      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-400 mb-2">Tu código de descuento:</p>
                        <div className="flex items-center justify-between bg-gray-900 px-4 py-2 rounded border-2 border-dashed border-purple-500">
                          <span className="font-mono text-lg text-white">{couponCode}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(couponCode)
                              showToast('Código copiado al portapapeles', 'success')
                            }}
                            className="text-purple-400 hover:text-purple-300 text-sm"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Presenta este código al administrador para aplicar tu descuento
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 mb-6">
                    Necesitas al menos 11/20 para obtener un descuento
                  </p>
                )}
              </div>

              {/* Resumen de respuestas */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-white mb-4">Resumen de respuestas</h4>
                <div className="space-y-3">
                  {exam.questions.map((question, index) => {
                    const isCorrect = answers[question.id] === question.correct
                    return (
                      <div key={question.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 font-medium">Pregunta {index + 1}:</span>
                          <span className="text-white">{question.question.substring(0, 60)}...</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${
                          isCorrect ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isCorrect ? (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Correcta</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Incorrecta</span>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="bg-accent text-background px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90"
                >
                  Volver al curso
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseExam