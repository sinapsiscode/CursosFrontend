import { LOYALTY_WIDGET_STYLES, LOYALTY_TEXTS } from '../../../constants/loyaltyConstants.jsx'
import PanelHeader from './PanelHeader'
import LevelCard from './LevelCard'
import BenefitsSection from './BenefitsSection'
import ActionsSection from './ActionsSection'
import PointsSection from './PointsSection'

const ExpandedPanel = ({ loyaltyData, onClose, onNavigateToLoyalty }) => {
  return (
    <div className={LOYALTY_WIDGET_STYLES.expandedPanel}>
      <PanelHeader onClose={onClose} />
      <LevelCard loyaltyData={loyaltyData} />
      <BenefitsSection loyaltyData={loyaltyData} />
      <ActionsSection onNavigateToLoyalty={onNavigateToLoyalty} />
      <PointsSection />
    </div>
  )
}

export default ExpandedPanel