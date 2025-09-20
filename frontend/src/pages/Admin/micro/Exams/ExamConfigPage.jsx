import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ExamConfigPage = () => {
  const [searchParams] = useSearchParams()
  const examId = searchParams.get('id')
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Simular carga de configuración
    const timer = setTimeout(() => {
      setConfig({
        id: examId,
        title: 'Examen de Metalurgia Básica',
        randomizeQuestions: true,
        showResults: false,
        allowRetake: true,
        maxAttempts: 3,
        timeLimit: 60
      })
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [examId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Configuración guardada:', config)
      alert('Configuración guardada exitosamente')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title={`Configurar: ${config.title}`}
      action={{
        label: "Guardar Cambios",
        href: "#"
      }}
    >
      <div className="max-w-2xl space-y-6">
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Configuración General</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Aleatorizar Preguntas</label>
                <p className="text-text-secondary text-sm">Las preguntas aparecen en orden aleatorio</p>
              </div>
              <input
                type="checkbox"
                checked={config.randomizeQuestions}
                onChange={(e) => setConfig(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
                className="w-4 h-4 text-accent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Mostrar Resultados</label>
                <p className="text-text-secondary text-sm">Mostrar respuestas correctas al finalizar</p>
              </div>
              <input
                type="checkbox"
                checked={config.showResults}
                onChange={(e) => setConfig(prev => ({ ...prev, showResults: e.target.checked }))}
                className="w-4 h-4 text-accent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Permitir Reintento</label>
                <p className="text-text-secondary text-sm">Los estudiantes pueden repetir el examen</p>
              </div>
              <input
                type="checkbox"
                checked={config.allowRetake}
                onChange={(e) => setConfig(prev => ({ ...prev, allowRetake: e.target.checked }))}
                className="w-4 h-4 text-accent"
              />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Límites y Restricciones</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Máximo de Intentos
              </label>
              <input
                type="number"
                value={config.maxAttempts}
                onChange={(e) => setConfig(prev => ({ ...prev, maxAttempts: Number(e.target.value) }))}
                className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tiempo Límite (minutos)
              </label>
              <input
                type="number"
                value={config.timeLimit}
                onChange={(e) => setConfig(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white"
                min="1"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-accent text-background py-3 rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </PageLayout>
  )
}

export default ExamConfigPage