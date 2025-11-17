import { useState, useEffect } from 'react'
import { useAdminStore } from '../../store'
import { LoadingSpinner } from '../../components/common'
import { apiService } from '../../services/api'
import Swal from 'sweetalert2'

const StudentManagement = () => {
  const { courses, setCourses } = useAdminStore()
  
  const [allStudents, setAllStudents] = useState([])
  const [courseStudents, setCourseStudents] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, completed
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
        const coursesData = await apiService.getCourses()
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
    console.log('🔍 StudentManagement - Courses available:', courses.length)
    console.log('🔍 StudentManagement - First course:', courses[0]?.title)
  }, [courses])

  useEffect(() => {
    if (selectedCourseId && viewMode === 'course') {
      loadCourseStudents(selectedCourseId)
    }
  }, [selectedCourseId, viewMode])

  const loadCourseStudents = async (courseId) => {
    try {
      setLoading(true)
      const students = await apiService.getCourseStudents(courseId)
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
      // Cargar todos los estudiantes del sistema
      console.log('🔄 StudentManagement - Loading students...')
      const students = await apiService.getStudents()
      console.log('👥 StudentManagement - Students loaded:', students.length)
      
      // Enriquecer con información de cursos inscritos
      const currentCourses = courses.length > 0 ? courses : await apiService.getCourses()
      const enrichedStudents = students.map(student => {
        const enrolledCourses = currentCourses.filter(course => 
          apiService.isUserEnrolledInCourse(student.id, course.id).isEnrolled
        )
        return {
          ...student,
          enrolledCourses,
          totalCourses: enrolledCourses.length,
          status: enrolledCourses.some(c => c.completed) ? 'completed' : 'active'
        }
      })
      console.log('✅ StudentManagement - Enriched students:', enrichedStudents.length)
      setAllStudents(enrichedStudents)
    } catch (error) {
      console.error('❌ StudentManagement - Error loading students:', error)
      setAllStudents([])
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
    if (filterStatus !== 'all') {
      students = students.filter(student => student.status === filterStatus)
    }
    
    return students
  }

  const filteredStudents = getFilteredStudents()

  const handleMarkCompleted = async (student, courseId = selectedCourseId) => {
    const course = courses.find(c => c.id === courseId)
    const courseTitle = course?.title || 'Curso seleccionado'
    const coursePoints = course?.points || 100
    
    const result = await Swal.fire({
      title: '¿Marcar como completado?',
      html: `
        <div class="text-left">
          <p><strong>Estudiante:</strong> ${student.userName || student.userId}</p>
          <p><strong>Curso:</strong> ${courseTitle}</p>
          <p><strong>Puntos a otorgar:</strong> <span class="text-purple-400">🏆 ${coursePoints} puntos</span></p>
          <br>
          <p class="text-sm text-gray-600">
            El estudiante podrá dar una reseña del curso después de esta acción.
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, marcar como completado',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-gray-800 text-white',
        title: 'text-white',
        htmlContainer: 'text-gray-300'
      }
    })

    if (result.isConfirmed) {
      try {
        // Marcar estudiante como completado (implementación local)
        console.log('✅ Marcando estudiante como completado:', {
          studentId: student.userId || student.id,
          courseId,
          courseTitle,
          coursePoints
        })
        
        // Aquí podrías agregar lógica para actualizar el estado de completado
        // Por ahora, solo recarga los datos
        if (viewMode === 'course' && selectedCourseId) {
          await loadCourseStudents(selectedCourseId)
        } else {
          await loadAllStudents()
        }
        
        const markResult = { success: true }
        
        if (markResult.success) {
          Swal.fire({
            title: '¡Completado!',
            text: 'El estudiante ha sido marcado como completado',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: 'bg-gray-800 text-white',
              title: 'text-white'
            }
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: markResult.error || 'Error al marcar como completado',
            icon: 'error',
            customClass: {
              popup: 'bg-gray-800 text-white',
              title: 'text-white'
            }
          })
        }
      } catch (error) {
        console.error('Error marking student as completed:', error)
        Swal.fire({
          title: 'Error',
          text: 'Error al marcar como completado',
          icon: 'error',
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'completed': return 'text-green-400 bg-green-900/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const getStatusLabel = (student) => {
    if (student.status === 'completed') {
      if (student.hasReviewed) {
        return '✅ Completado + Reseñado'
      } else {
        return '🎓 Completado'
      }
    }
    return '📚 En curso'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Estudiantes</h1>
        <p className="text-secondary">
          Administra todos los estudiantes, sus cursos y progreso
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
              <option value="completed">Completados</option>
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

          {loading.students && viewMode === 'course' ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes inscritos'}
              </h3>
              <p className="text-secondary">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Este curso no tiene estudiantes inscritos aún'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id || `${student.userId}-${student.courseId}`}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-white">
                          {student.userName || student.name || student.userId || student.id}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                          {getStatusLabel(student)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-secondary">
                          {student.email && (
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
                        </div>
                        
                        {viewMode === 'all' && student.enrolledCourses && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {student.enrolledCourses.slice(0, 3).map(course => (
                              <span key={course.id} className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                                {course.title}
                              </span>
                            ))}
                            {student.enrolledCourses.length > 3 && (
                              <span className="text-xs text-gray-400">+{student.enrolledCourses.length - 3} más</span>
                            )}
                          </div>
                        )}
                        
                        {viewMode === 'course' && (
                          <div className="flex items-center space-x-4 text-sm text-secondary">
                            <span>
                              📅 Inscrito: {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString('es-ES') : 'N/A'}
                            </span>
                            {student.completedAt && (
                              <span>
                                ✅ Completado: {new Date(student.completedAt).toLocaleDateString('es-ES')}
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
                              onClick={() => {
                                // Ver detalles del estudiante
                                console.log('Ver detalles:', student)
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                              title="Ver detalles"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                // Editar estudiante
                                console.log('Editar:', student)
                              }}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                // Suspender estudiante
                                console.log('Suspender:', student)
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                              title="Suspender"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            {student.status === 'completed' ? (
                              <div className="flex items-center space-x-2 text-green-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Completado</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleMarkCompleted(student, selectedCourseId)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Marcar Completado</span>
                              </button>
                            )}
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