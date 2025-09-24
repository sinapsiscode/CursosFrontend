import { Modal } from '../../common'
import { COURSE_DETAIL_CONFIG } from '../../../constants/courseDetailConstants'

const SubscriptionModal = ({ isOpen, onClose, navigate }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={COURSE_DETAIL_CONFIG.messages.premiumRequired}
      size="medium"
    >
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-text-secondary">
          {COURSE_DETAIL_CONFIG.messages.premiumContent}
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {COURSE_DETAIL_CONFIG.messages.close}
          </button>
          <button
            onClick={() => navigate('/subscription')}
            className="px-6 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            {COURSE_DETAIL_CONFIG.messages.viewPlans}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal