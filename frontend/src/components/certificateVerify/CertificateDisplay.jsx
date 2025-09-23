import { CERTIFICATE_VERIFY_CONFIG } from '../../constants/certificateVerifyConstants'

const CertificateDisplay = ({ certificate, formatDate }) => {
  return (
    <div className="bg-white rounded-xl p-12 mb-8">
      <div className="text-center">
        {/* Logo y header */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">{CERTIFICATE_VERIFY_CONFIG.appInitial}</span>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-800">{CERTIFICATE_VERIFY_CONFIG.appName}</div>
              <div className="text-sm text-gray-600">Academy</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{CERTIFICATE_VERIFY_CONFIG.labels.certificateTitle}</h2>
          <p className="text-gray-600">{CERTIFICATE_VERIFY_CONFIG.labels.certificateSubtitle}</p>
        </div>

        {/* Información del estudiante */}
        <div className="mb-8">
          <h3 className="text-4xl font-bold text-indigo-800 mb-4">{certificate.userName}</h3>
          <p className="text-lg text-gray-700 mb-2">Por completar exitosamente el curso</p>
          <h4 className="text-2xl font-bold text-gray-800 mb-4">"{certificate.courseName}"</h4>
          <p className="text-gray-600">en el área de <strong>{certificate.area}</strong></p>
        </div>

        {/* Información adicional */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-left">
            <h5 className="font-semibold text-gray-800 mb-2">{CERTIFICATE_VERIFY_CONFIG.labels.courseDetails}</h5>
            <p className="text-sm text-gray-600 mb-1"><strong>{CERTIFICATE_VERIFY_CONFIG.labels.instructor}</strong> {certificate.instructor}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>{CERTIFICATE_VERIFY_CONFIG.labels.duration}</strong> {certificate.duration}</p>
            <p className="text-sm text-gray-600"><strong>{CERTIFICATE_VERIFY_CONFIG.labels.area}</strong> {certificate.area}</p>
          </div>
          <div className="text-left">
            <h5 className="font-semibold text-gray-800 mb-2">{CERTIFICATE_VERIFY_CONFIG.labels.verification}</h5>
            <p className="text-sm text-gray-600 mb-1"><strong>{CERTIFICATE_VERIFY_CONFIG.labels.code}</strong> {certificate.verificationCode}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>{CERTIFICATE_VERIFY_CONFIG.labels.completed}</strong> {formatDate(certificate.completedAt)}</p>
            <p className="text-sm text-gray-600"><strong>{CERTIFICATE_VERIFY_CONFIG.labels.verified}</strong> {formatDate(certificate.verifiedAt)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-8 border-t border-gray-200">
          <div className="text-left">
            <div className="text-sm text-gray-600">{CERTIFICATE_VERIFY_CONFIG.labels.completionDate}</div>
            <div className="font-semibold text-gray-800">{formatDate(certificate.completedAt)}</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-gray-500">{CERTIFICATE_VERIFY_CONFIG.labels.validCertificate}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">{CERTIFICATE_VERIFY_CONFIG.appNameFull}</div>
            <div className="text-xs text-gray-500">{CERTIFICATE_VERIFY_CONFIG.labels.certifyingInstitution}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateDisplay