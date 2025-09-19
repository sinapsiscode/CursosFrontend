import {
  WHATSAPP_STYLES,
  WHATSAPP_LABELS,
  WHATSAPP_ICONS,
  WHATSAPP_COLORS,
  WHATSAPP_FORM_CONFIG
} from '../../../constants/whatsAppManagementConstants'
import ControlCard from './ControlCard'

const BasicConfiguration = ({
  config,
  isEditing,
  saving,
  notificationsEnabled,
  onUpdateWhatsApp,
  onUpdateNotifications,
  onTest,
  onTestNotification,
  onConfigChange
}) => {
  return (
    <div className="space-y-6">
      {/* Controles Principales ON/OFF */}
      <div className={WHATSAPP_STYLES.controlGrid}>
        {/* Control WhatsApp */}
        <ControlCard
          title={WHATSAPP_LABELS.whatsappAutoTitle}
          subtitle={WHATSAPP_LABELS.whatsappAutoSubtitle}
          icon={WHATSAPP_ICONS.whatsapp}
          iconClass={WHATSAPP_COLORS.whatsapp.icon}
          enabled={config.autoSend}
          saving={saving}
          onToggle={() => onUpdateWhatsApp({ autoSend: !config.autoSend })}
          colorScheme={WHATSAPP_COLORS.whatsapp}
          stats={[
            {
              label: WHATSAPP_LABELS.messagesSent,
              value: config.statistics?.totalSent || 0
            },
            {
              label: WHATSAPP_LABELS.phoneNumber,
              value: config.phoneNumber,
              className: 'font-mono text-xs'
            }
          ]}
          testButton={config.autoSend && {
            label: saving ? WHATSAPP_LABELS.sending : WHATSAPP_LABELS.testMessage,
            onClick: () => onTest('welcome'),
            disabled: saving
          }}
        />

        {/* Control Notificaciones */}
        <ControlCard
          title={WHATSAPP_LABELS.notificationsTitle}
          subtitle={WHATSAPP_LABELS.notificationsSubtitle}
          icon={WHATSAPP_ICONS.notifications}
          iconClass={WHATSAPP_COLORS.notifications.icon}
          enabled={notificationsEnabled}
          saving={saving}
          onToggle={() => onUpdateNotifications(!notificationsEnabled)}
          colorScheme={WHATSAPP_COLORS.notifications}
          stats={[
            {
              label: WHATSAPP_LABELS.centerActive,
              value: WHATSAPP_LABELS.yes
            }
          ]}
          testButton={notificationsEnabled && {
            label: WHATSAPP_LABELS.testNotification,
            onClick: onTestNotification
          }}
        />
      </div>

      {/* Configuración Detallada */}
      <div className={WHATSAPP_STYLES.cardWithSpacing}>
        <h3 className="text-xl font-bold text-white">{WHATSAPP_LABELS.detailedConfig}</h3>

        <div className={WHATSAPP_STYLES.formGrid}>
          <div>
            <label className={WHATSAPP_STYLES.formField}>
              {WHATSAPP_LABELS.phoneNumberLabel}
            </label>
            <input
              type={WHATSAPP_FORM_CONFIG.phoneNumber.type}
              value={config.phoneNumber}
              onChange={(e) => onConfigChange('phoneNumber', e.target.value)}
              disabled={!isEditing}
              className={WHATSAPP_STYLES.input}
              placeholder={WHATSAPP_FORM_CONFIG.phoneNumber.placeholder}
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.autoSend}
                onChange={(e) => onConfigChange('autoSend', e.target.checked)}
                disabled={!isEditing}
                className={WHATSAPP_STYLES.checkbox}
              />
              <span className="text-white">{WHATSAPP_LABELS.autoSendEnabled}</span>
            </label>
          </div>
        </div>

        <div>
          <label className={WHATSAPP_STYLES.formField}>
            {WHATSAPP_LABELS.welcomeMessageLabel}
          </label>
          <textarea
            value={config.welcomeMessage}
            onChange={(e) => onConfigChange('welcomeMessage', e.target.value)}
            disabled={!isEditing}
            rows={WHATSAPP_FORM_CONFIG.welcomeMessage.rows}
            className={WHATSAPP_STYLES.textarea}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onTest('welcome')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {WHATSAPP_LABELS.testWelcome}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BasicConfiguration