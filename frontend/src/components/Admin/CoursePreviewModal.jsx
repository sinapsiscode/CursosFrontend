import { Modal } from '../common'
import { useCoursePreview } from '../../hooks/useCoursePreview'
import PreviewHeader from './CoursePreview/PreviewHeader'
import PreviewTabs from './CoursePreview/PreviewTabs'
import GeneralTab from './CoursePreview/GeneralTab'
import LessonsTab from './CoursePreview/LessonsTab'
import MaterialsTab from './CoursePreview/MaterialsTab'
import StatsTab from './CoursePreview/StatsTab'
import PreviewFooter from './CoursePreview/PreviewFooter'

const CoursePreviewModal = ({ course, isOpen, onClose }) => {
  const { activeTab, setActiveTab } = useCoursePreview()

  if (!isOpen || !course) return null

  try {

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xlarge">
      <div className="p-6">
        <PreviewHeader course={course} onClose={onClose} />
        <PreviewTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="max-h-96 overflow-y-auto">
          {activeTab === 'general' && <GeneralTab course={course} />}
          {activeTab === 'lessons' && <LessonsTab course={course} />}
          {activeTab === 'materials' && <MaterialsTab course={course} />}
          {activeTab === 'stats' && <StatsTab course={course} />}
        </div>

        <PreviewFooter course={course} onClose={onClose} />
      </div>
    </Modal>
  )
  } catch (error) {
    console.error('Error in CoursePreviewModal:', error)
    return null
  }
}

export default CoursePreviewModal