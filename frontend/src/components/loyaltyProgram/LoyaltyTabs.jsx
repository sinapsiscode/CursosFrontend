import { LOYALTY_TABS, LOYALTY_STYLES } from '../../constants/loyaltyProgramConstants.jsx'

const LoyaltyTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className={LOYALTY_STYLES.tabs.container}>
      {LOYALTY_TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${LOYALTY_STYLES.tabs.tab} ${
            activeTab === tab.id
              ? LOYALTY_STYLES.tabs.tabActive
              : LOYALTY_STYLES.tabs.tabInactive
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default LoyaltyTabs