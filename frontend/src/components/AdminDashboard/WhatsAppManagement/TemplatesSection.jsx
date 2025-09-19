import {
  WHATSAPP_STYLES,
  WHATSAPP_LABELS,
  WHATSAPP_FORM_CONFIG
} from '../../../constants/whatsAppManagementConstants'

const TemplatesSection = ({
  config,
  isEditing,
  onTemplateChange,
  onTest
}) => {
  return (
    <div className={WHATSAPP_STYLES.cardWithSpacing}>
      <h3 className="text-xl font-bold text-white">{WHATSAPP_LABELS.templatesTitle}</h3>

      {Object.entries(config.templates).map(([key, template]) => (
        <div key={key}>
          <label className={WHATSAPP_STYLES.formField}>
            {WHATSAPP_LABELS.templateLabels[key]}
          </label>
          <textarea
            value={template}
            onChange={(e) => onTemplateChange(key, e.target.value)}
            disabled={!isEditing}
            rows={WHATSAPP_FORM_CONFIG.templateMessage.rows}
            className={WHATSAPP_STYLES.textarea}
          />
          <button
            onClick={() => onTest(key)}
            className={WHATSAPP_STYLES.testButtonSmall}
          >
            {WHATSAPP_LABELS.testTemplate}
          </button>
        </div>
      ))}
    </div>
  )
}

export default TemplatesSection