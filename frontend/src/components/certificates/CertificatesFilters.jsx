import { CERTIFICATES_CONFIG, CERTIFICATES_AREAS } from '../../constants/certificatesConstants'

const CertificatesFilters = ({ selectedArea, setSelectedArea }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedArea('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedArea === 'all'
                ? 'bg-accent text-background'
                : 'bg-surface text-white hover:bg-gray-600'
            }`}
          >
            {CERTIFICATES_CONFIG.filters.allAreas}
          </button>
          {Object.entries(CERTIFICATES_AREAS).map(([key, area]) => (
            <button
              key={key}
              onClick={() => setSelectedArea(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedArea === key
                  ? 'bg-accent text-background'
                  : 'bg-surface text-white hover:bg-gray-600'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CertificatesFilters