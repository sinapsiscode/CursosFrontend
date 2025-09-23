import { CERTIFICATES_CONFIG, CERTIFICATES_AREAS } from '../../constants/certificatesConstants'

const CertificatesStats = ({ certificatesWithDetails, user }) => {
  const getRecentCertificates = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return certificatesWithDetails.filter(c => new Date(c.completedAt) > thirtyDaysAgo).length
  }

  const getAreasCovered = () => {
    return Object.keys(CERTIFICATES_AREAS).filter(area =>
      certificatesWithDetails.some(c => c.area === area)
    ).length
  }

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <div className="bg-surface rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {certificatesWithDetails.length}
        </div>
        <div className="text-text-secondary text-sm">{CERTIFICATES_CONFIG.stats.total}</div>
      </div>
      <div className="bg-surface rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-green-500 mb-1">
          {certificatesWithDetails.filter(c => c.area === user?.selectedArea).length}
        </div>
        <div className="text-text-secondary text-sm">{CERTIFICATES_CONFIG.stats.myArea}</div>
      </div>
      <div className="bg-surface rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-blue-500 mb-1">
          {getRecentCertificates()}
        </div>
        <div className="text-text-secondary text-sm">{CERTIFICATES_CONFIG.stats.recent}</div>
      </div>
      <div className="bg-surface rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-accent mb-1">
          {getAreasCovered()}
        </div>
        <div className="text-text-secondary text-sm">{CERTIFICATES_CONFIG.stats.areasCovered}</div>
      </div>
    </div>
  )
}

export default CertificatesStats