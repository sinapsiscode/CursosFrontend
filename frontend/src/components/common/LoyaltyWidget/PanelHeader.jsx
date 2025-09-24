import { LOYALTY_TEXTS, LOYALTY_ICONS } from '../../../constants/loyaltyConstants.jsx'

const PanelHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-white">{LOYALTY_TEXTS.loyaltyProgram}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {LOYALTY_ICONS.close}
        </svg>
      </button>
    </div>
  )
}

export default PanelHeader