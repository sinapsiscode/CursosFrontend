import { LOYALTY_WIDGET_STYLES } from '../../constants/loyaltyConstants.jsx'
import { useLoyaltyWidget } from '../../hooks/useLoyaltyWidget'
import MinimizedButton from './LoyaltyWidget/MinimizedButton'
import CompactWidget from './LoyaltyWidget/CompactWidget'
import ExpandedPanel from './LoyaltyWidget/ExpandedPanel'

const LoyaltyWidget = () => {
  const {
    loyaltyData,
    isExpanded,
    isMinimized,
    isVisible,
    handleToggleExpanded,
    handleMinimize,
    handleRestore,
    handleClose,
    handleNavigateToLoyalty
  } = useLoyaltyWidget()

  if (!isVisible) {
    return null
  }

  return (
    <div className={LOYALTY_WIDGET_STYLES.container}>
      {isMinimized ? (
        <MinimizedButton
          loyaltyData={loyaltyData}
          onRestore={handleRestore}
        />
      ) : (
        <CompactWidget
          loyaltyData={loyaltyData}
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
          onMinimize={handleMinimize}
        />
      )}

      {isExpanded && (
        <ExpandedPanel
          loyaltyData={loyaltyData}
          onClose={handleClose}
          onNavigateToLoyalty={handleNavigateToLoyalty}
        />
      )}
    </div>
  )
}

export default LoyaltyWidget