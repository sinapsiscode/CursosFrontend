import { TEST_LABELS, TEST_STYLES } from '../../constants/loyaltyTesterConstants'

const TesterHeader = ({ onRunTests, isRunning }) => {
  return (
    <>
      <h3 className={TEST_STYLES.title}>
        {TEST_LABELS.title}
      </h3>

      <button
        onClick={onRunTests}
        disabled={isRunning}
        className={`${TEST_STYLES.runButton} ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRunning ? 'Ejecutando...' : TEST_LABELS.runButton}
      </button>
    </>
  )
}

export default TesterHeader