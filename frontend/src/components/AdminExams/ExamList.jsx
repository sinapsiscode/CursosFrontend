import { ExamCard } from './ExamCard'
import { ExamFilters } from './ExamFilters'

/**
 * Componente de lista de exámenes
 */
export const ExamList = ({
  filteredExams,
  filterType,
  setFilterType,
  filterCourse,
  setFilterCourse,
  courses,
  handleCreateExam,
  handleEditExam,
  handleDeleteExam,
  handleDuplicateExam,
  handleToggleExamStatus,
  getCourseName
}) => (
  <div className="space-y-6">
    {/* Filtros */}
    <ExamFilters
      filterType={filterType}
      setFilterType={setFilterType}
      filterCourse={filterCourse}
      setFilterCourse={setFilterCourse}
      courses={courses}
      handleCreateExam={handleCreateExam}
    />

    {/* Lista de exámenes */}
    {filteredExams.length === 0 ? (
      <div className="text-center py-12 bg-background rounded-lg">
        <p className="text-gray-400">No hay exámenes que coincidan con los filtros</p>
        <button
          onClick={handleCreateExam}
          className="mt-4 text-accent hover:text-accent-light"
        >
          Crear el primer examen
        </button>
      </div>
    ) : (
      <div className="grid gap-4">
        {filteredExams.map(exam => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onEdit={() => handleEditExam(exam)}
            onDelete={() => handleDeleteExam(exam.id)}
            onDuplicate={() => handleDuplicateExam(exam)}
            onToggleStatus={() => handleToggleExamStatus(exam.id)}
            getCourseName={getCourseName}
          />
        ))}
      </div>
    )}
  </div>
)
