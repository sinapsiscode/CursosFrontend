import { EXAM_STYLES, EXAM_CONFIG } from '../../constants/courseExamConstants.jsx'

const QuestionOption = ({
  option,
  index,
  isSelected,
  onClick,
  optionImage,
  questionId
}) => {
  return (
    <button
      onClick={() => onClick(questionId, index)}
      className={`${EXAM_STYLES.question.optionContainer} ${
        isSelected
          ? EXAM_STYLES.question.optionSelected
          : EXAM_STYLES.question.optionDefault
      }`}
    >
      <div className="flex items-center">
        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
        <span className="flex-grow">{option}</span>
        {optionImage && (
          <img
            src={optionImage}
            alt={`Opción ${String.fromCharCode(65 + index)}`}
            className={EXAM_STYLES.question.optionImage}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>
    </button>
  )
}

const QuestionDisplay = ({
  question,
  selectedAnswer,
  onAnswerSelect
}) => {
  if (!question) return null

  return (
    <div className="mb-8">
      <h3 className={EXAM_STYLES.question.title}>
        {question.question}
      </h3>

      {/* Question Image */}
      {question.questionImage && (
        <div className="mb-6">
          <img
            src={question.questionImage}
            alt="Imagen de la pregunta"
            className={EXAM_STYLES.question.image}
            style={{ maxHeight: EXAM_CONFIG.imageMaxHeight }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <QuestionOption
            key={index}
            option={option}
            index={index}
            isSelected={selectedAnswer === index}
            onClick={onAnswerSelect}
            optionImage={question.optionImages?.[index]}
            questionId={question.id}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionDisplay