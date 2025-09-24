import { useLoyaltyProgram } from '../hooks/useLoyaltyProgram'
import { LOYALTY_STYLES, LOYALTY_MESSAGES } from '../constants/loyaltyProgramConstants.jsx'
import LoyaltyHeader from '../components/loyaltyProgram/LoyaltyHeader'
import LoyaltyTabs from '../components/loyaltyProgram/LoyaltyTabs'
import OverviewTab from '../components/loyaltyProgram/OverviewTab'
import RewardsTab from '../components/loyaltyProgram/RewardsTab'
import HistoryTab from '../components/loyaltyProgram/HistoryTab'

const LoyaltyProgram = () => {
  const {
    activeTab,
    userLoyaltyData,
    loading,
    redeemingReward,
    loyaltyService,
    groupedRewards,
    handleRedeemReward,
    handleClaimDailyBonus,
    handleTabChange
  } = useLoyaltyProgram()

  if (loading || !userLoyaltyData) {
    return (
      <div className={LOYALTY_STYLES.loading.container}>
        <div className={LOYALTY_STYLES.loading.content}>
          <div className={LOYALTY_STYLES.loading.spinner}></div>
          <p className={LOYALTY_STYLES.loading.text}>
            {LOYALTY_MESSAGES.loading}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={LOYALTY_STYLES.container}>
      <div className={LOYALTY_STYLES.maxWidth}>

        <LoyaltyHeader
          userLoyaltyData={userLoyaltyData}
          onClaimDailyBonus={handleClaimDailyBonus}
        />

        <LoyaltyTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            userLoyaltyData={userLoyaltyData}
            loyaltyService={loyaltyService}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsTab
            groupedRewards={groupedRewards}
            userLoyaltyData={userLoyaltyData}
            redeemingReward={redeemingReward}
            onRedeemReward={handleRedeemReward}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab transactions={userLoyaltyData.transactions} />
        )}

      </div>
    </div>
  )
}

export default LoyaltyProgram