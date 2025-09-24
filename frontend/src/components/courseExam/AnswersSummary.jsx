import { EXAM_STYLES, EXAM_MESSAGES, EXAM_ICONS, EXAM_CONFIG } from '../../constants/courseExamConstants.jsx'

const AnswerItem = ({ question, index, isCorrect }) => {
  return (
    <div className={EXAM_STYLES.results.answerItem}>
      <div className="flex items-center space-x-3">
        <span className="text-gray-400 font-medium">
          Pregunta {index + 1}:
        </span>
        <span className="text-white">
          {question.question.substring(0, EXAM_CONFIG.questionSubstringLength)}...
        </span>
      </div>
      <div className={`flex items-center space-x-2 ${
        isCorrect
          ? EXAM_STYLES.results.correctAnswer
          : EXAM_STYLES.results.incorrectAnswer
      }`}>
        {isCorrect ? EXAM_ICONS.correct : EXAM_ICONS.incorrect}
        <span className="font-medium">
          {isCorrect ? EXAM_MESSAGES.correct : EXAM_MESSAGES.incorrect}
        </span>
      </div>
    </div>
  )
}

const AnswersSummary = ({ exam, answers }) => {
  if (!exam?.questions) return null

  return (
    <div className="mt-8">
      <h4 className={EXAM_STYLES.results.summaryTitle}>
        {EXAM_MESSAGES.answersReview}
      </h4>
      <div className="space-y-3">
        {exam.questions.map((question, index) => {
          const isCorrect = answers[question.id] === question.correct
          return (
            <AnswerItem
              key={question.id}
              question={question}
              index={index}
              isCorrect={isCorrect}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AnswersSummary