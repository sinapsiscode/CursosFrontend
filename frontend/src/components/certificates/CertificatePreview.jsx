import { CERTIFICATES_CONFIG, CERTIFICATES_AREAS } from '../../constants/certificatesConstants'

const CertificatePreview = ({ certificate, user, onClose, onDownload, onShare, formatDate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Vista previa del certificado */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-12 rounded-lg text-center border-8 border-indigo-200">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-xl">{CERTIFICATES_CONFIG.appInitial}</span>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-800">{CERTIFICATES_CONFIG.appName}</div>
                <div className="text-sm text-gray-600">Academy</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{CERTIFICATES_CONFIG.certificateTitle}</h1>
            <p className="text-gray-600">{CERTIFICATES_CONFIG.certificateSubtitle}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-indigo-800 mb-4">{user?.name}</h2>
            <p className="text-lg text-gray-700 mb-2">Por completar exitosamente el curso</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">"{certificate.courseName}"</h3>
            <p className="text-gray-600">en el área de <strong>{CERTIFICATES_AREAS[certificate.area]?.name}</strong></p>
          </div>

          <div className="flex justify-between items-end">
            <div className="text-left">
              <div className="border-t-2 border-gray-400 pt-2 mb-2">
                <p className="text-sm text-gray-600">{CERTIFICATES_CONFIG.verification.completionDateLabel}</p>
                <p className="font-semibold">{formatDate(certificate.completedAt)}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-2">
                <svg className="w-10 h-10 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">{CERTIFICATES_CONFIG.verification.verifiedLabel}</p>
            </div>

            <div className="text-right">
              <div className="border-t-2 border-gray-400 pt-2 mb-2">
                <p className="text-sm text-gray-600">{CERTIFICATES_CONFIG.verification.codeLabel.replace(':', '')}</p>
                <p className="font-mono text-xs">{certificate.verificationCode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => onDownload(certificate)}
            className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            {CERTIFICATES_CONFIG.buttons.download}
          </button>
          <button
            onClick={() => onShare(certificate)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {CERTIFICATES_CONFIG.buttons.share}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CertificatePreview