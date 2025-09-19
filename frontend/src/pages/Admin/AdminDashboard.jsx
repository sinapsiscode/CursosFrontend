import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store'
import { LoadingSpinner } from '../../components/common'
import { apiService } from '../../services/api'
import { whatsappService } from '../../services/whatsappService'
import { notificationService } from '../../services/notificationService'
import NotificationManagement from '../../components/AdminDashboard/NotificationManagement'
import AdminEvents from './AdminEvents'
import AdminExamsV2 from './AdminExamsV2'
import WhatsAppManagementNew from './WhatsAppManagement'
import StudentManagementOld from './StudentManagement'
import StudentManagement from '../../components/AdminDashboard/StudentManagement'
import ReviewModeration from './ReviewModeration'
import LoyaltyManagement from './LoyaltyManagement'
import AdminPhotos from './AdminPhotos'
import CourseCreationForm from '../../components/Admin/CourseCreationForm'
import CoursePreviewModal from '../../components/Admin/CoursePreviewModal'
import DashboardStats from '../../components/AdminDashboard/DashboardStats'
import CourseManagement from '../../components/AdminDashboard/CourseManagement'
import StudentEnrollmentManagement from '../../components/StudentEnrollmentManagement'
import WhatsAppManagement from '../../components/AdminDashboard/WhatsAppManagement'
import CourseEnrollmentManagement from '../../components/AdminDashboard/CourseEnrollmentManagement'
import * as XLSX from 'xlsx'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const {
    analytics,
    users,
    courses,
    coursesWithEnrollment,
    areas,
    levels,
    updateAnalytics,
    calculateAnalytics,
    setCoursesWithEnrollment,
    getCourseEnrollmentData,
    updateCourseEnrollment,
    setAreas,
    setLevels,
    getActiveAreas
  } = useAdminStore()
  
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week') // week, month, year
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, courses, enrollments, students, student-enrollments, coupons, areas, reports, whatsapp, notifications, events, exams, reviews, loyalty, photos
  const [previewCourse, setPreviewCourse] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)


  // SOLID: Single Responsibility - Carga de datos memorizada para evitar re-renders
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔄 AdminDashboard: Cargando datos del dashboard...')
      
      // Cargar usuarios y cursos mock con manejo individual de errores
      console.log('📥 Cargando usuarios...')
      const allUsers = await apiService.getUsers()
      console.log('✅ Usuarios cargados:', allUsers?.length || 0)
      
      console.log('📥 Cargando cursos...')
      const allCourses = await apiService.getCourses()
      console.log('✅ Cursos cargados:', allCourses?.length || 0)
      
      console.log('📥 Cargando datos de inscripciones...')
      const coursesWithEnrollmentData = await apiService.getCoursesWithEnrollment()
      console.log('✅ Datos de inscripciones cargados:', coursesWithEnrollmentData?.length || 0)
      
      console.log('📥 Cargando áreas...')
      const allAreas = await apiService.getAreas(true) // Incluir inactivas para admin
      console.log('✅ Áreas cargadas:', allAreas?.length || 0)
      
      console.log('📥 Cargando niveles...')
      const allLevels = await apiService.getLevels()
      console.log('✅ Niveles cargados:', allLevels?.length || 0)
      
      // SOLID: Dependency Inversion - Usar store abstracto
      const adminStore = useAdminStore.getState()
      adminStore.setUsers(allUsers)
      adminStore.setCourses(allCourses)
      setCoursesWithEnrollment(coursesWithEnrollmentData)
      setAreas(allAreas)
      setLevels(allLevels)
      
      // Debug logging profesional
      console.log('✅ Dashboard data loaded:', {
        users: allUsers.length,
        courses: allCourses.length,
        coursesWithEnrollment: coursesWithEnrollmentData.length,
        areas: allAreas.length,
        levels: allLevels.length
      })
      
      // Cargar datos analíticos
      const analyticsData = await apiService.getAnalytics()
      updateAnalytics(analyticsData)
      calculateAnalytics()
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error)
      console.error('📋 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // SOLID: Open/Closed Principle - Datos por defecto para evitar crashes
      setUsers([])
      setCourses([])
      setCoursesWithEnrollment([])
      setAreas([])
      setLevels([])
    } finally {
      setLoading(false)
      console.log('🏁 AdminDashboard: Carga de datos completada')
    }
  }, []) // Sin dependencias - las funciones del store son estables

  useEffect(() => {
    loadDashboardData()
  }, [timeRange]) // Solo timeRange como dependencia


  // WhatsApp Management Component


  const AreaManagement = () => {
    const [editingArea, setEditingArea] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [formData, setFormData] = useState({
      key: '',
      name: '',
      description: '',
      active: true
    })

    const resetForm = () => {
      setFormData({
        key: '',
        name: '',
        description: '',
        active: true
      })
      setEditingArea(null)
      setShowCreateForm(false)
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      // Generar datos automáticamente con valores por defecto
      const enhancedFormData = {
        ...formData,
        key: formData.key.toLowerCase().replace(/\s+/g, '-'),
        color: '#3b82f6', // TODO: REFACTOR - Valores por defecto hardcodeados
        icon: '📚', // TODO: REFACTOR - Icono por defecto hardcodeado
        bgColor: 'bg-blue-500', // TODO: REFACTOR - Clase CSS hardcodeada
        textColor: 'text-blue-500', // TODO: REFACTOR - Clase CSS hardcodeada
        primaryColor: 'text-blue-500', // TODO: REFACTOR - Clase CSS hardcodeada
      }

      try {
        if (editingArea) {
          await apiService.updateArea(editingArea.id, enhancedFormData)
          useAdminStore.getState().updateArea(editingArea.id, enhancedFormData)
          console.log('✅ Área actualizada:', formData.name)
        } else {
          const result = await apiService.createArea(enhancedFormData)
          useAdminStore.getState().addArea(enhancedFormData)
          console.log('✅ Área creada:', formData.name)
        }
        resetForm()
        await loadDashboardData()
      } catch (error) {
        console.error('Error saving area:', error)
        alert('Error al guardar el área. Inténtalo de nuevo.')
      }
    }

    const handleEdit = (area) => {
      setFormData({
        key: area.key,
        name: area.name,
        description: area.description,
        active: area.active
      })
      setEditingArea(area)
      setShowCreateForm(true)
    }

    const handleDelete = async (area) => {
      if (confirm(`¿Estás seguro de que quieres eliminar "${area.name}"?`)) {
        try {
          await apiService.deleteArea(area.id)
          useAdminStore.getState().deleteArea(area.id)
          console.log('✅ Área eliminada:', area.name)
          await loadDashboardData()
        } catch (error) {
          console.error('Error deleting area:', error)
          alert('Error al eliminar el área. Inténtalo de nuevo.')
        }
      }
    }

    const toggleAreaStatus = async (area) => {
      try {
        const updates = { active: !area.active }
        await apiService.updateArea(area.id, updates)
        useAdminStore.getState().updateArea(area.id, updates)
        console.log(`✅ Área ${updates.active ? 'activada' : 'desactivada'}:`, area.name)
        await loadDashboardData()
      } catch (error) {
        console.error('Error toggling area status:', error)
        alert('Error al cambiar el estado del área. Inténtalo de nuevo.')
      }
    }

    return (
      <div className="bg-surface rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white mb-4 md:mb-0">
            Gestión de Áreas de Estudio
          </h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            {showCreateForm ? 'Cancelar' : 'Crear Área'}
          </button>
        </div>

        {/* Formulario */}
        {showCreateForm && (
          <div className="bg-background rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              {editingArea ? 'Editar Área' : 'Crear Nueva Área'}
            </h4>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Clave (URL-friendly)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                  className="w-full bg-surface border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="ej: ingenieria-civil"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-text-secondary text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="2"
                  className="w-full bg-surface border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="w-4 h-4 text-accent bg-surface border-gray-600 rounded focus:ring-accent focus:ring-2"
                  />
                  <span className="text-text-secondary text-sm">Área activa</span>
                </label>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  {editingArea ? 'Actualizar' : 'Crear'} Área
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de áreas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map(area => (
            <div key={area.id} className="bg-background rounded-lg p-4 border-l-4" style={{ borderLeftColor: area.color }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{area.icon}</span>
                  <div>
                    <h4 className="text-white font-medium">{area.name}</h4>
                    <p className="text-text-secondary text-xs">{area.key}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${area.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-200'}`}>
                    {area.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-4">{area.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(area)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleAreaStatus(area)}
                  className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                    area.active 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {area.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(area)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {areas.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            <p>No hay áreas configuradas. Crea la primera área usando el botón "Crear Área".</p>
          </div>
        )}
      </div>
    )
  }

  const ReportsManagement = () => {
    const [activeReport, setActiveReport] = useState('access-times') // access-times, popular-courses, time-spent
    
    // Datos simulados para horarios de ingreso
    const accessTimesData = [
      { hour: '6:00', students: 45 },
      { hour: '7:00', students: 120 },
      { hour: '8:00', students: 280 },
      { hour: '9:00', students: 350 },
      { hour: '10:00', students: 320 },
      { hour: '11:00', students: 290 },
      { hour: '12:00', students: 180 },
      { hour: '13:00', students: 150 },
      { hour: '14:00', students: 220 },
      { hour: '15:00', students: 280 },
      { hour: '16:00', students: 310 },
      { hour: '17:00', students: 380 },
      { hour: '18:00', students: 420 },
      { hour: '19:00', students: 450 },
      { hour: '20:00', students: 380 },
      { hour: '21:00', students: 250 },
      { hour: '22:00', students: 120 },
      { hour: '23:00', students: 60 }
    ]
    
    // Datos simulados para cursos más vistos
    const popularCoursesData = [
      { name: 'Metalurgia Básica', views: 3450, enrollments: 892, completion: 78 },
      { name: 'Minería Subterránea', views: 2890, enrollments: 756, completion: 82 },
      { name: 'Geología Estructural', views: 2340, enrollments: 623, completion: 75 },
      { name: 'Procesamiento de Minerales', views: 2120, enrollments: 548, completion: 80 },
      { name: 'Seguridad Minera', views: 1980, enrollments: 512, completion: 88 },
      { name: 'Hidrogeología', views: 1750, enrollments: 423, completion: 71 },
      { name: 'Metalurgia Extractiva', views: 1620, enrollments: 398, completion: 74 },
      { name: 'Geofísica Aplicada', views: 1480, enrollments: 367, completion: 69 },
      { name: 'Control de Calidad', views: 1350, enrollments: 334, completion: 85 },
      { name: 'Mineralogía', views: 1200, enrollments: 298, completion: 72 }
    ]
    
    // Datos simulados para tiempo en plataforma
    const timeSpentData = [
      { range: '0-15 min', students: 120, percentage: 8 },
      { range: '15-30 min', students: 280, percentage: 18 },
      { range: '30-60 min', students: 450, percentage: 29 },
      { range: '1-2 horas', students: 380, percentage: 25 },
      { range: '2-4 horas', students: 220, percentage: 14 },
      { range: '4+ horas', students: 90, percentage: 6 }
    ]
    
    const averageSessionTime = '1h 32min'
    const totalActiveStudents = 1540
    
    // Función para exportar reportes a Excel
    const exportReportToExcel = () => {
      let data = []
      let fileName = ''
      
      switch(activeReport) {
        case 'access-times':
          data = accessTimesData.map(item => ({
            'Hora': item.hour,
            'Estudiantes': item.students
          }))
          fileName = 'reporte-horarios-ingreso'
          break
          
        case 'popular-courses':
          data = popularCoursesData.map(course => ({
            'Curso': course.name,
            'Vistas': course.views,
            'Inscripciones': course.enrollments,
            'Tasa de Completado (%)': course.completion
          }))
          fileName = 'reporte-cursos-populares'
          break
          
        case 'time-spent':
          data = timeSpentData.map(item => ({
            'Rango de Tiempo': item.range,
            'Estudiantes': item.students,
            'Porcentaje': `${item.percentage}%`
          }))
          fileName = 'reporte-tiempo-plataforma'
          break
      }
      
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte')
      XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`)
    }
    
    // Función para obtener el mayor valor de estudiantes
    const getMaxStudents = () => {
      return Math.max(...accessTimesData.map(item => item.students))
    }

    return (
      <div className="space-y-6">
        {/* Navegación de reportes */}
        <div className="bg-surface rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white mb-4 md:mb-0">
              Reportes y Métricas
            </h3>
            <button
              onClick={exportReportToExcel}
              className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Exportar Excel
            </button>
          </div>
          
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveReport('access-times')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeReport === 'access-times'
                  ? 'bg-accent text-background'
                  : 'bg-background text-white hover:bg-gray-700'
              }`}
            >
              Horarios de Ingreso
            </button>
            <button
              onClick={() => setActiveReport('popular-courses')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeReport === 'popular-courses'
                  ? 'bg-accent text-background'
                  : 'bg-background text-white hover:bg-gray-700'
              }`}
            >
              Cursos Más Vistos
            </button>
            <button
              onClick={() => setActiveReport('time-spent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeReport === 'time-spent'
                  ? 'bg-accent text-background'
                  : 'bg-background text-white hover:bg-gray-700'
              }`}
            >
              Tiempo en Plataforma
            </button>
          </div>
        </div>

        {/* Reporte de Horarios de Ingreso */}
        {activeReport === 'access-times' && (
          <div className="bg-surface rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Horarios de Mayor Actividad
            </h4>
            <p className="text-text-secondary mb-6">
              Distribución de estudiantes activos por hora del día
            </p>
            
            {/* Gráfico de barras */}
            <div className="h-64 bg-background rounded-lg p-4 mb-6">
              <div className="flex items-end h-full space-x-1">
                {accessTimesData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full">
                      <div
                        className="bg-accent rounded-t transition-all duration-500 hover:bg-opacity-80"
                        style={{ height: `${(item.students / getMaxStudents()) * 200}px` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity">
                          {item.students}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-text-secondary mt-2 transform -rotate-45 origin-left">
                      {item.hour}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Insights */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4">
                <p className="text-text-secondary text-sm">Hora Pico</p>
                <p className="text-2xl font-bold text-white">19:00 - 20:00</p>
                <p className="text-accent text-sm">450 estudiantes</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-text-secondary text-sm">Promedio por Hora</p>
                <p className="text-2xl font-bold text-white">247</p>
                <p className="text-accent text-sm">estudiantes activos</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-text-secondary text-sm">Horario Preferido</p>
                <p className="text-2xl font-bold text-white">17:00 - 21:00</p>
                <p className="text-accent text-sm">62% del tráfico</p>
              </div>
            </div>
          </div>
        )}

        {/* Reporte de Cursos Populares */}
        {activeReport === 'popular-courses' && (
          <div className="bg-surface rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Top 10 Cursos Más Populares
            </h4>
            <p className="text-text-secondary mb-6">
              Ranking basado en vistas, inscripciones y tasa de completado
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">#</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Curso</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Vistas</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Inscripciones</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Completado</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Popularidad</th>
                  </tr>
                </thead>
                <tbody>
                  {popularCoursesData.map((course, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-background transition-colors">
                      <td className="py-4 px-4 text-white font-medium">{index + 1}</td>
                      <td className="py-4 px-4">
                        <p className="text-white font-medium">{course.name}</p>
                      </td>
                      <td className="py-4 px-4 text-center text-white">{course.views.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center text-white">{course.enrollments.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-medium ${
                          course.completion >= 80 ? 'text-green-400' : 
                          course.completion >= 70 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {course.completion}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${100 - (index * 10)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Resumen */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-background rounded-lg p-4">
                <p className="text-text-secondary text-sm">Total de Vistas</p>
                <p className="text-2xl font-bold text-white">21,940</p>
                <p className="text-green-400 text-sm">+15% este mes</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-text-secondary text-sm">Total Inscripciones</p>
                <p className="text-2xl font-bold text-white">5,641</p>
                <p className="text-green-400 text-sm">+23% este mes</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-text-secondary text-sm">Tasa Promedio</p>
                <p className="text-2xl font-bold text-white">76.8%</p>
                <p className="text-yellow-400 text-sm">de completado</p>
              </div>
            </div>
          </div>
        )}

        {/* Reporte de Tiempo en Plataforma */}
        {activeReport === 'time-spent' && (
          <div className="bg-surface rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Tiempo de Permanencia en la Plataforma
            </h4>
            <p className="text-text-secondary mb-6">
              Distribución del tiempo que los estudiantes pasan en la plataforma por sesión
            </p>
            
            {/* Gráfico circular simulado con barras */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-background rounded-lg p-6">
                <div className="space-y-4">
                  {timeSpentData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{item.range}</span>
                        <span className="text-text-secondary">{item.students} estudiantes ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-orange-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-green-500' :
                            index === 4 ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${item.percentage * 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-6">
                <h5 className="text-white font-medium mb-4">Estadísticas Clave</h5>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-secondary text-sm">Tiempo Promedio por Sesión</p>
                    <p className="text-3xl font-bold text-accent">{averageSessionTime}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Estudiantes Activos Hoy</p>
                    <p className="text-3xl font-bold text-white">{totalActiveStudents}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Sesiones Largas (+2h)</p>
                    <p className="text-3xl font-bold text-green-400">20%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Insights adicionales */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 font-medium mb-2">💡 Insight Importante</p>
              <p className="text-white">
                El 54% de los estudiantes permanecen entre 30 minutos y 2 horas, 
                lo que indica un alto nivel de engagement con el contenido. 
                Se recomienda optimizar las lecciones para este rango de tiempo.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Student Management Component
  const StudentManager = () => {
    const [students, setStudents] = useState([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingStudent, setEditingStudent] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      area: '',
      dni: '',
      university: '',
      career: ''
    })
    const [validationErrors, setValidationErrors] = useState({})
    const [notification, setNotification] = useState(null)

    useEffect(() => {
      loadStudents()
    }, [])

    const loadStudents = async () => {
      try {
        const allStudents = await apiService.getStudents()
        setStudents(allStudents)
      } catch (error) {
        console.error('Error loading students:', error)
        setStudents([])
      }
    }

    const validateField = (field, value) => {
      const errors = { ...validationErrors }
      
      switch (field) {
        case 'dni':
          if (value && !/^\d{8}$/.test(value)) {
            errors.dni = 'El DNI debe tener exactamente 8 números'
          } else {
            delete errors.dni
          }
          break
          
        case 'phone':
          if (value && !/^9\d{8}$/.test(value)) {
            errors.phone = 'El teléfono debe tener 9 números y empezar con 9'
          } else {
            delete errors.phone
          }
          break
          
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.email = 'Ingresa un email válido'
          } else {
            delete errors.email
          }
          break
          
        case 'name':
          if (!value.trim()) {
            errors.name = 'El nombre es obligatorio'
          } else {
            delete errors.name
          }
          break
          
        case 'area':
          if (!value) {
            errors.area = 'Selecciona un área de estudio'
          } else {
            delete errors.area
          }
          break
      }
      
      setValidationErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      validateField(field, value)
    }

    const showNotification = (message, type = 'success') => {
      setNotification({ message, type })
      setTimeout(() => setNotification(null), 4000)
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      // Validar todos los campos
      const fieldsToValidate = ['name', 'email', 'area']
      if (formData.dni) fieldsToValidate.push('dni')
      if (formData.phone) fieldsToValidate.push('phone')
      
      let hasErrors = false
      fieldsToValidate.forEach(field => {
        if (!validateField(field, formData[field])) {
          hasErrors = true
        }
      })
      
      if (hasErrors) {
        showNotification('Por favor corrige los errores en el formulario', 'error')
        return
      }
      
      if (!formData.name.trim() || !formData.email.trim() || !formData.area) {
        showNotification('Por favor completa los campos obligatorios: Nombre, Email y Área', 'error')
        return
      }

      try {
        if (editingStudent) {
          await apiService.updateStudent(editingStudent.id, formData)
          showNotification('✅ Estudiante actualizado correctamente', 'success')
        } else {
          await apiService.createStudent(formData)
          showNotification('✅ Estudiante creado correctamente', 'success')
        }
        
        await loadStudents()
        handleCloseForm()
      } catch (error) {
        console.error('Error saving student:', error)
        showNotification(`Error: ${error.message}`, 'error')
      }
    }

    const handleEdit = (student) => {
      setEditingStudent(student)
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        area: student.area || '',
        dni: student.dni || '',
        university: student.university || '',
        career: student.career || ''
      })
      setShowCreateForm(true)
    }

    const handleDelete = async (student) => {
      if (window.confirm(`¿Estás seguro de que quieres eliminar al estudiante "${student.name}"?\n\nEsto también eliminará todas sus inscripciones.`)) {
        try {
          await apiService.deleteStudent(student.id)
          await loadStudents()
          showNotification('✅ Estudiante eliminado correctamente', 'success')
        } catch (error) {
          console.error('Error deleting student:', error)
          showNotification(`Error: ${error.message}`, 'error')
        }
      }
    }

    const handleSuspendToggle = async (student) => {
      const action = student.suspended ? 'reactivar' : 'suspender'
      if (window.confirm(`¿Estás seguro de que quieres ${action} al estudiante "${student.name}"?`)) {
        try {
          await apiService.toggleStudentSuspension(student.id)
          await loadStudents()
          const actionComplete = student.suspended ? 'reactivado' : 'suspendido'
          showNotification(`✅ Estudiante ${actionComplete} correctamente`, 'success')
        } catch (error) {
          console.error('Error toggling suspension:', error)
          showNotification(`Error: ${error.message}`, 'error')
        }
      }
    }

    const handleCloseForm = () => {
      setShowCreateForm(false)
      setEditingStudent(null)
      setValidationErrors({})
      setFormData({
        name: '',
        email: '',
        phone: '',
        area: '',
        dni: '',
        university: '',
        career: ''
      })
    }

    const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.area.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getAreaColor = (area) => {
      switch(area) {
        case 'metalurgia': return 'bg-blue-500'
        case 'mineria': return 'bg-green-500'
        case 'geologia': return 'bg-orange-500'
        default: return 'bg-gray-500'
      }
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-surface rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white mb-4 md:mb-0">
              Gestión de Estudiantes
            </h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              + Agregar Estudiante
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre, email o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background rounded-lg p-4">
              <p className="text-text-secondary text-sm">Total Estudiantes</p>
              <p className="text-2xl font-bold text-white">{students.length}</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-text-secondary text-sm">Metalurgia</p>
              <p className="text-2xl font-bold text-blue-400">
                {students.filter(s => s.area === 'metalurgia').length}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-text-secondary text-sm">Minería</p>
              <p className="text-2xl font-bold text-green-400">
                {students.filter(s => s.area === 'mineria').length}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-text-secondary text-sm">Geología</p>
              <p className="text-2xl font-bold text-orange-400">
                {students.filter(s => s.area === 'geologia').length}
              </p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-surface rounded-xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Estudiante</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Área</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">DNI</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Universidad</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{student.name}</p>
                          <p className="text-text-secondary text-sm">{student.email}</p>
                          {student.phone && (
                            <p className="text-text-secondary text-xs">{student.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`${getAreaColor(student.area)} text-white text-xs px-2 py-1 rounded-full`}>
                          {student.area?.charAt(0).toUpperCase() + student.area?.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          student.suspended 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {student.suspended ? 'Suspendido' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">{student.dni || '-'}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white text-sm">{student.university || '-'}</p>
                          {student.career && (
                            <p className="text-text-secondary text-xs">{student.career}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleSuspendToggle(student)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              student.suspended 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                          >
                            {student.suspended ? 'Reactivar' : 'Suspender'}
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-text-secondary">
                      {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingStudent ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                        validationErrors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-600 focus:border-accent'
                      }`}
                      required
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                        validationErrors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-600 focus:border-accent'
                      }`}
                      required
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Teléfono <span className="text-xs text-gray-400">(9 dígitos, inicia con 9)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                        validationErrors.phone 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-600 focus:border-accent'
                      }`}
                      placeholder="987654321"
                      maxLength="9"
                    />
                    {validationErrors.phone && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Área de Estudio *
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                        validationErrors.area 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-600 focus:border-accent'
                      }`}
                      required
                    >
                      <option value="">-- Selecciona un área --</option>
                      <option value="metalurgia">Metalurgia</option>
                      <option value="mineria">Minería</option>
                      <option value="geologia">Geología</option>
                    </select>
                    {validationErrors.area && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.area}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      DNI <span className="text-xs text-gray-400">(8 dígitos)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={(e) => handleInputChange('dni', e.target.value)}
                      className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                        validationErrors.dni 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-600 focus:border-accent'
                      }`}
                      placeholder="12345678"
                      maxLength="8"
                    />
                    {validationErrors.dni && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.dni}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Universidad
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Carrera
                    </label>
                    <input
                      type="text"
                      value={formData.career}
                      onChange={(e) => handleInputChange('career', e.target.value)}
                      className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    {editingStudent ? 'Actualizar' : 'Crear'} Estudiante
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {notification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-surface rounded-xl p-6 w-full max-w-md border-2 ${
              notification.type === 'error' ? 'border-red-500' : 'border-green-500'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {notification.type === 'error' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{notification.message}</p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }


  // Exam Management Component
  const ExamManagement = () => {
    const [students, setStudents] = useState([])
    const [courses, setCourses] = useState([])
    const [examConfigs, setExamConfigs] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedArea, setSelectedArea] = useState('all')
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState(null)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [currentConfig, setCurrentConfig] = useState(null)

    useEffect(() => {
      loadData()
    }, [])

    const loadData = async () => {
      try {
        setLoading(true)
        const [studentsData, coursesData, configsData] = await Promise.all([
          apiService.getStudents(),
          apiService.getCourses(),
          apiService.getExamConfigs()
        ])
        setStudents(studentsData)
        setCourses(coursesData)
        setExamConfigs(configsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    const showNotification = (message, type = 'success') => {
      setNotification({ message, type })
      setTimeout(() => setNotification(null), 3000)
    }

    const handleToggleExam = async (studentId, courseId, isEnabled) => {
      try {
        if (isEnabled) {
          await apiService.disableExamForStudent(studentId, courseId)
          showNotification('Examen deshabilitado para el estudiante', 'success')
        } else {
          // Abrir modal para configurar el examen
          const courseData = courses.find(c => c.id === courseId)
          const studentData = students.find(s => s.id === studentId)
          setCurrentConfig({
            studentId,
            courseId,
            studentName: studentData.name,
            courseTitle: courseData.title,
            discountRanges: [
              { min: 18, max: 20, discount: 20 },
              { min: 15, max: 17, discount: 15 },
              { min: 11, max: 14, discount: 10 }
            ],
            expirationDays: 30,
            maxAttempts: 1
          })
          setShowConfigModal(true)
        }
      } catch (error) {
        console.error('Error toggling exam:', error)
        showNotification(`Error: ${error.message}`, 'error')
      }
    }

    const handleSaveExamConfig = async (config) => {
      try {
        await apiService.enableExamForStudent(config)
        await loadData()
        setShowConfigModal(false)
        setCurrentConfig(null)
        showNotification('Examen habilitado correctamente', 'success')
      } catch (error) {
        console.error('Error saving exam config:', error)
        showNotification(`Error: ${error.message}`, 'error')
      }
    }

    const isExamEnabled = (studentId, courseId) => {
      return examConfigs.some(config => 
        config.studentId === studentId && 
        config.courseId === courseId && 
        config.isActive
      )
    }

    const getExamConfig = (studentId, courseId) => {
      return examConfigs.find(config => 
        config.studentId === studentId && 
        config.courseId === courseId
      )
    }

    const filteredStudents = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesArea = selectedArea === 'all' || student.area === selectedArea
      return matchesSearch && matchesArea
    })

    const getAreaColor = (area) => {
      switch(area) {
        case 'metalurgia': return 'bg-blue-500'
        case 'mineria': return 'bg-green-500'
        case 'geologia': return 'bg-orange-500'
        default: return 'bg-gray-500'
      }
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-lg">Cargando datos...</div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-surface rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-white">
              Gestión de Exámenes por Estudiante
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
              />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:outline-none"
              >
                <option value="all">Todas las áreas</option>
                <option value="metalurgia">Metalurgia</option>
                <option value="mineria">Minería</option>
                <option value="geologia">Geología</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Exámenes Habilitados</p>
                  <p className="text-xl font-bold text-white">{examConfigs.filter(c => c.isActive).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-orange-500 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Exámenes Pendientes</p>
                  <p className="text-xl font-bold text-white">{examConfigs.filter(c => c.isActive && !c.completedAt).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Exámenes Completados</p>
                  <p className="text-xl font-bold text-white">{examConfigs.filter(c => c.completedAt).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="grid gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div key={student.id} className="bg-surface rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  
                  {/* Student Info */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">{student.name}</h4>
                        <p className="text-text-secondary">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Área:</span>
                        <span className={`${getAreaColor(student.area)} text-white text-xs px-2 py-1 rounded-full`}>
                          {student.area?.charAt(0).toUpperCase() + student.area?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Courses with Exams */}
                  <div className="lg:w-2/3">
                    <h5 className="text-white font-medium mb-3">Exámenes por Curso</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {courses
                        .filter(course => course.area === student.area)
                        .map(course => {
                          const isEnabled = isExamEnabled(student.id, course.id)
                          const config = getExamConfig(student.id, course.id)
                          
                          return (
                            <div
                              key={course.id}
                              className={`border-2 rounded-lg p-4 transition-all ${
                                isEnabled
                                  ? 'border-purple-500 bg-purple-500/10'
                                  : 'border-gray-600'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-white font-medium text-sm">{course.title}</p>
                                  <p className="text-text-secondary text-xs">
                                    {course.price === 0 ? 'Gratis' : `S/ ${course.price}`}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleToggleExam(student.id, course.id, isEnabled)}
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    isEnabled
                                      ? 'bg-red-500 hover:bg-red-600 text-white'
                                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                                  }`}
                                >
                                  {isEnabled ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                              </div>
                              
                              {isEnabled && config && (
                                <div className="mt-2 pt-2 border-t border-gray-600">
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-text-secondary">Estado:</span>
                                      <span className={config.completedAt ? 'text-green-400' : 'text-yellow-400'}>
                                        {config.completedAt ? 'Completado' : 'Pendiente'}
                                      </span>
                                    </div>
                                    {config.completedAt && config.couponCode && (
                                      <div className="flex justify-between">
                                        <span className="text-text-secondary">Cupón:</span>
                                        <span className="text-accent font-mono">{config.couponCode}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-text-secondary">Expira:</span>
                                      <span className="text-white">
                                        {new Date(config.expiresAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron estudiantes</h3>
              <p className="text-text-secondary">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>

        {/* Exam Config Modal */}
        {showConfigModal && currentConfig && (
          <ExamConfigModal
            config={currentConfig}
            onSave={handleSaveExamConfig}
            onClose={() => {
              setShowConfigModal(false)
              setCurrentConfig(null)
            }}
          />
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            <p className="text-white font-medium">{notification.message}</p>
          </div>
        )}
      </div>
    )
  }

  // Exam Config Modal Component
  const ExamConfigModal = ({ config, onSave, onClose }) => {
    const [formData, setFormData] = useState(config)

    const handleRangeChange = (index, field, value) => {
      const newRanges = [...formData.discountRanges]
      newRanges[index] = { ...newRanges[index], [field]: parseInt(value) }
      setFormData({ ...formData, discountRanges: newRanges })
    }

    const handleSave = () => {
      onSave(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              Configurar Examen
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Student and Course Info */}
            <div className="bg-background rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Información</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Estudiante:</span>
                  <span className="text-white">{config.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Curso:</span>
                  <span className="text-white">{config.courseTitle}</span>
                </div>
              </div>
            </div>

            {/* Discount Ranges */}
            <div>
              <h4 className="text-white font-medium mb-4">Rangos de Descuento</h4>
              <div className="space-y-3">
                {formData.discountRanges.map((range, index) => (
                  <div key={index} className="bg-background rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-text-secondary text-sm mb-1">Puntaje Mínimo</label>
                        <input
                          type="number"
                          value={range.min}
                          onChange={(e) => handleRangeChange(index, 'min', e.target.value)}
                          className="w-full bg-surface border border-gray-600 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
                          min="0"
                          max="20"
                        />
                      </div>
                      <div>
                        <label className="block text-text-secondary text-sm mb-1">Puntaje Máximo</label>
                        <input
                          type="number"
                          value={range.max}
                          onChange={(e) => handleRangeChange(index, 'max', e.target.value)}
                          className="w-full bg-surface border border-gray-600 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
                          min="0"
                          max="20"
                        />
                      </div>
                      <div>
                        <label className="block text-text-secondary text-sm mb-1">Descuento (%)</label>
                        <input
                          type="number"
                          value={range.discount}
                          onChange={(e) => handleRangeChange(index, 'discount', e.target.value)}
                          className="w-full bg-surface border border-gray-600 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">Días de Expiración</label>
                <input
                  type="number"
                  value={formData.expirationDays}
                  onChange={(e) => setFormData({ ...formData, expirationDays: parseInt(e.target.value) })}
                  className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Intentos Máximos</label>
                <input
                  type="number"
                  value={formData.maxAttempts}
                  onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                  className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-accent text-background py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Habilitar Examen
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Coupon Management Component
  const CouponManagement = () => {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, active, used, expired
    const [couponValidation, setCouponValidation] = useState({
      code: '',
      courseId: '',
      isValidating: false,
      result: null
    })

    const loadCoupons = useCallback(async () => {
      try {
        setLoading(true)
        const { status } = filter === 'all' ? {} : { status: filter }
        const couponsData = await apiService.getCoupons({ status })
        setCoupons(couponsData)
      } catch (error) {
        console.error('Error loading coupons:', error)
        setCoupons([])
      } finally {
        setLoading(false)
      }
    }, [filter])

    const handleValidateCoupon = async () => {
      if (!couponValidation.code || !couponValidation.courseId) {
        alert('Por favor ingresa el código del cupón y selecciona un curso')
        return
      }

      setCouponValidation(prev => ({ ...prev, isValidating: true, result: null }))

      try {
        const result = await apiService.validateCoupon(couponValidation.code, couponValidation.courseId)
        setCouponValidation(prev => ({ ...prev, result, isValidating: false }))
      } catch (error) {
        console.error('Error validating coupon:', error)
        setCouponValidation(prev => ({ 
          ...prev, 
          result: { valid: false, message: 'Error al validar el cupón' },
          isValidating: false 
        }))
      }
    }

    const handleUseCoupon = async (couponCode) => {
      if (!window.confirm(`¿Marcar cupón ${couponCode} como usado?`)) return

      try {
        await apiService.useCoupon(couponCode)
        loadCoupons() // Recargar lista
        alert('Cupón marcado como usado exitosamente')
      } catch (error) {
        console.error('Error using coupon:', error)
        alert('Error al usar el cupón')
      }
    }

    useEffect(() => {
      loadCoupons()
    }, [filter, loadCoupons])

    const filterStats = useMemo(() => {
      const stats = {
        total: coupons.length,
        active: coupons.filter(c => !c.isUsed && new Date() <= new Date(c.expirationDate)).length,
        used: coupons.filter(c => c.isUsed).length,
        expired: coupons.filter(c => !c.isUsed && new Date() > new Date(c.expirationDate)).length
      }
      return stats
    }, [coupons])

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusColor = (coupon) => {
      if (coupon.isUsed) return 'text-gray-400'
      if (new Date() > new Date(coupon.expirationDate)) return 'text-red-400'
      return 'text-green-400'
    }

    const getStatusText = (coupon) => {
      if (coupon.isUsed) return 'Usado'
      if (new Date() > new Date(coupon.expirationDate)) return 'Expirado'
      return 'Activo'
    }

    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            title="Total" 
            value={filterStats.total} 
            icon="🎫" 
            color="bg-blue-500"
          />
          <StatCard 
            title="Activos" 
            value={filterStats.active} 
            icon="✅" 
            color="bg-green-500"
          />
          <StatCard 
            title="Usados" 
            value={filterStats.used} 
            icon="🎯" 
            color="bg-gray-500"
          />
          <StatCard 
            title="Expirados" 
            value={filterStats.expired} 
            icon="⏰" 
            color="bg-red-500"
          />
        </div>

        {/* Coupon Validation Tool */}
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Validar Cupón</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Código del cupón (ej: DESC-ABC123)"
              value={couponValidation.code}
              onChange={(e) => setCouponValidation(prev => ({ 
                ...prev, 
                code: e.target.value.toUpperCase(),
                result: null 
              }))}
              className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
            <select
              value={couponValidation.courseId}
              onChange={(e) => setCouponValidation(prev => ({ 
                ...prev, 
                courseId: e.target.value,
                result: null 
              }))}
              className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Seleccionar curso</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <button
              onClick={handleValidateCoupon}
              disabled={couponValidation.isValidating}
              className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              {couponValidation.isValidating ? 'Validando...' : 'Validar'}
            </button>
          </div>
          
          {/* Validation Result */}
          {couponValidation.result && (
            <div className={`mt-4 p-4 rounded-lg ${
              couponValidation.result.valid 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-medium ${
                couponValidation.result.valid ? 'text-green-400' : 'text-red-400'
              }`}>
                {couponValidation.result.valid ? '✅ Cupón válido' : '❌ Cupón inválido'}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {couponValidation.result.message || 
                 (couponValidation.result.valid 
                   ? `Descuento: ${couponValidation.result.coupon?.discountPercentage}%` 
                   : 'Verifica el código e intenta nuevamente')}
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-surface rounded-xl p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Lista de Cupones</h3>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'active', label: 'Activos' },
                { key: 'used', label: 'Usados' },
                { key: 'expired', label: 'Expirados' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-accent text-background'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Expira
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      No hay cupones para mostrar
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-accent font-medium">{coupon.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{coupon.studentName}</p>
                          <p className="text-gray-400 text-sm">{coupon.studentEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{coupon.courseTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-sm font-medium">
                          {coupon.discountPercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${getStatusColor(coupon)}`}>
                          {getStatusText(coupon)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {formatDate(coupon.expirationDate)}
                      </td>
                      <td className="px-6 py-4">
                        {!coupon.isUsed && new Date() <= new Date(coupon.expirationDate) && (
                          <button
                            onClick={() => handleUseCoupon(coupon.code)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Marcar como usado
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // WhatsApp Management Component

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administrador</h1>
            <p className="text-text-secondary">
              {activeTab === 'dashboard' && 'Resumen de actividad de la plataforma'}
              {activeTab === 'courses' && 'Gestión y administración de cursos'}
              {activeTab === 'enrollments' && 'Control de contadores de inscripciones por curso'}
              {activeTab === 'students' && 'Gestión y registro de estudiantes'}
              {activeTab === 'reviews' && 'Gestión y control de reseñas publicadas'}
              {activeTab === 'loyalty' && 'Gestión del programa de fidelización y puntos'}
              {activeTab === 'student-enrollments' && 'Inscripción manual de estudiantes por curso'}
              {activeTab === 'coupons' && 'Gestión de códigos y cupones de descuento'}
              {activeTab === 'areas' && 'Configuración de áreas de estudio'}
              {activeTab === 'reports' && 'Reportes detallados de estudiantes y encuestas'}
              {activeTab === 'whatsapp' && 'Configuración de WhatsApp para lead generation'}
              {activeTab === 'notifications' && 'Centro de notificaciones interactivas'}
              {activeTab === 'events' && 'Gestión de eventos y promociones'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-surface border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
            </select>
            
            <button
              onClick={loadDashboardData}
              className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1 mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'courses' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'enrollments' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Contadores
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'students' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Estudiantes
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reviews' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Reseñas
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'loyalty' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Fidelización
          </button>
          <button
            onClick={() => setActiveTab('student-enrollments')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'student-enrollments' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Inscripciones
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'coupons' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Cupones
          </button>
          <button
            onClick={() => setActiveTab('areas')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'areas' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Áreas
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reports' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Reportes
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'whatsapp' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            WhatsApp
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Notificaciones
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'events' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'exams' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Exámenes
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'photos' 
                ? 'bg-accent text-background' 
                : 'text-text-secondary hover:text-white'
            }`}
          >
            📸 Fotos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardStats />}

        {activeTab === 'courses' && <CourseManagement />}

        {activeTab === 'enrollments' && <CourseEnrollmentManagement loadDashboardData={loadDashboardData} />}

        {activeTab === 'students' && <StudentManagement />}
        
        {activeTab === 'reviews' && <ReviewModeration />}
        
        {activeTab === 'loyalty' && <LoyaltyManagement />}

        {activeTab === 'student-enrollments' && <StudentEnrollmentManagement setActiveTab={setActiveTab} />}


        {activeTab === 'coupons' && <CouponManagement />}

        {activeTab === 'areas' && <AreaManagement />}

        {activeTab === 'reports' && <ReportsManagement />}

        {activeTab === 'whatsapp' && <WhatsAppManagement />}
        
        {activeTab === 'notifications' && <NotificationManagement />}
        
        {activeTab === 'events' && <AdminEvents />}
        
        {activeTab === 'exams' && <AdminExamsV2 />}
        
        {activeTab === 'photos' && <AdminPhotos />}
      </div>

      {/* Modal de vista previa */}
      {showPreviewModal && previewCourse && (
        <CoursePreviewModal
          course={previewCourse}
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false)
            setPreviewCourse(null)
          }}
        />
      )}
    </div>
  )
}

export default AdminDashboard