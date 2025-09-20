import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const StudentCreatePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedArea: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Estudiante creado:', formData)
      navigate('/admin/students')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout title="Nuevo Estudiante">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 bg-card border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-card transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Crear Estudiante'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default StudentCreatePage