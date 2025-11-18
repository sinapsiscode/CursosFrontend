import { EXAM_TYPE_OPTIONS } from '../../data/adminExams'

/**
 * Componente de filtros para la lista de exámenes
 */
export const ExamFilters = ({
  filterType,
  setFilterType,
  filterCourse,
  setFilterCourse,
  courses,
  handleCreateExam
}) => (
  <div className="flex flex-wrap gap-4 items-center">
    <select
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <option value="all">Todos los tipos</option>
      {EXAM_TYPE_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>

    <select
      value={filterCourse}
      onChange={(e) => setFilterCourse(e.target.value)}
      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <option value="all">Todos los cursos</option>
      {courses.map(course => (
        <option key={course.id} value={course.id}>{course.title}</option>
      ))}
    </select>

    <button
      onClick={handleCreateExam}
      className="ml-auto bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
    >
      + Crear Examen
    </button>
  </div>
)
