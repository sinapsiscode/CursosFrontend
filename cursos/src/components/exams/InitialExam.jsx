import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { Button } from '../ui'
import { LeadCaptureForm } from '../forms'
import apiClient from '../../api/client'

const InitialExam = ({ onComplete }) => {
  const { selectedArea } = useAuthStore()
  const { showError, showSuccess } = useUIStore()
  
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [showLeadForm, setShowLeadForm] = useState(false)

  useEffect(() => {
    loadExam()
  }, [])

  const loadExam = async () => {
    try {
      const examData = await apiClient.get('/exams/initial')
      setExam(examData)
    } catch (error) {
      console.error('Error loading exam:', error)
      showError('Error al cargar el examen')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const goToNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateResults = () => {
    let totalPoints = 0
    
    exam.questions.forEach(question => {
      const selectedAnswerId = answers[question.id]
      if (selectedAnswerId) {
        const selectedOption = question.options.find(opt => opt.id === selectedAnswerId)
        if (selectedOption) {
          totalPoints += selectedOption.points
        }
      }
    })

    // Encontrar la regla de descuento aplicable
    const applicableRule = exam.discountRules.find(rule => 
      totalPoints >= rule.minPoints && totalPoints <= rule.maxPoints
    )

    const examResults = {
      totalPoints,
      totalQuestions: exam.questions.length,
      answeredQuestions: Object.keys(answers).length,
      discount: applicableRule ? applicableRule.discount : 0,
      message: applicableRule ? applicableRule.message : '¡Gracias por completar el examen!',
      area: selectedArea,
      answers: answers,
      completedAt: new Date().toISOString()
    }

    setResults(examResults)
    setShowResults(true)

    // Callback para el componente padre
    onComplete?.(examResults)
  }

  const handleClaimDiscount = () => {
    setShowLeadForm(true)
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / exam.questions.length) * 100
  }

  const isCurrentQuestionAnswered = () => {
    const question = exam?.questions[currentQuestion]
    return question && answers[question.id]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Examen no disponible
        </h3>
        <p className="text-text-secondary">
          No se pudo cargar el examen. Intenta nuevamente.
        </p>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-xl p-8 border border-gray-700 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            ¡Examen Completado!
          </h2>
          
          <div className="bg-background rounded-lg p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-accent">{results.totalPoints}</div>
                <div className="text-sm text-text-secondary">Puntos obtenidos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{results.discount}%</div>
                <div className="text-sm text-text-secondary">Descuento ganado</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{results.answeredQuestions}/{results.totalQuestions}</div>
                <div className="text-sm text-text-secondary">Preguntas respondidas</div>
              </div>
            </div>
            
            <div className="text-lg font-medium text-text-primary mb-4">
              {results.message}
            </div>
          </div>

          {results.discount > 0 && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-accent mb-2">
                🎁 ¡Has ganado {results.discount}% de descuento!
              </h3>
              <p className="text-text-secondary mb-4">
                Aplica este descuento en cualquier curso de {selectedArea}. 
                Déjanos tus datos para enviarte el código de descuento.
              </p>
              <Button onClick={handleClaimDiscount} size="large">
                Reclamar Mi Descuento
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-text-primary">Recomendaciones personalizadas:</h4>
            <div className="text-left space-y-2">
              {results.totalPoints <= 15 && (
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">💡</span>
                  <p className="text-sm text-text-secondary">
                    Te recomendamos empezar con cursos básicos para construir una base sólida.
                  </p>
                </div>
              )}
              {results.totalPoints > 15 && results.totalPoints <= 30 && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">🚀</span>
                  <p className="text-sm text-text-secondary">
                    Tienes una buena base. Cursos intermedios serán perfectos para ti.
                  </p>
                </div>
              )}
              {results.totalPoints > 30 && (
                <div className="flex items-start space-x-2">
                  <span className="text-accent mt-1">⭐</span>
                  <p className="text-sm text-text-secondary">
                    Excelente nivel. Puedes acceder directamente a cursos avanzados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <LeadCaptureForm
          isOpen={showLeadForm}
          onClose={() => setShowLeadForm(false)}
          trigger="exam_completed"
          examResults={results}
        />
      </div>
    )
  }

  const question = exam.questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Pregunta {currentQuestion + 1} de {exam.questions.length}
          </span>
          <span className="text-sm font-medium text-accent">
            {Math.round(getProgressPercentage())}% completado
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-surface rounded-xl p-8 border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={`block p-4 rounded-lg border-2 transition-all cursor-pointer ${
                answers[question.id] === option.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-600 hover:border-gray-500 text-text-primary hover:bg-gray-800'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={answers[question.id] === option.id}
                onChange={() => handleAnswer(question.id, option.id)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[question.id] === option.id
                    ? 'border-accent bg-accent'
                    : 'border-gray-500'
                }`}>
                  {answers[question.id] === option.id && (
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{option.text}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
        >
          Anterior
        </Button>

        <div className="text-center">
          <div className="text-sm text-text-secondary mb-1">
            {Object.keys(answers).length} de {exam.questions.length} respondidas
          </div>
          <div className="flex space-x-2">
            {exam.questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  answers[exam.questions[index].id]
                    ? 'bg-accent'
                    : index === currentQuestion
                    ? 'bg-blue-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={goToNext}
          disabled={!isCurrentQuestionAnswered()}
        >
          {currentQuestion === exam.questions.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  )
}

export default InitialExam