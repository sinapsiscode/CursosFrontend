import { TEST_VALUES, TEST_COURSE } from '../constants/loyaltyTesterConstants'

export const generateTestUserId = () => {
  return 'test_user_' + Date.now()
}

export const createTestResult = (testName, success, details) => {
  return {
    test: testName,
    success,
    details
  }
}

export const runAddPointsTest = async (loyaltyService, userId) => {
  const result = await loyaltyService.adminAddPoints(
    userId,
    TEST_VALUES.testPoints,
    'Test: Curso completado'
  )

  return createTestResult(
    'Agregar puntos',
    result.success,
    `Usuario ${userId}: +${TEST_VALUES.testPoints} puntos`
  )
}

export const runVerifyLevelTest = (loyaltyService, userId) => {
  const userData = loyaltyService.getUserPoints(userId)
  const success = userData.currentLevel === TEST_VALUES.expectedLevel

  return createTestResult(
    'Verificar nivel',
    success,
    `Nivel: ${userData.currentLevel}, Puntos: ${userData.availablePoints}`
  )
}

export const runCourseCompletionTest = async (loyaltyService, userId) => {
  const result = await loyaltyService.addPointsForCourseCompletion(
    TEST_COURSE.id,
    TEST_COURSE.name,
    TEST_COURSE.isPremium,
    userId
  )

  return createTestResult(
    'Puntos por curso',
    result.success,
    `+${TEST_VALUES.coursePoints} puntos por completar curso`
  )
}

export const runPersistenceTest = (loyaltyService, userId) => {
  const persistedData = loyaltyService.getUserPoints(userId)
  const success = persistedData.availablePoints === TEST_VALUES.expectedTotal

  return createTestResult(
    'Persistencia de datos',
    success,
    `Puntos totales: ${persistedData.availablePoints}`
  )
}

export const runRemovePointsTest = async (loyaltyService, userId) => {
  const result = await loyaltyService.adminRemovePoints(
    userId,
    TEST_VALUES.removePoints,
    'Test: Ajuste'
  )

  const currentPoints = loyaltyService.getUserPoints(userId).availablePoints

  return createTestResult(
    'Remover puntos',
    result.success,
    `-${TEST_VALUES.removePoints} puntos, Balance: ${currentPoints}`
  )
}

export const runListUsersTest = (loyaltyService) => {
  const allUsers = loyaltyService.getAllUsersWithPoints()
  const success = allUsers.length > 0

  return createTestResult(
    'Listar usuarios',
    success,
    `${allUsers.length} usuarios en el sistema`
  )
}

export const runAllTests = async (loyaltyService) => {
  const results = []
  const userId = generateTestUserId()

  // Test 1: Agregar puntos
  const addResult = await runAddPointsTest(loyaltyService, userId)
  results.push(addResult)

  // Test 2: Verificar nivel
  const levelResult = runVerifyLevelTest(loyaltyService, userId)
  results.push(levelResult)

  // Test 3: Completar curso
  const courseResult = await runCourseCompletionTest(loyaltyService, userId)
  results.push(courseResult)

  // Test 4: Verificar persistencia
  const persistenceResult = runPersistenceTest(loyaltyService, userId)
  results.push(persistenceResult)

  // Test 5: Remover puntos
  const removeResult = await runRemovePointsTest(loyaltyService, userId)
  results.push(removeResult)

  // Test 6: Listar usuarios
  const listResult = runListUsersTest(loyaltyService)
  results.push(listResult)

  return results
}