import { CERTIFICATE_VERIFY_CONFIG } from '../../constants/certificateVerifyConstants'

const VerificationInfo = ({ navigate }) => {
  return (
    <div className="bg-surface rounded-xl p-6 text-center">
      <h3 className="text-lg font-bold text-white mb-2">{CERTIFICATE_VERIFY_CONFIG.labels.verificationInfo}</h3>
      <p className="text-text-secondary mb-4">
        {CERTIFICATE_VERIFY_CONFIG.messages.verificationInfo}
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          {CERTIFICATE_VERIFY_CONFIG.buttons.backHome}
        </button>
        <button
          onClick={() => navigate('/courses')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {CERTIFICATE_VERIFY_CONFIG.buttons.viewCourses}
        </button>
      </div>
    </div>
  )
}

export default VerificationInfo