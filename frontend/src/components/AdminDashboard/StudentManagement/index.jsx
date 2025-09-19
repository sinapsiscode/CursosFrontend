import { useStudentManagement } from '../../../hooks/useStudentManagement'
import { STUDENT_STYLES } from '../../../constants/studentManagementConstants'
import StudentHeader from './StudentHeader'
import ViewModeSelector from './ViewModeSelector'
import StudentFilters from './StudentFilters'
import StudentsList from './StudentsList'

const StudentManagement = () => {
  const {
    // Estado
    selectedCourseId,
    searchTerm,
    filterStatus,
    viewMode,
    loading,
    courses,

    // Datos computados
    filteredStudents,

    // Acciones de estudiante
    handleMarkCompleted,
    handleStudentAction,

    // Cambios de estado
    changeViewMode,
    changeCourse,
    changeSearchTerm,
    changeFilterStatus,

    // Utilidades
    getStatusColor,
    getStatusLabel
  } = useStudentManagement()

  return (
    <div className={STUDENT_STYLES.container}>
      <StudentHeader />

      <ViewModeSelector
        viewMode={viewMode}
        selectedCourseId={selectedCourseId}
        courses={courses}
        onViewModeChange={changeViewMode}
        onCourseChange={changeCourse}
      />

      <StudentFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filteredStudents={filteredStudents}
        onSearchChange={changeSearchTerm}
        onStatusChange={changeFilterStatus}
      />

      <StudentsList
        viewMode={viewMode}
        selectedCourseId={selectedCourseId}
        filteredStudents={filteredStudents}
        loading={loading}
        searchTerm={searchTerm}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        onMarkCompleted={handleMarkCompleted}
        onStudentAction={handleStudentAction}
      />
    </div>
  )
}

export default StudentManagement