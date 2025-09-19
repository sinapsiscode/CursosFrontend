import {
  WHATSAPP_STYLES,
  WHATSAPP_LABELS,
  WHATSAPP_FORM_CONFIG
} from '../../../constants/whatsAppManagementConstants'

const TriggersSection = ({
  config,
  isEditing,
  onTriggerChange
}) => {
  return (
    <div className={WHATSAPP_STYLES.cardWithSpacing}>
      <h3 className="text-xl font-bold text-white">{WHATSAPP_LABELS.triggersTitle}</h3>

      <div className="space-y-4">
        {Object.entries(config.triggers).map(([triggerType, settings]) => (
          <div key={triggerType} className={WHATSAPP_STYLES.triggerItem}>
            <div>
              <label className={WHATSAPP_STYLES.triggerLabel}>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => onTriggerChange(triggerType, { enabled: e.target.checked })}
                  disabled={!isEditing}
                  className={WHATSAPP_STYLES.checkbox}
                />
                <span className={WHATSAPP_STYLES.triggerTitle}>
                  {WHATSAPP_LABELS.triggerLabels[triggerType]}
                </span>
              </label>
              <p className={WHATSAPP_STYLES.triggerSubtitle}>
                {WHATSAPP_LABELS.delay} {settings.delay}{WHATSAPP_LABELS.delayUnit}
              </p>
            </div>

            <input
              type={WHATSAPP_FORM_CONFIG.triggerDelay.type}
              value={settings.delay}
              onChange={(e) => onTriggerChange(triggerType, { delay: parseInt(e.target.value) })}
              disabled={!isEditing}
              min={WHATSAPP_FORM_CONFIG.triggerDelay.min}
              max={WHATSAPP_FORM_CONFIG.triggerDelay.max}
              step={WHATSAPP_FORM_CONFIG.triggerDelay.step}
              className={WHATSAPP_STYLES.numberInput}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TriggersSection