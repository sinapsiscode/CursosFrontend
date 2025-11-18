import { VIEW_TYPES } from '../../data/adminExams'
import {
  useExamManagement,
  useQuestionManagement,
  useExamFilters,
  useCourseHelper
} from '../../hooks/adminExams'
import {
  ExamList,
  ExamForm,
  QuestionModal
} from '../../components/AdminExams'

const AdminExamsV2 = () => {
  // Hooks de gestión
  const examManagement = useExamManagement()
  const courseHelper = useCourseHelper()
  const examFilters = useExamFilters(examManagement.exams)
  const questionManagement = useQuestionManagement(
    examManagement.examForm,
    examManagement.setExamForm
  )

  // Loading state
  if (examManagement.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Cargando exámenes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Gestión de Exámenes</h1>

        {/* Vista de lista */}
        {examManagement.activeView === VIEW_TYPES.LIST && (
          <ExamList
            filteredExams={examFilters.filteredExams}
            filterType={examFilters.filterType}
            setFilterType={examFilters.setFilterType}
            filterCourse={examFilters.filterCourse}
            setFilterCourse={examFilters.setFilterCourse}
            courses={courseHelper.courses}
            handleCreateExam={examManagement.handleCreateExam}
            handleEditExam={examManagement.handleEditExam}
            handleDeleteExam={examManagement.handleDeleteExam}
            handleDuplicateExam={examManagement.handleDuplicateExam}
            handleToggleExamStatus={examManagement.handleToggleExamStatus}
            getCourseName={courseHelper.getCourseName}
          />
        )}

        {/* Vista de creación/edición */}
        {(examManagement.activeView === VIEW_TYPES.CREATE ||
          examManagement.activeView === VIEW_TYPES.EDIT) && (
          <ExamForm
            examForm={examManagement.examForm}
            handleExamFormChange={examManagement.handleExamFormChange}
            courses={courseHelper.courses}
            activeView={examManagement.activeView}
            setActiveView={examManagement.setActiveView}
            handleSaveExam={examManagement.handleSaveExam}
            handleAddQuestion={questionManagement.handleAddQuestion}
            handleEditQuestion={questionManagement.handleEditQuestion}
            handleDeleteQuestion={questionManagement.handleDeleteQuestion}
          />
        )}

        {/* Modal de preguntas */}
        <QuestionModal
          showQuestionModal={questionManagement.showQuestionModal}
          setShowQuestionModal={questionManagement.setShowQuestionModal}
          questionForm={questionManagement.questionForm}
          handleQuestionFormChange={questionManagement.handleQuestionFormChange}
          handleOptionChange={questionManagement.handleOptionChange}
          handleOptionImageChange={questionManagement.handleOptionImageChange}
          handleSaveQuestion={questionManagement.handleSaveQuestion}
          editingQuestionIndex={questionManagement.editingQuestionIndex}
        />
      </div>
    </div>
  )
}

export default AdminExamsV2
