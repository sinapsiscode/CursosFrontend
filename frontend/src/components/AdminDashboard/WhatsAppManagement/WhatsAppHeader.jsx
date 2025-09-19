import {
  WHATSAPP_SECTIONS,
  WHATSAPP_SECTION_LABELS,
  WHATSAPP_STYLES,
  WHATSAPP_LABELS
} from '../../../constants/whatsAppManagementConstants'

const WhatsAppHeader = ({
  activeSection,
  isEditing,
  onSectionChange,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <div className={WHATSAPP_STYLES.header}>
      {/* Section Tabs */}
      <div className={WHATSAPP_STYLES.sectionTabs}>
        {Object.values(WHATSAPP_SECTIONS).map(section => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`${WHATSAPP_STYLES.sectionTab} ${
              activeSection === section
                ? WHATSAPP_STYLES.sectionTabActive
                : WHATSAPP_STYLES.sectionTabInactive
            }`}
          >
            {WHATSAPP_SECTION_LABELS[section]}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className={WHATSAPP_STYLES.actionButtons}>
        {isEditing ? (
          <>
            <button
              onClick={onCancel}
              className={WHATSAPP_STYLES.cancelButton}
            >
              {WHATSAPP_LABELS.cancel}
            </button>
            <button
              onClick={onSave}
              className={WHATSAPP_STYLES.saveButton}
            >
              {WHATSAPP_LABELS.save}
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className={WHATSAPP_STYLES.editButton}
          >
            {WHATSAPP_LABELS.edit}
          </button>
        )}
      </div>
    </div>
  )
}

export default WhatsAppHeader