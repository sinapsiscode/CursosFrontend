import {
  WHATSAPP_STYLES,
  WHATSAPP_LABELS
} from '../../../constants/whatsAppManagementConstants'

const ControlCard = ({
  title,
  subtitle,
  icon,
  iconClass,
  enabled,
  saving,
  onToggle,
  colorScheme,
  stats = [],
  testButton = null
}) => {
  return (
    <div className={WHATSAPP_STYLES.card}>
      <div className={WHATSAPP_STYLES.switchContainer}>
        <div className={WHATSAPP_STYLES.switchInfo}>
          <div className={`${WHATSAPP_STYLES.switchIcon} ${iconClass}`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          disabled={saving}
          className={`${WHATSAPP_STYLES.switchButton} ${
            enabled ? colorScheme.switchActive : colorScheme.switchInactive
          } ${saving ? WHATSAPP_STYLES.switchButtonDisabled : ''}`}
        >
          <span
            className={`${WHATSAPP_STYLES.switchToggle} ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className={WHATSAPP_STYLES.statCard}>
        <div className="flex justify-between">
          <span className={WHATSAPP_STYLES.statLabel}>Estado:</span>
          <span className={`font-medium ${
            enabled ? colorScheme.statusActive : colorScheme.statusInactive
          }`}>
            {enabled ? WHATSAPP_LABELS.active : WHATSAPP_LABELS.inactive}
          </span>
        </div>

        {stats.map((stat, index) => (
          <div key={index} className={WHATSAPP_STYLES.statItem}>
            <span className={WHATSAPP_STYLES.statLabel}>{stat.label}</span>
            <span className={`${WHATSAPP_STYLES.statValue} ${stat.className || ''}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {testButton && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={testButton.onClick}
            disabled={testButton.disabled}
            className={WHATSAPP_STYLES.testButton}
          >
            {testButton.label}
          </button>
        </div>
      )}
    </div>
  )
}

export default ControlCard