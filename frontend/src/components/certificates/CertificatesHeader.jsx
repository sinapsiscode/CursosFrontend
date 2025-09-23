import { CERTIFICATES_CONFIG } from '../../constants/certificatesConstants'

const CertificatesHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {CERTIFICATES_CONFIG.pageTitle}
      </h1>
      <p className="text-text-secondary text-lg">
        {CERTIFICATES_CONFIG.pageSubtitle}
      </p>
    </div>
  )
}

export default CertificatesHeader