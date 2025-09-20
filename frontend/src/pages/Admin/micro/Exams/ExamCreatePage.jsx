import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ExamCreatePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    timeLimit: 60,
    questions: 10,
    passingScore: 70
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Examen creado:', formData)
      navigate('/admin/exams')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout title="Crear Nuevo Examen">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Título del Examen
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
              placeholder="Ej: Examen Final de Metalurgia"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Curso Asociado
            </label>
            <select
              value={formData.course}
              onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
              className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Seleccionar curso</option>
              <option value="metalurgia">Fundamentos de Metalurgia</option>
              <option value="soldadura">Técnicas de Soldadura</option>
              <option value="mecanica">Mecánica Industrial</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tiempo Límite (min)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Número de Preguntas
              </label>
              <input
                type="number"
                value={formData.questions}
                onChange={(e) => setFormData(prev => ({ ...prev, questions: Number(e.target.value) }))}
                className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Puntuación Mínima (%)
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
                min="1"
                max="100"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/exams')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-card transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Creando...' : 'Crear Examen'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default ExamCreatePage