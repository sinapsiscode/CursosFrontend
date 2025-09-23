import { useParams } from 'react-router-dom'
import { useCertificateVerify } from '../hooks/useCertificateVerify'
import LoadingState from '../components/certificateVerify/LoadingState'
import ErrorState from '../components/certificateVerify/ErrorState'
import VerificationHeader from '../components/certificateVerify/VerificationHeader'
import CertificateDisplay from '../components/certificateVerify/CertificateDisplay'
import VerificationInfo from '../components/certificateVerify/VerificationInfo'

const CertificateVerify = () => {
  const { verificationCode } = useParams()
  const { loading, certificate, error, formatDate, navigate } = useCertificateVerify(verificationCode)


  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <VerificationHeader />

        <CertificateDisplay certificate={certificate} formatDate={formatDate} />

        <VerificationInfo navigate={navigate} />
      </div>
    </div>
  )
}

export default CertificateVerify