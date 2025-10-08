import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../store'
import { examenesService as examService } from '../services/examenesService'
import { apiService } from '../services/api'
import { EXAM_MESSAGES } from '../constants/courseExamConstants.jsx'
import {
  getMaxScore,
  calculateExamDiscount,
  formatTime,
  getScoreCategory
} from '../utils/examUtils'

export const useCourseExam = (courseId, examId) => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useUIStore()

  // State
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

  // Transform backend exam format (Spanish) to frontend format (English)
  const transformExam = (examData) => {
    if (!examData) return null

    return {
      ...examData,
      isActive: examData.activo,
      duration: examData.duracion,
      questions: examData.preguntas?.map(pregunta => ({
        id: pregunta.id,
        question: pregunta.pregunta,
        points: pregunta.puntos,
        options: pregunta.opciones?.map(opt => opt.texto) || [],
        correct: pregunta.opciones?.findIndex(opt => opt.correcta) || 0
      })) || []
    }
  }

  // Load exam and course data
  const loadExamAndCourse = useCallback(async () => {
    try {
      setLoading(true)

      // Load exam from backend
      const examDataRaw = await examService.getById(examId)

      // Transform to frontend format
      const examData = transformExam(examDataRaw)

      if (!examData || !examData.isActive) {
        showToast(EXAM_MESSAGES.examNotAvailable, 'error')
        navigate(`/course/${courseId}`)
        return
      }

      // Load course
      const courseData = await apiService.getCourseById(courseId)
      if (!courseData) {
        navigate('/courses')
        return
      }

      setExam(examData)
      setCourse(courseData)
      setTimeLeft(examData.duration * 60) // Convert to seconds
    } catch (error) {
      console.error('Error loading exam:', error)
      showToast(EXAM_MESSAGES.errorLoadingExam, 'error')
      navigate(`/course/${courseId}`)
    } finally {
      setLoading(false)
    }
  }, [courseId, examId, navigate, showToast])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit()
    }
  }, [timeLeft, showResults])

  // Load exam on mount
  useEffect(() => {
    if (courseId && examId) {
      loadExamAndCourse()
    }
  }, [courseId, examId, loadExamAndCourse])

  // Navigation functions
  const handleNext = useCallback(() => {
    if (currentQuestion < exam?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }, [currentQuestion, exam])

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }, [currentQuestion])

  const goToQuestion = useCallback((questionIndex) => {
    setCurrentQuestion(questionIndex)
  }, [])

  // Answer handling
  const handleAnswer = useCallback((questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }, [])

  // Score calculation
  const calculateScore = useCallback(async () => {
    if (!exam || !exam.questions) {
      return { score: 0, discount: 0, correctAnswers: 0, totalPoints: 0 }
    }

    let correctAnswers = 0
    let totalPoints = 0

    exam.questions.forEach(question => {
      const questionPoints = question.points || 10 // Default question points
      totalPoints += questionPoints
      if (answers[question.id] === question.correct) {
        correctAnswers += questionPoints
      }
    })

    // Get max score from backend config
    const maxScore = await getMaxScore()

    // Calculate score out of max (usually 20)
    const scoreOn20 = Math.round((correctAnswers / totalPoints) * maxScore)

    // Calculate discount based on score (from backend config)
    const discountPercentage = await calculateExamDiscount(scoreOn20)

    return { score: scoreOn20, discount: discountPercentage, correctAnswers, totalPoints }
  }, [exam, answers])

  // Submit exam
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    console.log('🎯 Starting exam submission...')
    setIsSubmitting(true)

    try {
      // Calculate results (now async)
      const { score: finalScore, discount: finalDiscount } = await calculateScore()
      console.log('📊 Calculated score:', { finalScore, finalDiscount })
      setScore(finalScore)
      setDiscount(finalDiscount)

      // Save result
      const examResult = {
        examId: exam.id,
        courseId: course.id,
        score: finalScore,
        discount: finalDiscount,
        answers,
        completedAt: new Date().toISOString(),
        timeSpent: exam.duration * 60 - timeLeft
      }

      console.log('💾 Saving exam result:', examResult)

      // Save to exam service
      await examService.saveCourseExamResult(user?.id, examResult)
      console.log('✅ Result saved successfully')

      if (finalDiscount > 0) {
        // Generate discount coupon
        try {
          console.log('🎫 Generating discount coupon...')
          const { coupon } = await apiService.generateCoupon(examResult, user.id)
          setCouponCode(coupon.code)
          showToast(
            `${EXAM_MESSAGES.congratsDiscount} ${finalDiscount}% ${EXAM_MESSAGES.discountCode} ${coupon.code}`,
            'success'
          )
        } catch (couponError) {
          console.error('Error generating coupon:', couponError)
          showToast(
            `${EXAM_MESSAGES.congratsDiscount} ${finalDiscount}% ${EXAM_MESSAGES.congratsNoCode}`,
            'success'
          )
        }
      }

      console.log('🏁 Showing exam results')
      setShowResults(true)

    } catch (error) {
      console.error('❌ Error in handleSubmit:', error)
      showToast(EXAM_MESSAGES.errorProcessingExam, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, calculateScore, exam, course, answers, timeLeft, user, showToast])

  // Copy coupon code
  const copyCouponCode = useCallback(() => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode)
      showToast(EXAM_MESSAGES.codeCopied, 'success')
    }
  }, [couponCode, showToast])

  // Navigation helpers
  const backToCourse = useCallback(() => {
    navigate(`/course/${courseId}`)
  }, [navigate, courseId])

  // Computed values
  const currentQuestionData = exam?.questions?.[currentQuestion] || null
  const progress = exam?.questions?.length ? ((currentQuestion + 1) / exam.questions.length) * 100 : 0
  const isLastQuestion = currentQuestion === (exam?.questions?.length - 1)
  const formattedTime = formatTime(timeLeft)

  // Score range info (async, computed when results are shown)
  const [scoreRange, setScoreRange] = useState(null)
  const [scoreCategory, setScoreCategory] = useState(null)

  useEffect(() => {
    if (showResults && score > 0) {
      // Load score range from backend config
      import('../utils/examUtils').then(({ getScoreRange, getScoreCategory }) => {
        getScoreRange(score).then(range => {
          setScoreRange(range)
          setScoreCategory(range.key)
        })
      })
    }
  }, [showResults, score])

  return {
    // Data
    exam,
    course,
    currentQuestion,
    answers,
    timeLeft,
    showResults,
    score,
    discount,
    loading,
    couponCode,
    isSubmitting,

    // Computed values
    currentQuestionData,
    progress,
    isLastQuestion,
    formattedTime,
    scoreCategory,
    scoreRange,

    // Actions
    handleNext,
    handlePrevious,
    goToQuestion,
    handleAnswer,
    handleSubmit,
    copyCouponCode,
    backToCourse,

    // Utils
    isAuthenticated,
    user
  }
}