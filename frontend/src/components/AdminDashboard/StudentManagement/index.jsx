import { useStudentManagement } from '../../../hooks/useStudentManagement'
import { STUDENT_STYLES } from '../../../constants/studentManagementConstants.jsx'
import StudentHeader from './StudentHeader'
import ViewModeSelector from './ViewModeSelector'
import StudentFilters from './StudentFilters'
import StudentsList from './StudentsList'
import ViewStudentModal from './ViewStudentModal'
import EditStudentModal from './EditStudentModal'
import SuspendStudentModal from './SuspendStudentModal'

const StudentManagement = () => {
  const {
    // Estado
    selectedCourseId,
    searchTerm,
    filterStatus,
    viewMode,
    loading,
    courses,

    // Estados de modales
    viewModal,
    editModal,
    suspendModal,

    // Datos computados
    filteredStudents,

    // Acciones de estudiante
    handleMarkCompleted,
    handleStudentAction,

    // Acciones de modales
    closeViewModal,
    confirmEditStudent,
    cancelEditStudent,
    confirmSuspendStudent,
    cancelSuspendStudent,

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

      {/* Modal de vista de detalles */}
      {viewModal.show && viewModal.student && (
        <ViewStudentModal
          student={viewModal.student}
          onClose={closeViewModal}
        />
      )}

      {/* Modal de edición */}
      {editModal.show && editModal.student && (
        <EditStudentModal
          student={editModal.student}
          onConfirm={confirmEditStudent}
          onCancel={cancelEditStudent}
        />
      )}

      {/* Modal de suspensión/reactivación */}
      {suspendModal.show && suspendModal.student && (
        <SuspendStudentModal
          student={suspendModal.student}
          onConfirm={confirmSuspendStudent}
          onCancel={cancelSuspendStudent}
        />
      )}
    </div>
  )
}

export default StudentManagement