import { Modal } from '../../common'
import { COURSE_DETAIL_CONFIG } from '../../../constants/courseDetailConstants'

const ThankYouModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="medium"
    >
      <div className="text-center py-8 px-6">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          {COURSE_DETAIL_CONFIG.messages.thankYou}
        </h3>

        <p className="text-text-secondary text-lg mb-6 leading-relaxed">
          {COURSE_DETAIL_CONFIG.messages.reviewHelps}
        </p>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-blue-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">
              {COURSE_DETAIL_CONFIG.messages.reviewModeration}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          {COURSE_DETAIL_CONFIG.messages.continue}
        </button>
      </div>
    </Modal>
  )
}

export default ThankYouModal