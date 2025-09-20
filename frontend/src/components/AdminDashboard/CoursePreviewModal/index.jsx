import React from 'react'
import { useCoursePreviewModal } from '../../../hooks/useCoursePreviewModal'
import { COURSE_PREVIEW_STYLES, COURSE_PREVIEW_MODAL } from '../../../constants/coursePreviewConstants'
import CoursePreviewModal from '../../Admin/CoursePreviewModal'

const CoursePreviewWrapper = ({ course, isOpen, onClose }) => {
  const modal = useCoursePreviewModal()

  // Sincronizar props externas con el hook interno
  React.useEffect(() => {
    if (isOpen && course && !modal.isOpen) {
      modal.open(course)
    } else if (!isOpen && modal.isOpen) {
      modal.close()
    }
  }, [isOpen, course, modal])

  // Sincronizar cierre hacia arriba
  React.useEffect(() => {
    if (!modal.isOpen && isOpen) {
      onClose?.()
    }
  }, [modal.isOpen, isOpen, onClose])

  if (!modal.isOpen || !modal.course) {
    return null
  }

  return (
    <div
      className={COURSE_PREVIEW_STYLES.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          modal.close()
        }
      }}
      role={COURSE_PREVIEW_MODAL.ACCESSIBILITY.role}
      aria-label={COURSE_PREVIEW_MODAL.ACCESSIBILITY.ariaLabel}
    >
      <div className={COURSE_PREVIEW_STYLES.modal}>
        <CoursePreviewModal
          course={modal.course}
          isOpen={modal.isOpen}
          onClose={modal.close}
        />
      </div>
    </div>
  )
}

export default CoursePreviewWrapper