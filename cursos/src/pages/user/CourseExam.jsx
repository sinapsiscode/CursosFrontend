import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card, Modal } from '../../components/ui'
import apiClient from '../../api/client'

const CourseExam = () => {
  const { courseId, examId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  const timerRef = useRef(null)
  
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [results, setResults] = useState(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  
  useEffect(() => {
    loadExamData()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [courseId, examId])
  
  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [examStarted, timeLeft])
  
  const loadExamData = async () => {
    setLoading(true)
    try {
      // Simulated exam data
      const examData = {
        id: examId || '1',
        courseId: courseId,
        title: 'Examen Final - React Avanzado',
        description: 'Evalúa tus conocimientos sobre React Hooks, Context API, y optimización de rendimiento.',
        duration: 30, // minutes
        passingScore: 70,
        totalQuestions: 10,
        attempts: 2,
        remainingAttempts: 1,
        lastAttempt: null,
        certificateEligible: true
      }
      
      const questionsData = [
        {
          id: 1,
          question: '¿Cuál es el Hook de React que se utiliza para manejar el estado en componentes funcionales?',
          type: 'multiple',
          options: [
            'useEffect',
            'useState',
            'useContext',
            'useReducer'
          ],
          correctAnswer: 1,
          explanation: 'useState es el Hook básico para manejar estado en componentes funcionales.',
          points: 10
        },
        {
          id: 2,
          question: '¿Qué Hook deberías usar para realizar efectos secundarios en React?',
          type: 'multiple',
          options: [
            'useState',
            'useCallback',
            'useEffect',
            'useMemo'
          ],
          correctAnswer: 2,
          explanation: 'useEffect se utiliza para manejar efectos secundarios como llamadas a APIs, suscripciones, etc.',
          points: 10
        },
        {
          id: 3,
          question: '¿Cuál es la diferencia principal entre useCallback y useMemo?',
          type: 'multiple',
          options: [
            'No hay diferencia',
            'useCallback memoriza funciones, useMemo memoriza valores',
            'useMemo es más rápido',
            'useCallback solo funciona con arrays'
          ],
          correctAnswer: 1,
          explanation: 'useCallback devuelve una función memorizada, mientras que useMemo devuelve un valor memorizado.',
          points: 10
        },
        {
          id: 4,
          question: 'Selecciona TODAS las reglas de los Hooks:',
          type: 'multiple-select',
          options: [
            'Solo llamar Hooks en el nivel superior',
            'Solo llamar Hooks desde funciones de React',
            'Puedes llamar Hooks dentro de loops',
            'Los Hooks deben empezar con "use"'
          ],
          correctAnswers: [0, 1, 3],
          explanation: 'Los Hooks deben llamarse en el nivel superior y solo desde funciones de React. Por convención, empiezan con "use".',
          points: 15
        },
        {
          id: 5,
          question: '¿Verdadero o Falso? El Context API puede reemplazar completamente a Redux.',
          type: 'true-false',
          correctAnswer: false,
          explanation: 'Aunque Context API es útil para compartir estado, Redux ofrece características adicionales como middleware, devtools, y mejor manejo de estado complejo.',
          points: 5
        },
        {
          id: 6,
          question: '¿Qué técnica NO ayuda a optimizar el rendimiento en React?',
          type: 'multiple',
          options: [
            'React.memo',
            'useCallback',
            'Usar índices como keys en listas',
            'Lazy loading de componentes'
          ],
          correctAnswer: 2,
          explanation: 'Usar índices como keys puede causar problemas de rendimiento y bugs en listas dinámicas.',
          points: 10
        },
        {
          id: 7,
          question: '¿Cuándo deberías usar useReducer en lugar de useState?',
          type: 'multiple',
          options: [
            'Siempre',
            'Nunca',
            'Cuando el estado es complejo o tiene múltiples sub-valores',
            'Solo en componentes de clase'
          ],
          correctAnswer: 2,
          explanation: 'useReducer es preferible cuando tienes lógica de estado compleja que involucra múltiples sub-valores.',
          points: 10
        },
        {
          id: 8,
          question: 'Ordena estos Hooks por frecuencia de uso típica (de más a menos usado):',
          type: 'ordering',
          options: [
            'useState',
            'useEffect',
            'useContext',
            'useReducer'
          ],
          correctOrder: [0, 1, 2, 3],
          explanation: 'useState y useEffect son los más comunes, seguidos por useContext y useReducer.',
          points: 10
        },
        {
          id: 9,
          question: '¿Qué problema resuelve el Hook useId en React 18?',
          type: 'multiple',
          options: [
            'Generar IDs únicos para elementos HTML',
            'Autenticación de usuarios',
            'Gestión de estado',
            'Routing'
          ],
          correctAnswer: 0,
          explanation: 'useId genera IDs únicos que son consistentes entre servidor y cliente para SSR.',
          points: 10
        },
        {
          id: 10,
          question: 'Escribe el nombre del Hook que previene actualizaciones de estado en componentes desmontados:',
          type: 'text',
          correctAnswer: 'useEffect',
          explanation: 'useEffect con una función de limpieza (cleanup) previene actualizaciones en componentes desmontados.',
          points: 10
        }
      ]
      
      setExam(examData)
      setQuestions(questionsData)
      setTimeLeft(examData.duration * 60) // Convert to seconds
      
    } catch (error) {
      console.error('Error loading exam:', error)
      showError('Error al cargar el examen')
      navigate(`/course/${courseId}`)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStartExam = () => {
    if (window.confirm('¿Estás listo para comenzar el examen? Una vez iniciado, no podrás pausarlo.')) {
      setExamStarted(true)
      showSuccess('¡Examen iniciado! Buena suerte 🍀')
    }
  }
  
  const handleAnswerSelect = (questionId, answerIndex) => {
    const question = questions.find(q => q.id === questionId)
    
    if (question.type === 'multiple-select') {
      const currentAnswers = answers[questionId] || []
      if (currentAnswers.includes(answerIndex)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter(a => a !== answerIndex)
        })
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, answerIndex]
        })
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: answerIndex
      })
    }
  }
  
  const handleTextAnswer = (questionId, text) => {
    setAnswers({
      ...answers,
      [questionId]: text
    })
  }
  
  const calculateScore = () => {
    let totalScore = 0
    let correctAnswers = 0
    
    questions.forEach(question => {
      const userAnswer = answers[question.id]
      
      if (question.type === 'multiple-select') {
        const correct = question.correctAnswers
        const user = userAnswer || []
        if (correct.length === user.length && correct.every(a => user.includes(a))) {
          totalScore += question.points
          correctAnswers++
        }
      } else if (question.type === 'text') {
        if (userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          totalScore += question.points
          correctAnswers++
        }
      } else if (question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points
          correctAnswers++
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points
          correctAnswers++
        }
      }
    })
    
    return {
      score: totalScore,
      percentage: (totalScore / 100) * 100,
      correctAnswers,
      totalQuestions: questions.length,
      passed: (totalScore / 100) * 100 >= exam.passingScore
    }
  }
  
  const handleSubmitExam = async () => {
    if (!examFinished) {
      const unanswered = questions.filter(q => !answers[q.id] && answers[q.id] !== 0)
      if (unanswered.length > 0 && !window.confirm(`Tienes ${unanswered.length} preguntas sin responder. ¿Deseas enviar de todos modos?`)) {
        return
      }
    }
    
    const examResults = calculateScore()
    setResults(examResults)
    setExamFinished(true)
    setShowResultsModal(true)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Save results
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (examResults.passed) {
        showSuccess('¡Felicidades! Has aprobado el examen 🎉')
        if (exam.certificateEligible) {
          setTimeout(() => {
            showSuccess('Tu certificado estará disponible en breve')
          }, 2000)
        }
      } else {
        showError(`No has alcanzado el puntaje mínimo (${exam.passingScore}%)`)
      }
    } catch (error) {
      console.error('Error saving results:', error)
    }
  }
  
  const handleReviewAnswers = () => {
    setShowResultsModal(false)
    setReviewMode(true)
    setCurrentQuestion(0)
  }
  
  const handleRetakExam = () => {
    if (exam.remainingAttempts > 0) {
      setAnswers({})
      setCurrentQuestion(0)
      setExamStarted(false)
      setExamFinished(false)
      setResults(null)
      setReviewMode(false)
      setTimeLeft(exam.duration * 60)
      showSuccess('Puedes intentar el examen nuevamente')
    } else {
      showError('No tienes más intentos disponibles')
    }
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const getQuestionStatus = (questionId) => {
    if (!answers[questionId] && answers[questionId] !== 0) return 'unanswered'
    if (!reviewMode) return 'answered'
    
    const question = questions.find(q => q.id === questionId)
    const userAnswer = answers[questionId]
    
    if (question.type === 'multiple-select') {
      const correct = question.correctAnswers
      const user = userAnswer || []
      return correct.length === user.length && correct.every(a => user.includes(a)) ? 'correct' : 'incorrect'
    } else if (question.type === 'text') {
      return userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim() ? 'correct' : 'incorrect'
    } else {
      return userAnswer === question.correctAnswer ? 'correct' : 'incorrect'
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando examen...</p>
        </div>
      </div>
    )
  }
  
  if (!examStarted && !examFinished) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {exam?.title}
            </h1>
            <p className="text-text-secondary">
              {exam?.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-3">Información del Examen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duración:</span>
                  <span className="text-text-primary">{exam?.duration} minutos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Preguntas:</span>
                  <span className="text-text-primary">{exam?.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Puntaje mínimo:</span>
                  <span className="text-accent font-medium">{exam?.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Intentos restantes:</span>
                  <span className="text-text-primary">{exam?.remainingAttempts}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-3">Instrucciones</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Lee cada pregunta cuidadosamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>El tiempo comenzará al iniciar el examen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>No podrás pausar una vez iniciado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Puedes navegar entre preguntas</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="large" onClick={handleStartExam}>
              Comenzar Examen
            </Button>
          </div>
        </Card>
      </div>
    )
  }
  
  const currentQ = questions[currentQuestion]
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-surface rounded-lg p-4 mb-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {exam?.title}
            </h2>
            <p className="text-sm text-text-secondary">
              Pregunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
          
          {!examFinished && (
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-bold ${
                timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-accent'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              
              <Button 
                variant="secondary"
                onClick={handleSubmitExam}
              >
                Finalizar Examen
              </Button>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Question */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex-1">
            {currentQ?.question}
          </h3>
          <span className="text-sm text-accent font-medium ml-4">
            {currentQ?.points} pts
          </span>
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          {currentQ?.type === 'multiple' && currentQ?.options.map((option, idx) => (
            <label 
              key={idx}
              className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                reviewMode
                  ? idx === currentQ.correctAnswer
                    ? 'border-green-500 bg-green-500/10'
                    : answers[currentQ.id] === idx
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-600'
                  : answers[currentQ.id] === idx
                  ? 'border-accent bg-accent/10'
                  : 'border-gray-600 hover:border-accent'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                checked={answers[currentQ.id] === idx}
                onChange={() => handleAnswerSelect(currentQ.id, idx)}
                disabled={examFinished}
                className="mr-3"
              />
              <span className="text-text-primary">{option}</span>
            </label>
          ))}
          
          {currentQ?.type === 'multiple-select' && (
            <>
              <p className="text-sm text-text-secondary mb-2">
                Selecciona todas las respuestas correctas:
              </p>
              {currentQ?.options.map((option, idx) => (
                <label 
                  key={idx}
                  className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                    reviewMode
                      ? currentQ.correctAnswers.includes(idx)
                        ? 'border-green-500 bg-green-500/10'
                        : (answers[currentQ.id] || []).includes(idx)
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-600'
                      : (answers[currentQ.id] || []).includes(idx)
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-600 hover:border-accent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(answers[currentQ.id] || []).includes(idx)}
                    onChange={() => handleAnswerSelect(currentQ.id, idx)}
                    disabled={examFinished}
                    className="mr-3"
                  />
                  <span className="text-text-primary">{option}</span>
                </label>
              ))}
            </>
          )}
          
          {currentQ?.type === 'true-false' && (
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswerSelect(currentQ.id, true)}
                disabled={examFinished}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  reviewMode
                    ? currentQ.correctAnswer === true
                      ? 'border-green-500 bg-green-500/10'
                      : answers[currentQ.id] === true
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600'
                    : answers[currentQ.id] === true
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-600 hover:border-accent'
                }`}
              >
                ✓ Verdadero
              </button>
              <button
                onClick={() => handleAnswerSelect(currentQ.id, false)}
                disabled={examFinished}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  reviewMode
                    ? currentQ.correctAnswer === false
                      ? 'border-green-500 bg-green-500/10'
                      : answers[currentQ.id] === false
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600'
                    : answers[currentQ.id] === false
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-600 hover:border-accent'
                }`}
              >
                ✗ Falso
              </button>
            </div>
          )}
          
          {currentQ?.type === 'text' && (
            <input
              type="text"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleTextAnswer(currentQ.id, e.target.value)}
              disabled={examFinished}
              placeholder="Escribe tu respuesta aquí..."
              className={`w-full px-4 py-3 rounded-lg border transition-all ${
                reviewMode
                  ? getQuestionStatus(currentQ.id) === 'correct'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                  : 'border-gray-600 focus:border-accent'
              } bg-surface text-text-primary`}
            />
          )}
        </div>
        
        {/* Explanation in review mode */}
        {reviewMode && currentQ?.explanation && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-400 font-medium mb-1">Explicación:</p>
            <p className="text-sm text-text-secondary">{currentQ.explanation}</p>
          </div>
        )}
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="secondary"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          ← Anterior
        </Button>
        
        <div className="flex gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                idx === currentQuestion
                  ? 'bg-accent text-white'
                  : getQuestionStatus(q.id) === 'unanswered'
                  ? 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                  : getQuestionStatus(q.id) === 'correct'
                  ? 'bg-green-500/20 text-green-400'
                  : getQuestionStatus(q.id) === 'incorrect'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-surface text-text-primary'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        <Button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === questions.length - 1}
        >
          Siguiente →
        </Button>
      </div>
      
      {/* Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title="Resultados del Examen"
      >
        {results && (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className={`text-6xl mb-4 ${
                results.passed ? 'text-green-400' : 'text-red-400'
              }`}>
                {results.passed ? '🎉' : '😔'}
              </div>
              
              <h3 className={`text-3xl font-bold mb-2 ${
                results.passed ? 'text-green-400' : 'text-red-400'
              }`}>
                {results.passed ? '¡Aprobado!' : 'No Aprobado'}
              </h3>
              
              <p className="text-5xl font-bold text-text-primary mb-4">
                {results.percentage.toFixed(1)}%
              </p>
              
              <p className="text-text-secondary">
                {results.correctAnswers} de {results.totalQuestions} respuestas correctas
              </p>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Puntaje obtenido:</span>
                  <span className="text-text-primary font-medium">{results.score} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Puntaje mínimo:</span>
                  <span className="text-text-primary">{exam?.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tu porcentaje:</span>
                  <span className={`font-bold ${
                    results.passed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {results.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            {results.passed && exam?.certificateEligible && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-accent text-center">
                  ¡Felicidades! Has completado el curso exitosamente.
                  Tu certificado estará disponible pronto.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleReviewAnswers}
                className="flex-1"
              >
                Revisar Respuestas
              </Button>
              
              {!results.passed && exam?.remainingAttempts > 0 && (
                <Button
                  onClick={handleRetakExam}
                  className="flex-1"
                >
                  Reintentar ({exam.remainingAttempts} restantes)
                </Button>
              )}
              
              {results.passed && (
                <Button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="flex-1"
                >
                  Volver al Curso
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CourseExam