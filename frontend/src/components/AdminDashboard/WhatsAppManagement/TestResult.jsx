import { WHATSAPP_STYLES } from '../../../constants/whatsAppManagementConstants'

const TestResult = ({ testResult }) => {
  if (!testResult) return null

  return (
    <div className={`${WHATSAPP_STYLES.testResult} ${
      testResult.success
        ? WHATSAPP_STYLES.testResultSuccess
        : WHATSAPP_STYLES.testResultError
    }`}>
      {testResult.message}
    </div>
  )
}

export default TestResult