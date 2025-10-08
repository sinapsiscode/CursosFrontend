import { EXAM_STYLES, EXAM_MESSAGES } from '../../constants/courseExamConstants.jsx'
import DiscountCard from './DiscountCard'
import AnswersSummary from './AnswersSummary'

const ScoreCircle = ({ score, scoreRange }) => {
  if (!scoreRange) return null

  // Build color classes from scoreRange.color
  const getColorClass = (color) => {
    const colorMap = {
      'green': 'bg-green-500/20 text-green-400',
      'yellow': 'bg-yellow-500/20 text-yellow-400',
      'red': 'bg-red-500/20 text-red-400'
    }
    return colorMap[color] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="inline-block mb-6">
      <div className={`${getColorClass(scoreRange.color)} ${EXAM_STYLES.results.scoreCircle}`}>
        {score}/{scoreRange.max || 20}
      </div>
    </div>
  )
}

const ExamResults = ({
  score,
  scoreRange,
  discount,
  course,
  couponCode,
  onCopyCoupon,
  exam,
  answers,
  onBackToCourse
}) => {
  // Show loading state if scoreRange hasn't loaded yet
  if (!scoreRange) {
    return (
      <div className={EXAM_STYLES.results.container}>
        <div className="text-center">
          <p className="text-gray-400">Calculando resultados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={EXAM_STYLES.results.container}>
      <div className="text-center mb-8">
        <ScoreCircle score={score} scoreRange={scoreRange} />

        <h3 className={EXAM_STYLES.results.title}>
          {scoreRange.message}
        </h3>

        {discount > 0 ? (
          <DiscountCard
            discount={discount}
            course={course}
            couponCode={couponCode}
            onCopyCoupon={onCopyCoupon}
          />
        ) : (
          <p className="text-gray-400 mb-6">
            {EXAM_MESSAGES.minScoreForDiscount}
          </p>
        )}
      </div>

      <AnswersSummary
        exam={exam}
        answers={answers}
      />

      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={onBackToCourse}
          className="bg-accent text-background px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90"
        >
          {EXAM_MESSAGES.backToCourse}
        </button>
      </div>
    </div>
  )
}

export default ExamResults