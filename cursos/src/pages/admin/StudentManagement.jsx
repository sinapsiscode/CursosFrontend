import { useState, useEffect } from 'react'
import { useAdminStore } from '../../store'
import { LoadingSpinner } from '../../components/ui'
import { studentApi, courseApi } from '../../services/api'
import Swal from 'sweetalert2'

const StudentManagement = () => {
  const { courses, setCourses } = useAdminStore()
  
  const [allStudents, setAllStudents] = useState([])
  const [courseStudents, setCourseStudents] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, suspended
  const [viewMode, setViewMode] = useState('all') // all, course
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCoursesAndStudents()
  }, [])

  const loadCoursesAndStudents = async () => {
    try {
      // First load courses if not already loaded
      if (courses.length === 0) {
        console.log('🔄 StudentManagement - Loading courses...')
        const coursesData = await courseApi.getCourses()
        setCourses(coursesData)
        console.log('✅ StudentManagement - Courses loaded:', coursesData.length)
      }
      
      // Then load students
      await loadAllStudents()
    } catch (error) {
      console.error('❌ StudentManagement - Error loading data:', error)
    }
  }

  useEffect(() => {
    if (selectedCourseId && viewMode === 'course') {
      loadCourseStudents(selectedCourseId)
    }
  }, [selectedCourseId, viewMode])

  const loadCourseStudents = async (courseId) => {
    try {
      setLoading(true)
      const students = await studentApi.getCourseStudents(courseId)
      console.log('🔍 StudentManagement - Course students loaded:', students.length)
      setCourseStudents(students)
    } catch (error) {
      console.error('Error loading course students:', error)
      setCourseStudents([])
    } finally {
      setLoading(false)
    }
  }

  const loadAllStudents = async () => {
    try {
      setLoading(true)
      console.log('🔄 StudentManagement - Loading students...')
      const students = await studentApi.getStudents()
      console.log('👥 StudentManagement - Students loaded:', students.length)
      setAllStudents(students)
    } catch (error) {
      console.error('❌ StudentManagement - Error loading students:', error)
      setAllStudents([])
    } finally {
      setLoading(false)
    }
  }

  const getFilteredStudents = () => {
    let students = viewMode === 'all' ? allStudents : courseStudents
    
    // Filtro por búsqueda
    if (searchTerm) {
      students = students.filter(student =>
        student.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.dni?.includes(searchTerm)
      )
    }
    
    // Filtro por estado
    if (filterStatus === 'active') {
      students = students.filter(student => !student.suspended)
    } else if (filterStatus === 'suspended') {
      students = students.filter(student => student.suspended)
    }
    
    return students
  }

  const filteredStudents = getFilteredStudents()

  const handleToggleSuspension = async (student) => {
    const action = student.suspended ? 'reactivar' : 'suspender'
    const icon = student.suspended ? 'question' : 'warning'
    
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} estudiante?`,
      html: `
        <div class="text-left">
          <p><strong>Estudiante:</strong> ${student.name || student.userName}</p>
          <p><strong>Email:</strong> ${student.email || student.userEmail}</p>
          <br>
          <p class="text-sm text-gray-600">
            ${student.suspended 
              ? 'El estudiante podrá acceder nuevamente a la plataforma.'
              : 'El estudiante no podrá acceder a la plataforma hasta ser reactivado.'
            }
          </p>
        </div>
      `,
      icon,
      showCancelButton: true,
      confirmButtonColor: student.suspended ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      }
    })

    if (result.isConfirmed) {
      try {
        await studentApi.toggleStudentSuspension(student.id)
        
        // Recargar datos
        if (viewMode === 'course' && selectedCourseId) {
          await loadCourseStudents(selectedCourseId)
        } else {
          await loadAllStudents()
        }
        
        Swal.fire({
          title: '¡Actualizado!',
          text: `El estudiante ha sido ${student.suspended ? 'reactivado' : 'suspendido'}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      } catch (error) {
        console.error('Error toggling suspension:', error)
        Swal.fire({
          title: 'Error',
          text: `Error al ${action} estudiante`,
          icon: 'error',
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      }
    }
  }

  const handleRemoveFromCourse = async (student, courseId) => {
    const course = courses.find(c => c.id === parseInt(courseId))
    
    const result = await Swal.fire({
      title: '¿Remover del curso?',
      html: `
        <div class="text-left">
          <p><strong>Estudiante:</strong> ${student.userName || student.name}</p>
          <p><strong>Curso:</strong> ${course?.title || 'Curso seleccionado'}</p>
          <br>
          <p class="text-sm text-gray-600">
            Esta acción no se puede deshacer. El estudiante perderá acceso al curso.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      }
    })

    if (result.isConfirmed) {
      try {
        await studentApi.removeStudentFromCourse(courseId, student.userId || student.id)
        
        // Recargar estudiantes del curso
        await loadCourseStudents(courseId)
        
        Swal.fire({
          title: '¡Removido!',
          text: 'El estudiante ha sido removido del curso',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      } catch (error) {
        console.error('Error removing student from course:', error)
        Swal.fire({
          title: 'Error',
          text: 'Error al remover estudiante del curso',
          icon: 'error',
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      }
    }
  }

  const getStatusColor = (student) => {
    if (student.suspended) {
      return 'text-red-400 bg-red-900/20 border-red-500/30'
    }
    return 'text-green-400 bg-green-900/20 border-green-500/30'
  }

  const getStatusLabel = (student) => {
    if (student.suspended) {
      return '🚫 Suspendido'
    }
    return '✅ Activo'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Estudiantes</h1>
        <p className="text-text-secondary">
          Administra todos los estudiantes, sus cursos y estado de cuenta
        </p>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-surface rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-accent text-background'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Todos los Estudiantes
            </button>
            <button
              onClick={() => setViewMode('course')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'course'
                  ? 'bg-accent text-background'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Por Curso
            </button>
          </div>

          {viewMode === 'course' && (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
            >
              <option value="">Selecciona un curso...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.area})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-surface rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, email o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-accent focus:outline-none w-full sm:w-80"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="suspended">Suspendidos</option>
            </select>
          </div>
          
          <div className="text-white font-medium">
            {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Students List */}
      {(viewMode === 'all' || selectedCourseId) && (
        <div className="bg-surface rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes'}
              </h3>
              <p className="text-text-secondary">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : viewMode === 'course' 
                    ? 'Este curso no tiene estudiantes inscritos aún'
                    : 'No hay estudiantes registrados en el sistema'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <div
                  key={student.id || `${student.userId}-${student.courseId}-${index}`}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-white">
                          {student.name || student.userName || student.userId || student.id}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student)}`}>
                          {getStatusLabel(student)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          {(student.email || student.userEmail) && (
                            <span>
                              📧 {student.email || student.userEmail}
                            </span>
                          )}
                          {student.dni && (
                            <span>
                              🆔 DNI: {student.dni}
                            </span>
                          )}
                          {student.phone && (
                            <span>
                              📱 {student.phone}
                            </span>
                          )}
                          {student.university && (
                            <span>
                              🎓 {student.university}
                            </span>
                          )}
                        </div>
                        
                        {viewMode === 'course' && (
                          <div className="flex items-center space-x-4 text-sm text-text-secondary">
                            <span>
                              📅 Inscrito: {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString('es-ES') : 'N/A'}
                            </span>
                            {student.progress && (
                              <span>
                                📊 Progreso: {student.progress}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {viewMode === 'all' ? (
                          <>
                            <button
                              onClick={() => handleToggleSuspension(student)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                student.suspended 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                              title={student.suspended ? 'Reactivar' : 'Suspender'}
                            >
                              {student.suspended ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRemoveFromCourse(student, selectedCourseId)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                              title="Remover del curso"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Remover</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StudentManagement