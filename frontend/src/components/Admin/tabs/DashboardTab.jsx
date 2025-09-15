import { useState, useEffect } from 'react'
import { StatCard, DataTable, ActionButton } from '../common'
import { CHART_COLORS, TIME_RANGES, MESSAGES } from '../../../config/admin.constants'
import { apiService } from '../../../services/api'

const DashboardTab = ({ analytics, users, courses }) => {
  const [timeRange, setTimeRange] = useState(TIME_RANGES.WEEK.value)
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    loadChartData()
  }, [timeRange])

  const loadChartData = async () => {
    setLoading(true)
    try {
      // Simular carga de datos del gráfico
      await new Promise(resolve => setTimeout(resolve, 500))
      setChartData([
        { day: 'Lun', value: 45 },
        { day: 'Mar', value: 52 },
        { day: 'Mie', value: 48 },
        { day: 'Jue', value: 58 },
        { day: 'Vie', value: 65 },
        { day: 'Sab', value: 72 },
        { day: 'Dom', value: 68 }
      ])
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Configuración de columnas para la tabla de cursos populares
  const courseColumns = [
    {
      key: 'name',
      label: 'Curso',
      sortable: true
    },
    {
      key: 'students',
      label: 'Estudiantes',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'revenue',
      label: 'Ingresos',
      sortable: true,
      render: (value) => `S/. ${value.toLocaleString()}`
    },
    {
      key: 'rating',
      label: 'Calificación',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">⭐</span>
          {value.toFixed(1)}
        </div>
      )
    }
  ]

  // Datos de ejemplo para cursos populares
  const topCourses = courses.slice(0, 5).map(course => ({
    ...course,
    students: Math.floor(Math.random() * 1000),
    revenue: Math.floor(Math.random() * 50000),
    rating: (Math.random() * 2 + 3).toFixed(1)
  }))

  // Configuración de columnas para usuarios recientes
  const userColumns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'registeredAt',
      label: 'Registro',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {value === 'active' ? 'Activo' : 'Pendiente'}
        </span>
      )
    }
  ]

  // Usuarios recientes de ejemplo
  const recentUsers = users.slice(0, 5).map(user => ({
    ...user,
    registeredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    status: Math.random() > 0.3 ? 'active' : 'pending'
  }))

  return (
    <>
      {/* Selector de rango de tiempo */}
      <div className="flex justify-end mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-surface text-white rounded-lg border border-text-secondary/20"
        >
          {Object.values(TIME_RANGES).map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Usuarios"
          value={analytics.totalUsers}
          change={12}
          color="primary"
          icon={
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />

        <StatCard
          title="Total Estudiantes"
          value={analytics.totalStudents}
          change={8}
          color="secondary"
          icon={
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
        />

        <StatCard
          title="Total Cursos"
          value={analytics.totalCourses}
          change={-2}
          color="tertiary"
          icon={
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />

        <StatCard
          title="Ingresos Totales"
          value={`S/. ${analytics.totalRevenue.toLocaleString()}`}
          change={15}
          color="quaternary"
          icon={
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Gráfico de actividad */}
      <div className="bg-surface rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-accent rounded-t transition-all duration-300 hover:bg-accent-dark"
                  style={{ height: `${(item.value / 100) * 256}px` }}
                />
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tablas de información */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cursos populares */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Cursos Populares</h3>
          <DataTable
            columns={courseColumns}
            data={topCourses}
            searchable={false}
            paginated={false}
          />
        </div>

        {/* Usuarios recientes */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Usuarios Recientes</h3>
          <DataTable
            columns={userColumns}
            data={recentUsers}
            searchable={false}
            paginated={false}
          />
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8 flex flex-wrap gap-4">
        <ActionButton
          variant="primary"
          icon="➕"
          onClick={() => console.log('Nuevo curso')}
        >
          Nuevo Curso
        </ActionButton>

        <ActionButton
          variant="secondary"
          icon="📊"
          onClick={() => console.log('Ver reportes')}
        >
          Ver Reportes Completos
        </ActionButton>

        <ActionButton
          variant="success"
          icon="💾"
          onClick={() => console.log('Exportar datos')}
        >
          Exportar Datos
        </ActionButton>
      </div>
    </>
  )
}

export default DashboardTab