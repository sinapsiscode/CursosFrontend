import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STYLES,
  NOTIFICATION_LABELS,
  NOTIFICATION_ICONS
} from '../../../constants/notificationManagementConstants'

const NotificationTesting = ({
  testData,
  testing,
  updateTestField,
  sendTestEmail,
  sendTestWhatsApp
}) => {
  return (
    <div className={NOTIFICATION_STYLES.formContainer}>
      <div className={NOTIFICATION_STYLES.formColumn}>
        <div className={NOTIFICATION_STYLES.testingCard}>
          <div className={NOTIFICATION_STYLES.testingHeader}>
            <h2 className={NOTIFICATION_STYLES.formTitle}>
              {NOTIFICATION_ICONS.testing} {NOTIFICATION_LABELS.tabs.testing}
            </h2>
          </div>

          <div className={NOTIFICATION_STYLES.testingBody}>
            {/* Test Email */}
            <div className={NOTIFICATION_STYLES.testGroup}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_ICONS[NOTIFICATION_CHANNELS.EMAIL]} Probar Email
              </h3>

              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.testEmail}
                </label>
                <input
                  type="email"
                  value={testData.email}
                  onChange={(e) => updateTestField('email', e.target.value)}
                  placeholder={NOTIFICATION_LABELS.placeholders.testEmail}
                  className={NOTIFICATION_STYLES.input}
                />
              </div>

              <button
                onClick={sendTestEmail}
                disabled={!testData.email || testing}
                className={NOTIFICATION_STYLES.testButton}
              >
                {testing ? 'Enviando...' : `${NOTIFICATION_ICONS.send} Enviar Email de Prueba`}
              </button>
            </div>

            {/* Test WhatsApp */}
            <div className={NOTIFICATION_STYLES.testGroup}>
              <h3 className={NOTIFICATION_STYLES.sectionTitle}>
                {NOTIFICATION_ICONS[NOTIFICATION_CHANNELS.WHATSAPP]} Probar WhatsApp
              </h3>

              <div className={NOTIFICATION_STYLES.formGroup}>
                <label className={NOTIFICATION_STYLES.label}>
                  {NOTIFICATION_LABELS.fields.testWhatsApp}
                </label>
                <input
                  type="tel"
                  value={testData.whatsapp}
                  onChange={(e) => updateTestField('whatsapp', e.target.value)}
                  placeholder={NOTIFICATION_LABELS.placeholders.testWhatsApp}
                  className={NOTIFICATION_STYLES.input}
                />
              </div>

              <button
                onClick={sendTestWhatsApp}
                disabled={!testData.whatsapp || testing}
                className={NOTIFICATION_STYLES.testButton}
              >
                {testing ? 'Enviando...' : `${NOTIFICATION_ICONS.send} Enviar WhatsApp de Prueba`}
              </button>
            </div>

            {/* Resultados */}
            {testData.results && (
              <div className={NOTIFICATION_STYLES.testResults}>
                <div className={`flex items-center space-x-2 ${
                  testData.results.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>
                    {testData.results.type === 'success'
                      ? NOTIFICATION_ICONS.success
                      : NOTIFICATION_ICONS.error
                    }
                  </span>
                  <span>{testData.results.message}</span>
                </div>
              </div>
            )}

            {/* Información de Testing */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                {NOTIFICATION_ICONS.info} Información sobre las Pruebas
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Las pruebas envían el contenido actual del formulario</li>
                <li>• Solo se envía a la dirección especificada</li>
                <li>• No afecta a los usuarios reales</li>
                <li>• Útil para verificar formato y contenido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationTesting