import {
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
  TARGET_AUDIENCES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STYLES,
  NOTIFICATION_LABELS,
  NOTIFICATION_ICONS
} from '../../../constants/notificationManagementConstants'

const NotificationForm = ({
  formData,
  errors,
  courses,
  saving,
  sending,
  isFormValid,
  estimatedRecipients,
  updateFormField,
  toggleChannel,
  saveNotification,
  sendNotification,
  scheduleNotification,
  resetForm
}) => {
  const handleSubmit = async (action) => {
    let success = false

    switch (action) {
      case 'save':
        success = await saveNotification()
        break
      case 'send':
        success = await sendNotification()
        break
      case 'schedule':
        success = await scheduleNotification()
        break
    }

    if (success && action === 'send') {
      resetForm()
    }
  }

  return (
    <div className={NOTIFICATION_STYLES.formContainer}>
      <div className={NOTIFICATION_STYLES.formColumn}>
        <div className={NOTIFICATION_STYLES.formCard}>
          <div className={NOTIFICATION_STYLES.formHeader}>
            <h2 className={NOTIFICATION_STYLES.formTitle}>
              {NOTIFICATION_LABELS.sections.basicInfo}
            </h2>
          </div>

          <div className={NOTIFICATION_STYLES.formBody}>
            {/* Información Básica */}
            <div className={NOTIFICATION_STYLES.section}>
              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.title}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  placeholder={NOTIFICATION_LABELS.placeholders.title}
                  className={NOTIFICATION_STYLES.input}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">{errors.title}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={NOTIFICATION_STYLES.formGroup}>
                  <label className={NOTIFICATION_STYLES.label}>
                    {NOTIFICATION_LABELS.fields.type}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateFormField('type', e.target.value)}
                    className={NOTIFICATION_STYLES.select}
                  >
                    {Object.entries(NOTIFICATION_LABELS.types).map(([value, label]) => (
                      <option key={value} value={value}>
                        {NOTIFICATION_ICONS[value]} {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={NOTIFICATION_STYLES.formGroup}>
                  <label className={NOTIFICATION_STYLES.label}>
                    {NOTIFICATION_LABELS.fields.priority}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => updateFormField('priority', e.target.value)}
                    className={NOTIFICATION_STYLES.select}
                  >
                    {Object.entries(NOTIFICATION_LABELS.priority).map(([value, label]) => (
                      <option key={value} value={value}>
                        {NOTIFICATION_ICONS[value]} {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className={NOTIFICATION_STYLES.section}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_LABELS.sections.content}
              </h3>

              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.subject}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => updateFormField('subject', e.target.value)}
                  placeholder={NOTIFICATION_LABELS.placeholders.subject}
                  className={NOTIFICATION_STYLES.input}
                />
                {errors.subject && (
                  <span className="text-red-500 text-sm">{errors.subject}</span>
                )}
              </div>

              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.message}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateFormField('message', e.target.value)}
                  placeholder={NOTIFICATION_LABELS.placeholders.message}
                  rows={6}
                  className={NOTIFICATION_STYLES.textarea}
                />
                {errors.message && (
                  <span className="text-red-500 text-sm">{errors.message}</span>
                )}
              </div>
            </div>

            {/* Audiencia */}
            <div className={NOTIFICATION_STYLES.section}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_LABELS.sections.targeting}
              </h3>

              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.targetAudience}
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => updateFormField('targetAudience', e.target.value)}
                  className={NOTIFICATION_STYLES.select}
                >
                  {Object.entries(NOTIFICATION_LABELS.audiences).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.targetAudience && (
                  <span className="text-red-500 text-sm">{errors.targetAudience}</span>
                )}
              </div>

              {formData.targetAudience === TARGET_AUDIENCES.COURSE_SPECIFIC && (
                <div className={NOTIFICATION_STYLES.formGroup}>
                  <label className={NOTIFICATION_STYLES.label}>
                    {NOTIFICATION_LABELS.fields.courseId}
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => updateFormField('courseId', e.target.value)}
                    className={NOTIFICATION_STYLES.select}
                  >
                    <option value="">Seleccionar curso...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.area})
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <span className="text-red-500 text-sm">{errors.courseId}</span>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-600">
                📊 Destinatarios estimados: <strong>{estimatedRecipients}</strong>
              </div>
            </div>

            {/* Canales */}
            <div className={NOTIFICATION_STYLES.section}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_LABELS.sections.channels}
              </h3>

              <div className={NOTIFICATION_STYLES.channelGrid}>
                {Object.entries(NOTIFICATION_LABELS.channels).map(([channel, label]) => (
                  <div
                    key={channel}
                    onClick={() => toggleChannel(channel)}
                    className={`${NOTIFICATION_STYLES.channelOption} ${
                      formData.channels.includes(channel)
                        ? NOTIFICATION_STYLES.channelOptionActive
                        : NOTIFICATION_STYLES.channelOptionInactive
                    }`}
                  >
                    <span className={NOTIFICATION_STYLES.channelIcon}>
                      {NOTIFICATION_ICONS[channel]}
                    </span>
                    <span className={NOTIFICATION_STYLES.channelLabel}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {errors.channels && (
                <span className="text-red-500 text-sm">{errors.channels}</span>
              )}
            </div>

            {/* Programación */}
            <div className={NOTIFICATION_STYLES.section}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_LABELS.sections.scheduling}
              </h3>

              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.scheduledFor}
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => updateFormField('scheduledFor', e.target.value)}
                  className={NOTIFICATION_STYLES.input}
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className={NOTIFICATION_STYLES.buttonGroup}>
              <button
                onClick={() => handleSubmit('save')}
                disabled={!isFormValid || saving}
                className={NOTIFICATION_STYLES.buttonSecondary}
              >
                {saving ? 'Guardando...' : NOTIFICATION_LABELS.buttons.save}
              </button>

              {formData.scheduledFor ? (
                <button
                  onClick={() => handleSubmit('schedule')}
                  disabled={!isFormValid || saving}
                  className={NOTIFICATION_STYLES.buttonPrimary}
                >
                  {saving ? 'Programando...' : NOTIFICATION_LABELS.buttons.schedule}
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit('send')}
                  disabled={!isFormValid || sending}
                  className={NOTIFICATION_STYLES.buttonPrimary}
                >
                  {sending ? 'Enviando...' : NOTIFICATION_LABELS.buttons.send}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationForm