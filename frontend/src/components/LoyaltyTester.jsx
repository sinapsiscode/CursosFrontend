import { useLoyaltyTester } from '../hooks/useLoyaltyTester'
import { TEST_STYLES } from '../constants/loyaltyTesterConstants'
import TesterHeader from './LoyaltyTester/TesterHeader'
import TestResults from './LoyaltyTester/TestResults'

const LoyaltyTester = () => {
  const { testResults, isRunning, runTests } = useLoyaltyTester()

  return (
    <div className={TEST_STYLES.container}>
      <TesterHeader
        onRunTests={runTests}
        isRunning={isRunning}
      />

      <TestResults results={testResults} />
    </div>
  )
}

export default LoyaltyTester