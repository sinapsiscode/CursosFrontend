import { CERTIFICATES_CONFIG, CERTIFICATES_AREAS } from '../../constants/certificatesConstants'

const EmptyState = ({ selectedArea, navigate }) => {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <svg className="w-24 h-24 mx-auto text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {selectedArea === 'all'
          ? CERTIFICATES_CONFIG.messages.noCertificates
          : `${CERTIFICATES_CONFIG.messages.noCertificatesArea} ${CERTIFICATES_AREAS[selectedArea]?.name}`}
      </h3>
      <p className="text-text-secondary mb-6">
        {CERTIFICATES_CONFIG.messages.completeCourses}
      </p>
      <button
        onClick={() => navigate('/courses')}
        className="bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
      >
        {CERTIFICATES_CONFIG.buttons.exploreCourses}
      </button>
    </div>
  )
}

export default EmptyState