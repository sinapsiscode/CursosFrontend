import { useState } from 'react'
import { loyaltyService } from '../services/loyaltyService'

const LoyaltyTester = () => {
  const [testResults, setTestResults] = useState([])
  
  const runTests = async () => {
    const results = []
    
    // Test 1: Agregar puntos a un usuario
    const testUserId = 'test_user_' + Date.now()
    const addResult = await loyaltyService.adminAddPoints(testUserId, 250, 'Test: Curso completado')
    results.push({
      test: 'Agregar puntos',
      success: addResult.success,
      details: `Usuario ${testUserId}: +250 puntos`
    })
    
    // Test 2: Verificar nivel
    const userData = loyaltyService.getUserPoints(testUserId)
    results.push({
      test: 'Verificar nivel',
      success: userData.currentLevel === 'bronce',
      details: `Nivel: ${userData.currentLevel}, Puntos: ${userData.availablePoints}`
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
      details: `+100 puntos por completar curso`
    })
    
    // Test 4: Verificar persistencia
    const persistedData = loyaltyService.getUserPoints(testUserId)
    results.push({
      test: 'Persistencia de datos',
      success: persistedData.availablePoints === 350,
      details: `Puntos totales: ${persistedData.availablePoints}`
    })
    
    // Test 5: Remover puntos
    const removeResult = await loyaltyService.adminRemovePoints(testUserId, 50, 'Test: Ajuste')
    results.push({
      test: 'Remover puntos',
      success: removeResult.success,
      details: `-50 puntos, Balance: ${loyaltyService.getUserPoints(testUserId).availablePoints}`
    })
    
    // Test 6: Obtener todos los usuarios
    const allUsers = loyaltyService.getAllUsersWithPoints()
    results.push({
      test: 'Listar usuarios',
      success: allUsers.length > 0,
      details: `${allUsers.length} usuarios en el sistema`
    })
    
    setTestResults(results)
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Test del Sistema de Fidelización</h3>
      
      <button
        onClick={runTests}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium mb-6"
      >
        Ejecutar Pruebas
      </button>
      
      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{result.test}</span>
                <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                  {result.success ? '✓ Exitoso' : '✗ Falló'}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{result.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LoyaltyTester