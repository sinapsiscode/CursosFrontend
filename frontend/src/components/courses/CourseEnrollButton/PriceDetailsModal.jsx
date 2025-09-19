import { ENROLLMENT_STYLES, ENROLLMENT_TEXTS } from '../../../constants/enrollmentConstants'
import { calculatePointsToEarn, formatPrice, formatCourseDetails } from '../../../utils/enrollmentUtils'
import CourseInfo from './CourseInfo'
import PriceBreakdown from './PriceBreakdown'
import PointsCard from './PointsCard'
import LevelDisplay from './LevelDisplay'
import ModalButtons from './ModalButtons'

const PriceDetailsModal = ({
  course,
  priceDetails,
  levelConfig,
  enrolling,
  onClose,
  onConfirm
}) => {
  const pointsToEarn = calculatePointsToEarn(priceDetails.finalPrice)

  return (
    <div className={ENROLLMENT_STYLES.modalOverlay}>
      <div className={ENROLLMENT_STYLES.modalContent}>
        <h3 className={ENROLLMENT_STYLES.modalTitle}>
          {ENROLLMENT_TEXTS.purchaseDetails}
        </h3>

        <CourseInfo course={course} />

        <PriceBreakdown
          priceDetails={priceDetails}
          levelConfig={levelConfig}
        />

        <PointsCard pointsToEarn={pointsToEarn} />

        {levelConfig && <LevelDisplay levelConfig={levelConfig} />}

        <ModalButtons
          enrolling={enrolling}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  )
}

export default PriceDetailsModal