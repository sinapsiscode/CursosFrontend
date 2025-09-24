import { EXAM_STYLES } from '../../constants/courseExamConstants.jsx'

const ExamHeader = ({
  exam,
  course,
  currentQuestion,
  totalQuestions,
  formattedTime,
  showResults
}) => {
  return (
    <div className={EXAM_STYLES.header.container}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={EXAM_STYLES.header.title}>{exam?.title}</h1>
          <p className={EXAM_STYLES.header.subtitle}>{course?.title}</p>
        </div>
        {!showResults && (
          <div className="flex items-center space-x-6">
            <div className={EXAM_STYLES.header.questionCounter}>
              <span className="text-sm opacity-80">Pregunta</span>
              <span className="text-xl font-bold ml-2">
                {currentQuestion + 1}/{totalQuestions}
              </span>
            </div>
            <div className={EXAM_STYLES.header.timer}>
              <span className={EXAM_STYLES.header.timerText}>{formattedTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamHeader