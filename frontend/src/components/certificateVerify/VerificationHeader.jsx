import { CERTIFICATE_VERIFY_CONFIG } from '../../constants/certificateVerifyConstants'

const VerificationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{CERTIFICATE_VERIFY_CONFIG.messages.verified}</h1>
      <p className="text-secondary">{CERTIFICATE_VERIFY_CONFIG.messages.verifiedSubtitle}</p>
    </div>
  )
}

export default VerificationHeader