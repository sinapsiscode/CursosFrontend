import { useState } from 'react'
import { loyaltyService } from '../services/loyaltyService'
import { runAllTests } from '../utils/loyaltyTesterUtils'

export const useLoyaltyTester = () => {
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    try {
      const results = await runAllTests(loyaltyService)
      setTestResults(results)
    } catch (error) {
      console.error('Error running tests:', error)
      setTestResults([{
        test: 'Error en las pruebas',
        success: false,
        details: error.message
      }])
    } finally {
      setIsRunning(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return {
    testResults,
    isRunning,
    runTests,
    clearResults
  }
}