import { LoadingSpinner } from '../common'
import { CERTIFICATE_VERIFY_CONFIG } from '../../constants/certificateVerifyConstants'

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="text-white mt-4">{CERTIFICATE_VERIFY_CONFIG.messages.verifying}</p>
      </div>
    </div>
  )
}

export default LoadingState