import { useCourseEnrollment } from '../../hooks/useCourseEnrollment'
import EnrollButton from './CourseEnrollButton/EnrollButton'
import PriceDetailsModal from './CourseEnrollButton/PriceDetailsModal'

const CourseEnrollButton = ({ course, onEnroll }) => {
  const {
    enrolling,
    showPriceDetails,
    priceDetails,
    levelConfig,
    handleEnrollClick,
    setShowPriceDetails
  } = useCourseEnrollment(course, onEnroll)

  return (
    <>
      <EnrollButton
        enrolling={enrolling}
        onClick={handleEnrollClick}
      />

      {showPriceDetails && (
        <PriceDetailsModal
          course={course}
          priceDetails={priceDetails}
          levelConfig={levelConfig}
          enrolling={enrolling}
          onClose={() => setShowPriceDetails(false)}
          onConfirm={() => {}} // Este handler se implementaría según la funcionalidad específica
        />
      )}
    </>
  )
}

export default CourseEnrollButton