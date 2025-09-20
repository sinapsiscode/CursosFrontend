import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ExamListPage = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Simular carga de exámenes
    const timer = setTimeout(() => {
      setExams([
        { id: 1, title: 'Examen de Metalurgia Básica', course: 'Fundamentos de Metalurgia', students: 45, status: 'active' },
        { id: 2, title: 'Evaluación de Soldadura', course: 'Técnicas de Soldadura', students: 32, status: 'draft' },
        { id: 3, title: 'Prueba de Mecánica Industrial', course: 'Mecánica Industrial', students: 28, status: 'active' }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  const filteredExams = exams.filter(exam =>
    filter === 'all' || exam.status === filter
  )

  return (
    <PageLayout
      title="Gestión de Exámenes"
      action={{
        label: "Nuevo Examen",
        href: "/admin/exams/create"
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">
            Administración de exámenes y evaluaciones
          </p>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-card border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">Todos los exámenes</option>
            <option value="active">Activos</option>
            <option value="draft">Borradores</option>
          </select>
        </div>

        <div className="bg-card rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="text-left p-4 text-white">Examen</th>
                <th className="text-left p-4 text-white">Curso</th>
                <th className="text-left p-4 text-white">Estudiantes</th>
                <th className="text-left p-4 text-white">Estado</th>
                <th className="text-left p-4 text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => (
                <tr key={exam.id} className="border-t border-gray-700">
                  <td className="p-4 text-white">{exam.title}</td>
                  <td className="p-4 text-text-secondary">{exam.course}</td>
                  <td className="p-4 text-white">{exam.students}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      exam.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {exam.status === 'active' ? 'Activo' : 'Borrador'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => window.location.href = `/admin/exams/config?id=${exam.id}`}
                      className="text-accent hover:underline text-sm"
                    >
                      Configurar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}

export default ExamListPage