import { Modal } from '../common'
import ReviewForm from '../courses/ReviewForm'
import SubscriptionModal from './modals/SubscriptionModal'
import ExamInfoModal from './modals/ExamInfoModal'
import ThankYouModal from './modals/ThankYouModal'

const CourseModals = ({
  course,
  courseExam,
  navigate,
  showSubscriptionModal,
  setShowSubscriptionModal,
  showExamInfo,
  setShowExamInfo,
  showReviewForm,
  setShowReviewForm,
  showThankYouModal,
  setShowThankYouModal,
  handleReviewSuccess
}) => {
  return (
    <>
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        navigate={navigate}
      />

      <ExamInfoModal
        isOpen={showExamInfo}
        onClose={() => setShowExamInfo(false)}
        courseExam={courseExam}
        course={course}
        navigate={navigate}
      />

      <Modal
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        title=""
        size="medium"
      >
        <ReviewForm
          course={course}
          onClose={() => setShowReviewForm(false)}
          onSuccess={handleReviewSuccess}
        />
      </Modal>

      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />
    </>
  )
}

export default CourseModals