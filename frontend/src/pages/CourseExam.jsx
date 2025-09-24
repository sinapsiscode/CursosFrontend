import { useParams } from 'react-router-dom'
import { useCourseExam } from '../hooks/useCourseExam'
import { EXAM_STYLES } from '../constants/courseExamConstants.jsx'
import ExamHeader from '../components/courseExam/ExamHeader'
import ExamProgressBar from '../components/courseExam/ExamProgressBar'
import QuestionDisplay from '../components/courseExam/QuestionDisplay'
import ExamNavigation from '../components/courseExam/ExamNavigation'
import ExamResults from '../components/courseExam/ExamResults'
import LoadingState from '../components/courseExam/LoadingState'

const CourseExam = () => {
  const { courseId, examId } = useParams()

  const {
    exam,
    course,
    currentQuestion,
    answers,
    showResults,
    score,
    discount,
    loading,
    couponCode,
    isSubmitting,
    currentQuestionData,
    progress,
    isLastQuestion,
    formattedTime,
    scoreCategory,
    handleNext,
    handlePrevious,
    goToQuestion,
    handleAnswer,
    handleSubmit,
    copyCouponCode,
    backToCourse
  } = useCourseExam(courseId, examId)

  if (loading) {
    return <LoadingState />
  }

  if (!exam || !course) {
    return null
  }

  return (
    <div className={EXAM_STYLES.container}>
      <div className={EXAM_STYLES.maxWidth}>
        {/* Header */}
        <ExamHeader
          exam={exam}
          course={course}
          currentQuestion={currentQuestion}
          totalQuestions={exam.questions?.length || 0}
          formattedTime={formattedTime}
          showResults={showResults}
        />

        {/* Content */}
        <div className={EXAM_STYLES.content.container}>
          {!showResults ? (
            <>
              {/* Progress bar */}
              <ExamProgressBar progress={progress} />

              {/* Question */}
              <QuestionDisplay
                question={currentQuestionData}
                selectedAnswer={answers[currentQuestionData?.id]}
                onAnswerSelect={handleAnswer}
              />

              {/* Navigation */}
              <ExamNavigation
                currentQuestion={currentQuestion}
                totalQuestions={exam.questions?.length || 0}
                questions={exam.questions}
                answers={answers}
                isLastQuestion={isLastQuestion}
                isSubmitting={isSubmitting}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
                onQuestionSelect={goToQuestion}
              />
            </>
          ) : (
            /* Results */
            <ExamResults
              score={score}
              scoreCategory={scoreCategory}
              discount={discount}
              course={course}
              couponCode={couponCode}
              onCopyCoupon={copyCouponCode}
              exam={exam}
              answers={answers}
              onBackToCourse={backToCourse}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseExam