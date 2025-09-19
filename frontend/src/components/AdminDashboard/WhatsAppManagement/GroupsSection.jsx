import {
  WHATSAPP_STYLES,
  WHATSAPP_LABELS,
  WHATSAPP_FORM_CONFIG
} from '../../../constants/whatsAppManagementConstants'

const GroupsSection = ({
  config,
  isEditing,
  onGroupChange
}) => {
  return (
    <div className={WHATSAPP_STYLES.cardWithSpacing}>
      <h3 className="text-xl font-bold text-white">{WHATSAPP_LABELS.groupsTitle}</h3>

      <div className={WHATSAPP_STYLES.formGrid}>
        {Object.entries(config.groups).map(([area, group]) => (
          <div key={area}>
            <label className={WHATSAPP_STYLES.formField}>
              {WHATSAPP_LABELS.groupLabel} {area.charAt(0).toUpperCase() + area.slice(1)}
            </label>
            <input
              type={WHATSAPP_FORM_CONFIG.groupLink.type}
              value={group.link}
              onChange={(e) => onGroupChange(area, { link: e.target.value })}
              disabled={!isEditing}
              className={WHATSAPP_STYLES.input}
              placeholder={WHATSAPP_FORM_CONFIG.groupLink.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupsSection