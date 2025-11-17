import { CERTIFICATE_VERIFY_CONFIG } from '../../constants/certificateVerifyConstants'

const ErrorState = ({ error, navigate }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-surface rounded-xl p-8">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{CERTIFICATE_VERIFY_CONFIG.messages.invalid}</h2>
          <p className="text-secondary mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            {CERTIFICATE_VERIFY_CONFIG.buttons.backHome}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorState