import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const StatsGrid = ({ stats }) => {
  return (
    <div className={MY_FAVORITES_STYLES.stats.grid}>
      <div className={MY_FAVORITES_STYLES.stats.card}>
        <div className={`${MY_FAVORITES_STYLES.stats.number} ${MY_FAVORITES_STYLES.stats.totalColor}`}>
          {stats.total}
        </div>
        <div className={MY_FAVORITES_STYLES.stats.label}>
          {MY_FAVORITES_MESSAGES.stats.total}
        </div>
      </div>

      <div className={MY_FAVORITES_STYLES.stats.card}>
        <div className={`${MY_FAVORITES_STYLES.stats.number} ${MY_FAVORITES_STYLES.stats.programmingColor}`}>
          {stats.programming}
        </div>
        <div className={MY_FAVORITES_STYLES.stats.label}>
          {MY_FAVORITES_MESSAGES.stats.programming}
        </div>
      </div>

      <div className={MY_FAVORITES_STYLES.stats.card}>
        <div className={`${MY_FAVORITES_STYLES.stats.number} ${MY_FAVORITES_STYLES.stats.designColor}`}>
          {stats.design}
        </div>
        <div className={MY_FAVORITES_STYLES.stats.label}>
          {MY_FAVORITES_MESSAGES.stats.design}
        </div>
      </div>

      <div className={MY_FAVORITES_STYLES.stats.card}>
        <div className={`${MY_FAVORITES_STYLES.stats.number} ${MY_FAVORITES_STYLES.stats.marketingColor}`}>
          {stats.marketing}
        </div>
        <div className={MY_FAVORITES_STYLES.stats.label}>
          {MY_FAVORITES_MESSAGES.stats.marketing}
        </div>
      </div>

      <div className={MY_FAVORITES_STYLES.stats.card}>
        <div className={`${MY_FAVORITES_STYLES.stats.number} ${MY_FAVORITES_STYLES.stats.businessColor}`}>
          {stats.business}
        </div>
        <div className={MY_FAVORITES_STYLES.stats.label}>
          {MY_FAVORITES_MESSAGES.stats.business}
        </div>
      </div>

      <div className={MY_FAVORITES_STYLES.stats.card}>
        <div className={`${MY_FAVORITES_STYLES.stats.number} ${MY_FAVORITES_STYLES.stats.dataScienceColor}`}>
          {stats.dataScience}
        </div>
        <div className={MY_FAVORITES_STYLES.stats.label}>
          {MY_FAVORITES_MESSAGES.stats.dataScience}
        </div>
      </div>
    </div>
  )
}

export default StatsGrid