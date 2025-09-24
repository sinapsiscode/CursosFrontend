import { useCourseManagement } from '../../../hooks/useCourseManagement'
import { COURSE_MANAGEMENT_STYLES } from '../../../constants/courseManagementConstants.jsx'
import CourseCreationForm from '../../Admin/CourseCreationForm'
import CourseHeader from './CourseHeader'
import CourseFormLoading from './CourseFormLoading'
import CourseTable from './CourseTable'

const CourseManagement = () => {
  const {
    // Estado
    modalState,
    courses,
    levels,

    // Funciones de modal/formulario
    handleToggleCreateForm,
    handleCloseForm,

    // CRUD operations
    handleSaveCourse,
    handleEditCourse,
    handleDeleteCourse,
    handlePreviewCourse,

    // Utilidades
    getAreaColor,
    getLevelColor,
    formatPrice,
    formatDuration,
    isFormReady,
    getActiveAreas
  } = useCourseManagement()

  const activeAreas = getActiveAreas()

  return (
    <div className={COURSE_MANAGEMENT_STYLES.container}>
      <CourseHeader
        showCreateForm={modalState.showCreateForm}
        onToggleCreateForm={handleToggleCreateForm}
      />

      {/* Formulario completo de creación/edición */}
      {modalState.showCreateForm && isFormReady() && (
        <CourseCreationForm
          editingCourse={modalState.editingCourse}
          activeAreas={activeAreas}
          levels={levels}
          onClose={handleCloseForm}
          onSave={handleSaveCourse}
        />
      )}

      {/* Loading mientras se cargan áreas y niveles */}
      {modalState.showCreateForm && !isFormReady() && (
        <CourseFormLoading onClose={handleCloseForm} />
      )}

      {/* Tabla de cursos */}
      <CourseTable
        courses={courses}
        getAreaColor={getAreaColor}
        getLevelColor={getLevelColor}
        formatPrice={formatPrice}
        formatDuration={formatDuration}
        onPreview={handlePreviewCourse}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />
    </div>
  )
}

export default CourseManagement