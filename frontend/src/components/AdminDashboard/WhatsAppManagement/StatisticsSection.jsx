import {
  WHATSAPP_STYLES,
  WHATSAPP_LABELS,
  WHATSAPP_STATS_CONFIG
} from '../../../constants/whatsAppManagementConstants'

const StatisticsSection = ({
  config,
  onResetStats
}) => {
  return (
    <div className={WHATSAPP_STYLES.cardWithSpacing}>
      <h3 className="text-xl font-bold text-white">{WHATSAPP_LABELS.statisticsTitle}</h3>

      <div className={WHATSAPP_STYLES.statsGrid}>
        {WHATSAPP_STATS_CONFIG.map(({ key, label, gradient, border, textColor }) => (
          <div key={key} className={`${WHATSAPP_STYLES.statGridCard} ${gradient} ${border}`}>
            <p className={`${WHATSAPP_STYLES.statGridLabel} ${textColor}`}>
              {label}
            </p>
            <p className={`${WHATSAPP_STYLES.statGridValue} ${textColor}`}>
              {config.statistics[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onResetStats}
          className={WHATSAPP_STYLES.resetButton}
        >
          {WHATSAPP_LABELS.resetStats}
        </button>
      </div>
    </div>
  )
}

export default StatisticsSection