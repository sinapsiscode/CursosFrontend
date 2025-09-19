import { ENROLLMENT_STYLES, ENROLLMENT_TEXTS } from '../../../constants/enrollmentConstants'
import { formatPrice } from '../../../utils/enrollmentUtils'

const PriceBreakdown = ({ priceDetails, levelConfig }) => {
  return (
    <div className={ENROLLMENT_STYLES.priceSection}>
      <div className={ENROLLMENT_STYLES.priceRow}>
        <span>{ENROLLMENT_TEXTS.originalPrice}</span>
        <span>{formatPrice(priceDetails.originalPrice)}</span>
      </div>

      {priceDetails.discountPercentage > 0 && (
        <>
          <div className={ENROLLMENT_STYLES.discountRow}>
            <span>{ENROLLMENT_TEXTS.levelDiscount} {levelConfig.name}</span>
            <span>-{priceDetails.discountPercentage}%</span>
          </div>
          <div className={ENROLLMENT_STYLES.totalRow}>
            <span className={ENROLLMENT_STYLES.totalLabel}>
              {ENROLLMENT_TEXTS.totalToPay}
            </span>
            <span className={ENROLLMENT_STYLES.totalAmount}>
              {formatPrice(priceDetails.finalPrice)}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default PriceBreakdown