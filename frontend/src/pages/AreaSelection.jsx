import { AREAS_CONFIG, APP_CONFIG } from '../constants/areas'
import { useAreaSelection } from '../hooks/useAreaSelection'
import AreaSelectionHeader from '../components/areas/AreaSelectionHeader'
import AreaCard from '../components/areas/AreaCard'

const AreaSelection = () => {
  const { selectedAreaState, handleAreaSelect, handleContinue } = useAreaSelection()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <AreaSelectionHeader />

        {/* Selección de áreas */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {AREAS_CONFIG.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              isSelected={selectedAreaState === area.id}
              onSelect={handleAreaSelect}
            />
          ))}
        </div>

        {/* Botón de continuar */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedAreaState}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
              ${selectedAreaState
                ? 'bg-accent text-background hover:bg-opacity-90 hover:scale-105 shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
{selectedAreaState ? APP_CONFIG.continueButton.enabled : APP_CONFIG.continueButton.disabled}
          </button>
        </div>

        {/* Nota informativa */}
        <div className="text-center mt-8">
          <p className="text-text-secondary text-sm">
            {APP_CONFIG.infoNote}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AreaSelection