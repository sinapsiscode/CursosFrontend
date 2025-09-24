// import { ADMIN_STYLES } from '../../../constants/adminDashboardConstants'

const StatCard = ({ title, value, change, color, icon }) => {
  const changeIsPositive = change > 0
  const changeClass = changeIsPositive
    ? ADMIN_STYLES.statCardChangePositive
    : ADMIN_STYLES.statCardChangeNegative
  const changeSign = changeIsPositive ? '+' : ''

  return (
    <div className={ADMIN_STYLES.statCard}>
      <div className={ADMIN_STYLES.statCardHeader}>
        <div>
          <p className={ADMIN_STYLES.statCardTitle}>{title}</p>
          <p className={ADMIN_STYLES.statCardValue}>
            {typeof value === 'number' ? value.toLocaleString() : value || 0}
          </p>
          <p className={`${ADMIN_STYLES.statCardChange} ${changeClass}`}>
            {changeSign}{change}% vs mes anterior
          </p>
        </div>
        <div className={`${ADMIN_STYLES.statCardIcon} ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard