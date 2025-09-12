import { useState, useEffect } from 'react'
import { loyaltyService } from '../../services/loyaltyService'
import { useUIStore } from '../../store'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const LoyaltyTester = () => {
  const { showToast } = useUIStore()
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [hardcodedValues, setHardcodedValues] = useState({})

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
        setHardcodedValues({
          points: {
            loyaltyTestAmount: 250,
            courseCompletion: 100
          }
        })
      }
    }
    loadHardcodedValues()
  }, [])
  
  const runTests = async () => {
    setIsRunning(true)
    const results = []
    
    try {
      const testUserId = 'test_user_' + Date.now()
      
      // Test 1: Agregar puntos a un usuario
      const testPoints = hardcodedValues?.points?.loyaltyTestAmount || 250
      const addResult = await loyaltyService.adminAddPoints(testUserId, testPoints, 'Test: Curso completado')
      results.push({
        test: 'Agregar puntos',
        success: addResult.success,
        details: `Usuario ${testUserId}: +${testPoints} puntos`,
        icon: '➕'
      })
      
      // Test 2: Verificar nivel
      const userData = loyaltyService.getUserPoints(testUserId)
      results.push({
        test: 'Verificar nivel',
        success: userData.currentLevel === 'bronce',
        details: `Nivel: ${userData.currentLevel}, Puntos: ${userData.availablePoints}`,
        icon: '🏆'
      })
      
      // Test 3: Completar curso y otorgar puntos
      const courseResult = await loyaltyService.addPointsForCourseCompletion(
        'course_test_1',
        'Curso de Prueba',
        false,
        testUserId
      )
      results.push({
        test: 'Puntos por curso',
        success: courseResult.success,
        details: `+${hardcodedValues?.points?.courseCompletion || 100} puntos por completar curso`,
        icon: '📚'
      })
      
      // Test 4: Verificar persistencia
      const persistedData = loyaltyService.getUserPoints(testUserId)
      results.push({
        test: 'Persistencia de datos',
        success: persistedData.availablePoints === (testPoints + (hardcodedValues?.points?.courseCompletion || 100)),
        details: `Puntos totales: ${persistedData.availablePoints}`,
        icon: '💾'
      })
      
      // Test 5: Remover puntos
      const removePoints = 50
      const removeResult = await loyaltyService.adminRemovePoints(testUserId, removePoints, 'Test: Ajuste')
      results.push({
        test: 'Remover puntos',
        success: removeResult.success,
        details: `-${removePoints} puntos, Balance: ${loyaltyService.getUserPoints(testUserId).availablePoints}`,
        icon: '➖'
      })
      
      // Test 6: Obtener todos los usuarios
      const allUsers = loyaltyService.getAllUsersWithPoints()
      results.push({
        test: 'Listar usuarios',
        success: allUsers.length > 0,
        details: `${allUsers.length} usuarios en el sistema`,
        icon: '👥'
      })
      
      // Test 7: Verificar niveles y umbrales
      const levels = loyaltyService.config.levels
      results.push({
        test: 'Configuración de niveles',
        success: levels && Object.keys(levels).length > 0,
        details: `${Object.keys(levels).length} niveles configurados`,
        icon: '📊'
      })
      
      // Test 8: Verificar recompensas disponibles
      const rewards = loyaltyService.config.rewards || []
      results.push({
        test: 'Recompensas disponibles',
        success: rewards.length > 0,
        details: `${rewards.length} recompensas en el catálogo`,
        icon: '🎁'
      })
      
      // Test 9: Simular canje de recompensa
      const minRedeemPoints = hardcodedValues?.points?.courseCompletion || 100
      const canRedeemResult = loyaltyService.getUserPoints(testUserId).availablePoints >= minRedeemPoints
      results.push({
        test: 'Elegibilidad para canje',
        success: canRedeemResult,
        details: canRedeemResult ? 'Usuario puede canjear recompensas' : 'Puntos insuficientes',
        icon: '🛒'
      })
      
      // Test 10: Historial de transacciones
      const history = loyaltyService.getUserHistory(testUserId)
      results.push({
        test: 'Historial de transacciones',
        success: history && history.length > 0,
        details: `${history?.length || 0} transacciones registradas`,
        icon: '📜'
      })
      
      setTestResults(results)
      
      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length
      
      showToast(
        `Pruebas completadas: ${successCount} exitosas, ${failCount} fallidas`,
        successCount === results.length ? 'success' : failCount > 0 ? 'error' : 'warning'
      )
    } catch (error) {
      console.error('Error running tests:', error)
      showToast('Error al ejecutar las pruebas', 'error')
    } finally {
      setIsRunning(false)
    }
  }
  
  const clearTests = () => {
    setTestResults([])
    showToast('Resultados limpiados', 'info')
  }
  
  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      results: testResults,
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.success).length,
        failed: testResults.filter(r => !r.success).length
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `loyalty-test-results-${Date.now()}.json`
    a.click()
    window.URL.revokeObjectURL(url)
    
    showToast('Resultados exportados', 'success')
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">🧪 Test del Sistema de Fidelización</h3>
          <p className="text-gray-400 text-sm mt-1">
            Ejecuta pruebas automatizadas para verificar el funcionamiento del sistema de puntos
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {testResults.length > 0 && (
            <>
              <button
                onClick={exportResults}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Exportar</span>
              </button>
              
              <button
                onClick={clearTests}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Limpiar
              </button>
            </>
          )}
          
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ejecutando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Ejecutar Pruebas</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {testResults.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {testResults.length}
              </div>
              <div className="text-gray-400 text-sm">Tests Totales</div>
            </div>
            
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {testResults.filter(r => r.success).length}
              </div>
              <div className="text-gray-400 text-sm">Exitosos</div>
            </div>
            
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {testResults.filter(r => !r.success).length}
              </div>
              <div className="text-gray-400 text-sm">Fallidos</div>
            </div>
          </div>
          
          {/* Test Results */}
          <div className="space-y-3">
            {testResults.map((result, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-lg transition-all ${
                  result.success 
                    ? 'bg-green-900/20 border border-green-500/30 hover:bg-green-900/30' 
                    : 'bg-red-900/20 border border-red-500/30 hover:bg-red-900/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{result.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{result.test}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          result.success 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          Test #{idx + 1}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{result.details}</p>
                    </div>
                  </div>
                  
                  <span className={`flex items-center space-x-1 ${
                    result.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.success ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Exitoso</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Falló</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {testResults.length === 0 && !isRunning && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧪</div>
          <h3 className="text-lg font-medium text-white mb-2">
            No hay resultados de pruebas
          </h3>
          <p className="text-gray-400 text-sm">
            Haz clic en "Ejecutar Pruebas" para comenzar el diagnóstico del sistema
          </p>
        </div>
      )}
    </div>
  )
}

export default LoyaltyTester