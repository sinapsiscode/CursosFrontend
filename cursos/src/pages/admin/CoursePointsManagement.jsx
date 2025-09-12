import { useState, useEffect } from 'react'
import { useCourseStore } from '../../store'
import { LoadingSpinner } from '../../components/ui'
import Swal from 'sweetalert2'

const CoursePointsManagement = () => {
  const { courses, updateCourse } = useCourseStore()
  const [editingCourse, setEditingCourse] = useState(null)
  const [pointsValue, setPointsValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterArea, setFilterArea] = useState('all')
  
  const areas = [
    { key: 'all', label: 'Todas las áreas' },
    { key: 'metalurgia', label: 'Metalurgia' },
    { key: 'mineria', label: 'Minería' },
    { key: 'geologia', label: 'Geología' }
  ]

  const handleEditPoints = (course) => {
    setEditingCourse(course.id)
    setPointsValue(course.points || 10)
  }

  const handleSavePoints = async (courseId) => {
    const points = parseInt(pointsValue)
    
    if (isNaN(points) || points < 0) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingresa un valor válido de puntos',
        icon: 'error',
        background: '#1f2937',
        color: '#f3f4f6'
      })
      return
    }

    try {
      const updatedCourse = courses.find(c => c.id === courseId)
      if (updatedCourse) {
        updatedCourse.points = points
        
        const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
        const courseIndex = storedCourses.findIndex(c => c.id === courseId)
        if (courseIndex !== -1) {
          storedCourses[courseIndex].points = points
          localStorage.setItem('courses', JSON.stringify(storedCourses))
        }
        
        if (typeof updateCourse === 'function') {
          updateCourse(courseId, { points })
        }
      }

      setEditingCourse(null)
      
      Swal.fire({
        title: '¡Actualizado!',
        text: `El curso ahora otorga ${points} puntos`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#f3f4f6'
      })
    } catch (error) {
      console.error('Error updating course points:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron actualizar los puntos',
        icon: 'error',
        background: '#1f2937',
        color: '#f3f4f6'
      })
    }
  }

  const handleBulkUpdate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Actualización Masiva de Puntos',
      html: `
        <div class="text-left">
          <div class="mb-4">
            <label class="block text-sm font-bold text-white mb-2">Área</label>
            <select id="bulk-area" class="swal2-input w-full" style="background-color: #374151; color: white; border: 1px solid #4b5563;">
              <option value="all">Todas las áreas</option>
              <option value="metalurgia">Metalurgia</option>
              <option value="mineria">Minería</option>
              <option value="geologia">Geología</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold text-white mb-2">Nivel</label>
            <select id="bulk-level" class="swal2-input w-full" style="background-color: #374151; color: white; border: 1px solid #4b5563;">
              <option value="all">Todos los niveles</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-white mb-2">Puntos a asignar</label>
            <input id="bulk-points" type="number" class="swal2-input w-full" min="0" step="10" placeholder="10" style="background-color: #374151; color: white; border: 1px solid #4b5563;">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f3f4f6',
      preConfirm: () => {
        const area = document.getElementById('bulk-area').value
        const level = document.getElementById('bulk-level').value
        const points = parseInt(document.getElementById('bulk-points').value)
        
        if (!points || points < 0) {
          Swal.showValidationMessage('Por favor ingresa un valor válido de puntos')
          return false
        }
        
        return { area, level, points }
      }
    })

    if (formValues) {
      try {
        let coursesToUpdate = [...courses]
        
        if (formValues.area !== 'all') {
          coursesToUpdate = coursesToUpdate.filter(c => c.area === formValues.area)
        }
        
        if (formValues.level !== 'all') {
          coursesToUpdate = coursesToUpdate.filter(c => c.level === formValues.level)
        }
        
        coursesToUpdate.forEach(course => {
          course.points = formValues.points
        })
        
        localStorage.setItem('courses', JSON.stringify(courses))
        
        Swal.fire({
          title: '¡Actualización Masiva Completada!',
          text: `Se actualizaron ${coursesToUpdate.length} cursos con ${formValues.points} puntos`,
          icon: 'success',
          background: '#1f2937',
          color: '#f3f4f6'
        })
      } catch (error) {
        console.error('Error in bulk update:', error)
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la actualización masiva',
          icon: 'error',
          background: '#1f2937',
          color: '#f3f4f6'
        })
      }
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArea = filterArea === 'all' || course.area === filterArea
    return matchesSearch && matchesArea
  })

  const totalPoints = filteredCourses.reduce((sum, course) => sum + (course.points || 10), 0)
  const averagePoints = filteredCourses.length > 0 ? Math.round(totalPoints / filteredCourses.length) : 0

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Gestión de Puntos por Curso</h2>
        <p className="text-gray-400">
          Asigna y gestiona los puntos (créditos) que los estudiantes ganan al completar cada curso
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {filteredCourses.length}
          </div>
          <div className="text-gray-400 text-sm">Cursos Totales</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {averagePoints}
          </div>
          <div className="text-gray-400 text-sm">Puntos Promedio</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {filteredCourses.filter(c => (c.points || 10) > 10).length}
          </div>
          <div className="text-gray-400 text-sm">Cursos Premium</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Puntos Totales</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:w-64">
              <input
                type="text"
                placeholder="Buscar curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Area Filter */}
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
            >
              {areas.map(area => (
                <option key={area.key} value={area.key}>{area.label}</option>
              ))}
            </select>
          </div>

          {/* Bulk Update Button */}
          <button
            onClick={handleBulkUpdate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Actualización Masiva
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 font-medium text-gray-400">Curso</th>
                <th className="text-center py-4 px-6 font-medium text-gray-400">Área</th>
                <th className="text-center py-4 px-6 font-medium text-gray-400">Nivel</th>
                <th className="text-center py-4 px-6 font-medium text-gray-400">Duración</th>
                <th className="text-center py-4 px-6 font-medium text-gray-400">Puntos Actuales</th>
                <th className="text-center py-4 px-6 font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{course.title}</p>
                        <p className="text-gray-400 text-sm">{course.instructor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.area === 'metalurgia' ? 'bg-blue-900/50 text-blue-400' :
                      course.area === 'mineria' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-green-900/50 text-green-400'
                    }`}>
                      {course.area.charAt(0).toUpperCase() + course.area.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.level === 'basico' ? 'bg-green-900/50 text-green-400' :
                      course.level === 'intermedio' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">
                    {Math.floor(course.duration / 60)}h {course.duration % 60}m
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingCourse === course.id ? (
                      <input
                        type="number"
                        value={pointsValue}
                        onChange={(e) => setPointsValue(e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-center"
                        min="0"
                        step="10"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-purple-400 text-lg">🏆</span>
                        <span className="text-white font-bold text-lg">{course.points || 10}</span>
                        <span className="text-gray-400 text-sm">pts</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      {editingCourse === course.id ? (
                        <>
                          <button
                            onClick={() => handleSavePoints(course.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingCourse(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditPoints(course)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">No se encontraron cursos</h3>
          <p className="text-gray-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  )
}

export default CoursePointsManagement