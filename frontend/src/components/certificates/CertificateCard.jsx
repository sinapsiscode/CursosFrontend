import { CERTIFICATES_CONFIG, CERTIFICATES_AREAS } from '../../constants/certificatesConstants'

const CertificateCard = ({ certificate, user, onPreview, onDownload, onShare, formatDate }) => {
  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Header del certificado */}
      <div className={`${CERTIFICATES_AREAS[certificate.area]?.bg || 'bg-gray-500'} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6">
          <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">{CERTIFICATES_CONFIG.appInitial}</span>
              </div>
              <span className="font-bold">{CERTIFICATES_CONFIG.appNameFull}</span>
            </div>
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              {CERTIFICATES_AREAS[certificate.area]?.name || 'General'}
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2 line-clamp-2">
            {certificate.courseName}
          </h3>

          <div className="flex items-center justify-between text-sm opacity-90">
            <span>{user?.name}</span>
            <span>{formatDate(certificate.completedAt)}</span>
          </div>
        </div>
      </div>

      {/* Contenido del certificado */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-green-500">Curso Completado</span>
          </div>

          {certificate.course && (
            <div className="text-sm text-secondary mb-3">
              <p><strong>Instructor:</strong> {certificate.course.instructor}</p>
              <p><strong>Duración:</strong> {Math.floor(certificate.course.duration / 60)}h {certificate.course.duration % 60}m</p>
            </div>
          )}

          <div className="text-xs text-secondary bg-background rounded p-2">
            <strong>{CERTIFICATES_CONFIG.verification.codeLabel}</strong><br />
            <code className="font-mono">{certificate.verificationCode}</code>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(certificate)}
            className="flex-1 bg-background text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{CERTIFICATES_CONFIG.buttons.preview}</span>
          </button>

          <button
            onClick={() => onDownload(certificate)}
            className="bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            title={CERTIFICATES_CONFIG.buttons.download}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          <button
            onClick={() => onShare(certificate)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            title={CERTIFICATES_CONFIG.buttons.share}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CertificateCard