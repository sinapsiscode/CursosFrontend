import { TEST_LABELS, TEST_STYLES } from '../../constants/loyaltyTesterConstants'

const TestResult = ({ result, index }) => {
  const cardStyle = result.success ? TEST_STYLES.successCard : TEST_STYLES.failureCard
  const statusStyle = result.success ? TEST_STYLES.successStatus : TEST_STYLES.failureStatus
  const statusText = result.success ? TEST_LABELS.successful : TEST_LABELS.failed

  return (
    <div
      key={index}
      className={`${TEST_STYLES.resultCard} ${cardStyle}`}
    >
      <div className={TEST_STYLES.resultHeader}>
        <span className={TEST_STYLES.testName}>
          {result.test}
        </span>
        <span className={statusStyle}>
          {statusText}
        </span>
      </div>
      <p className={TEST_STYLES.details}>
        {result.details}
      </p>
    </div>
  )
}

export default TestResult