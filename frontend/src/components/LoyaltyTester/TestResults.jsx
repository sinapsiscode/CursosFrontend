import { TEST_STYLES } from '../../constants/loyaltyTesterConstants'
import TestResult from './TestResult'

const TestResults = ({ results }) => {
  if (results.length === 0) return null

  return (
    <div className={TEST_STYLES.resultsContainer}>
      {results.map((result, idx) => (
        <TestResult
          key={idx}
          result={result}
          index={idx}
        />
      ))}
    </div>
  )
}

export default TestResults