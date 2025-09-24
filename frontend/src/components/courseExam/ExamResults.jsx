import { EXAM_STYLES, EXAM_MESSAGES, EXAM_SCORE_RANGES } from '../../constants/courseExamConstants.jsx'
import DiscountCard from './DiscountCard'
import AnswersSummary from './AnswersSummary'

const ScoreCircle = ({ score, category }) => {
  const scoreConfig = EXAM_SCORE_RANGES[category]

  return (
    <div className="inline-block mb-6">
      <div className={`${scoreConfig.color} ${EXAM_STYLES.results.scoreCircle}`}>
        {score}/20
      </div>
    </div>
  )
}

const ExamResults = ({
  score,
  scoreCategory,
  discount,
  course,
  couponCode,
  onCopyCoupon,
  exam,
  answers,
  onBackToCourse
}) => {
  const scoreConfig = EXAM_SCORE_RANGES[scoreCategory]

  return (
    <div className={EXAM_STYLES.results.container}>
      <div className="text-center mb-8">
        <ScoreCircle score={score} category={scoreCategory} />

        <h3 className={EXAM_STYLES.results.title}>
          {scoreConfig.message}
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