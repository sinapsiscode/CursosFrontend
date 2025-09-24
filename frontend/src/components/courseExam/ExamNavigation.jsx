import { EXAM_STYLES, EXAM_MESSAGES } from '../../constants/courseExamConstants.jsx'

const QuestionDot = ({
  questionIndex,
  isAnswered,
  isCurrent,
  onClick
}) => {
  const getStyle = () => {
    if (isAnswered) return EXAM_STYLES.navigation.questionDot.answered
    if (isCurrent) return EXAM_STYLES.navigation.questionDot.current
    return EXAM_STYLES.navigation.questionDot.default
  }

  return (
    <button
      onClick={() => onClick(questionIndex)}
      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${getStyle()}`}
    >
      {questionIndex + 1}
    </button>
  )
}

const ExamNavigation = ({
  currentQuestion,
  totalQuestions,
  questions,
  answers,
  isLastQuestion,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
  onQuestionSelect
}) => {
  return (
    <div className={EXAM_STYLES.navigation.container}>
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          currentQuestion === 0
            ? EXAM_STYLES.navigation.buttonDisabled
            : EXAM_STYLES.navigation.buttonEnabled
        }`}
      >
        {EXAM_MESSAGES.previous}
      </button>

      <div className="flex space-x-2">
        {questions?.map((question, index) => (
          <QuestionDot
            key={question.id || index}
            questionIndex={index}
            isAnswered={answers[question.id] !== undefined}
            isCurrent={currentQuestion === index}
            onClick={onQuestionSelect}
          />
        ))}
      </div>

      {isLastQuestion ? (
        <button
          onClick={() => {
            console.log('🖱️ Click on Finish button')
            console.log('📋 Current answers:', answers)
            console.log('⏳ isSubmitting:', isSubmitting)
            onSubmit()
          }}
          disabled={isSubmitting}
          className={EXAM_STYLES.navigation.finishButton}
        >
          {isSubmitting ? EXAM_MESSAGES.processing : EXAM_MESSAGES.finish}
        </button>
      ) : (
        <button
          onClick={onNext}
          className={EXAM_STYLES.navigation.nextButton}
        >
          {EXAM_MESSAGES.next}
        </button>
      )}
    </div>
  )
}

export default ExamNavigation