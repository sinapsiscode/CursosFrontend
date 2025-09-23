import { LoadingSpinner } from '../components/common'
import { useCertificates } from '../hooks/useCertificates'
import { CERTIFICATES_AREAS } from '../constants/certificatesConstants'
import CertificatesHeader from '../components/certificates/CertificatesHeader'
import CertificatesStats from '../components/certificates/CertificatesStats'
import CertificatesFilters from '../components/certificates/CertificatesFilters'
import CertificateCard from '../components/certificates/CertificateCard'
import CertificatePreview from '../components/certificates/CertificatePreview'
import EmptyState from '../components/certificates/EmptyState'

const Certificates = () => {
  const {
    loading,
    certificatesWithDetails,
    selectedArea,
    setSelectedArea,
    selectedCertificate,
    showPreview,
    setShowPreview,
    getFilteredCertificates,
    handleDownloadCertificate,
    handleShareCertificate,
    handlePreviewCertificate,
    formatDate,
    user,
    navigate
  } = useCertificates()




  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const filteredCertificates = getFilteredCertificates()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CertificatesHeader />

        <CertificatesStats certificatesWithDetails={certificatesWithDetails} user={user} />

        <CertificatesFilters selectedArea={selectedArea} setSelectedArea={setSelectedArea} />

        {/* Lista de certificados */}
        {filteredCertificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map(certificate => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                user={user}
                onPreview={handlePreviewCertificate}
                onDownload={handleDownloadCertificate}
                onShare={handleShareCertificate}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <EmptyState selectedArea={selectedArea} navigate={navigate} />
        )}

        {/* Modal de vista previa */}
        {showPreview && selectedCertificate && (
          <CertificatePreview
            certificate={selectedCertificate}
            user={user}
            onClose={() => {
              setShowPreview(false)
            }}
            onDownload={handleDownloadCertificate}
            onShare={handleShareCertificate}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  )
}

export default Certificates