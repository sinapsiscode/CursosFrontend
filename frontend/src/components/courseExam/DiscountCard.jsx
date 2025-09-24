import { EXAM_STYLES, EXAM_MESSAGES } from '../../constants/courseExamConstants.jsx'

const DiscountCard = ({
  discount,
  course,
  couponCode,
  onCopyCoupon
}) => {
  return (
    <div className={EXAM_STYLES.results.discountCard}>
      <p className="text-lg text-white mb-2">{EXAM_MESSAGES.wonDiscount}</p>
      <p className={EXAM_STYLES.results.discountText}>
        {discount}% OFF
      </p>
      <p className="text-gray-300 mt-2">
        {EXAM_MESSAGES.inCourse} {course?.title}
      </p>

      {couponCode && (
        <div className={EXAM_STYLES.results.couponContainer}>
          <p className="text-sm text-gray-400 mb-2">
            {EXAM_MESSAGES.yourDiscountCode}
          </p>
          <div className={EXAM_STYLES.results.couponCode}>
            <span className="font-mono text-lg text-white">{couponCode}</span>
            <button
              onClick={onCopyCoupon}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {EXAM_MESSAGES.copyCode}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {EXAM_MESSAGES.presentCodeMessage}
          </p>
        </div>
      )}
    </div>
  )
}

export default DiscountCard