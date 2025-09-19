import { useWhatsAppManagement } from '../../../hooks/useWhatsAppManagement'
import { WHATSAPP_SECTIONS, WHATSAPP_STYLES } from '../../../constants/whatsAppManagementConstants'
import WhatsAppHeader from './WhatsAppHeader'
import TestResult from './TestResult'
import BasicConfiguration from './BasicConfiguration'
import TemplatesSection from './TemplatesSection'
import GroupsSection from './GroupsSection'
import TriggersSection from './TriggersSection'
import StatisticsSection from './StatisticsSection'

const WhatsAppManagement = () => {
  const {
    // Estado
    config,
    isEditing,
    activeSection,
    testResult,
    notificationsEnabled,
    saving,

    // Acciones principales
    handleSave,
    handleCancel,
    handleEdit,
    handleTest,
    handleTestNotification,

    // Actualizaciones de configuración
    updateWhatsAppConfig,
    updateNotificationsConfig,
    updateConfigField,
    updateTemplate,
    updateGroup,
    updateTrigger,
    resetStatistics,

    // Navegación
    changeActiveSection
  } = useWhatsAppManagement()

  const renderActiveSection = () => {
    switch (activeSection) {
      case WHATSAPP_SECTIONS.BASIC:
        return (
          <BasicConfiguration
            config={config}
            isEditing={isEditing}
            saving={saving}
            notificationsEnabled={notificationsEnabled}
            onUpdateWhatsApp={updateWhatsAppConfig}
            onUpdateNotifications={updateNotificationsConfig}
            onTest={handleTest}
            onTestNotification={handleTestNotification}
            onConfigChange={updateConfigField}
          />
        )

      case WHATSAPP_SECTIONS.TEMPLATES:
        return (
          <TemplatesSection
            config={config}
            isEditing={isEditing}
            onTemplateChange={updateTemplate}
            onTest={handleTest}
          />
        )

      case WHATSAPP_SECTIONS.GROUPS:
        return (
          <GroupsSection
            config={config}
            isEditing={isEditing}
            onGroupChange={updateGroup}
          />
        )

      case WHATSAPP_SECTIONS.TRIGGERS:
        return (
          <TriggersSection
            config={config}
            isEditing={isEditing}
            onTriggerChange={updateTrigger}
          />
        )

      case WHATSAPP_SECTIONS.STATS:
        return (
          <StatisticsSection
            config={config}
            onResetStats={resetStatistics}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={WHATSAPP_STYLES.container}>
      <WhatsAppHeader
        activeSection={activeSection}
        isEditing={isEditing}
        onSectionChange={changeActiveSection}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <TestResult testResult={testResult} />

      {renderActiveSection()}
    </div>
  )
}

export default WhatsAppManagement