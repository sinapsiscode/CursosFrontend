import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS } from '../../../constants/loyaltyConstants.jsx'

const BenefitsSection = ({ loyaltyData }) => {
  return (
    <div className={LOYALTY_WIDGET_STYLES.benefitsContainer}>
      <p className="text-sm font-medium text-gray-400 mb-2">{LOYALTY_TEXTS.yourBenefits}</p>
      <div className={LOYALTY_WIDGET_STYLES.benefitsCard}>
        <span className="text-green-400 font-medium">{LOYALTY_TEXTS.activeDiscount}</span>
        <span className="text-xl font-bold text-green-400">
          {loyaltyData.levelConfig.discountPercentage}%
        </span>
      </div>
    </div>
  )
}

export default BenefitsSection