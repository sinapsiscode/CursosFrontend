export const TEST_LABELS = {
  title: 'Test del Sistema de Fidelización',
  runButton: 'Ejecutar Pruebas',
  addPoints: 'Agregar puntos',
  verifyLevel: 'Verificar nivel',
  coursePoints: 'Puntos por curso',
  persistence: 'Persistencia de datos',
  removePoints: 'Remover puntos',
  listUsers: 'Listar usuarios',
  successful: '✓ Exitoso',
  failed: '✗ Falló'
}

export const TEST_VALUES = {
  testPoints: 250,
  coursePoints: 100,
  removePoints: 50,
  expectedTotal: 350,
  expectedLevel: 'bronce'
}

export const TEST_STYLES = {
  container: 'bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto',
  title: 'text-xl font-bold text-white mb-4',
  runButton: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium mb-6',
  resultsContainer: 'space-y-3',
  resultCard: 'p-3 rounded-lg',
  successCard: 'bg-green-900/30 border border-green-500/30',
  failureCard: 'bg-red-900/30 border border-red-500/30',
  resultHeader: 'flex items-center justify-between',
  testName: 'text-white font-medium',
  successStatus: 'text-green-400',
  failureStatus: 'text-red-400',
  details: 'text-sm text-gray-400 mt-1'
}

export const TEST_DEFINITIONS = [
  {
    id: 'addPoints',
    name: 'Agregar puntos',
    description: 'Test: Curso completado'
  },
  {
    id: 'verifyLevel',
    name: 'Verificar nivel'
  },
  {
    id: 'courseCompletion',
    name: 'Puntos por curso'
  },
  {
    id: 'persistence',
    name: 'Persistencia de datos'
  },
  {
    id: 'removePoints',
    name: 'Remover puntos',
    description: 'Test: Ajuste'
  },
  {
    id: 'listUsers',
    name: 'Listar usuarios'
  }
]

export const TEST_COURSE = {
  id: 'course_test_1',
  name: 'Curso de Prueba',
  isPremium: false
}