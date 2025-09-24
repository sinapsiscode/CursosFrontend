import {
  NOTIFICATION_STYLES,
  NOTIFICATION_LABELS,
  NOTIFICATION_ICONS
} from '../../../constants/notificationManagementConstants'

const NotificationPreview = ({
  formData,
  processedSubject,
  processedMessage,
  selectedCourse,
  estimatedRecipients
}) => {
  return (
    <div className={NOTIFICATION_STYLES.formContainer}>
      <div className={NOTIFICATION_STYLES.formColumn}>
        <div className={NOTIFICATION_STYLES.previewCard}>
          <div className={NOTIFICATION_STYLES.previewHeader}>
            <h2 className={NOTIFICATION_STYLES.previewTitle}>
              {NOTIFICATION_ICONS.preview} {NOTIFICATION_LABELS.tabs.preview}
            </h2>
          </div>

          <div className={NOTIFICATION_STYLES.previewBody}>
            {/* Vista previa del Email */}
            {formData.channels.includes('email') && (
              <div className={NOTIFICATION_STYLES.section}>
                <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                  {NOTIFICATION_ICONS.email} Vista Previa - Email
                </h3>

                <div className={NOTIFICATION_STYLES.previewNotification}>
                  <div className={NOTIFICATION_STYLES.previewSubject}>
                    <strong>Asunto:</strong> {processedSubject || formData.subject}
                  </div>
                  <div className={NOTIFICATION_STYLES.previewMessage}>
                    {processedMessage || formData.message}
                  </div>
                  <div className={NOTIFICATION_STYLES.previewMeta}>
                    <div>Tipo: {NOTIFICATION_LABELS.types[formData.type]}</div>
                    <div>Prioridad: {NOTIFICATION_LABELS.priority[formData.priority]}</div>
                    {selectedCourse && (
                      <div>Curso: {selectedCourse.title}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vista previa del WhatsApp */}
            {formData.channels.includes('whatsapp') && (
              <div className={NOTIFICATION_STYLES.section}>
                <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                  {NOTIFICATION_ICONS.whatsapp} Vista Previa - WhatsApp
                </h3>

                <div className={NOTIFICATION_STYLES.previewNotification}>
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                    <div className="font-medium text-green-800 mb-1">
                      {processedSubject || formData.subject}
                    </div>
                    <div className="text-green-700 whitespace-pre-wrap">
                      {processedMessage || formData.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vista previa Push Notification */}
            {formData.channels.includes('push') && (
              <div className={NOTIFICATION_STYLES.section}>
                <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                  {NOTIFICATION_ICONS.push} Vista Previa - Push Notification
                </h3>

                <div className={NOTIFICATION_STYLES.previewNotification}>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{NOTIFICATION_ICONS[formData.type]}</div>
                      <div>
                        <div className="font-medium text-blue-900 text-sm">
                          {processedSubject || formData.subject}
                        </div>
                        <div className="text-blue-700 text-sm mt-1 line-clamp-2">
                          {processedMessage || formData.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vista previa In-App */}
            {formData.channels.includes('in_app') && (
              <div className={NOTIFICATION_STYLES.section}>
                <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                  {NOTIFICATION_ICONS.in_app} Vista Previa - Notificación In-App
                </h3>

                <div className={NOTIFICATION_STYLES.previewNotification}>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-xl">{NOTIFICATION_ICONS[formData.type]}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {processedSubject || formData.subject}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            {processedMessage || formData.message}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Ahora
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información de Envío */}
            <div className={NOTIFICATION_STYLES.section}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_ICONS.info} Información de Envío
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Audiencia:</strong> {NOTIFICATION_LABELS.audiences[formData.targetAudience]}
                  </div>
                  <div>
                    <strong>Destinatarios:</strong> {estimatedRecipients}
                  </div>
                  <div>
                    <strong>Canales:</strong> {formData.channels.map(channel =>
                      NOTIFICATION_LABELS.channels[channel]
                    ).join(', ')}
                  </div>
                  <div>
                    <strong>Tipo:</strong> {NOTIFICATION_LABELS.types[formData.type]}
                  </div>
                </div>

                {formData.scheduledFor && (
                  <div className="pt-3 border-t border-gray-200">
                    <strong>Programado para:</strong> {' '}
                    {new Date(formData.scheduledFor).toLocaleString('es-ES')}
                  </div>
                )}
              </div>
            </div>

            {/* Variables Disponibles */}
            <div className={NOTIFICATION_STYLES.section}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_ICONS.settings} Variables Disponibles
              </h3>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-800 space-y-2">
                  <div><strong>Estudiante:</strong> {'{student.name}'}, {'{student.firstName}'}, {'{student.email}'}</div>
                  <div><strong>Curso:</strong> {'{course.title}'}, {'{course.instructor}'}, {'{course.startDate}'}</div>
                  <div><strong>Sistema:</strong> {'{system.siteName}'}, {'{system.currentDate}'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationPreview