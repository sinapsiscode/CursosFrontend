// 🎯 Componente reutilizable para mostrar tarjeta de área
const AreaCard = ({ area, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(area.id)}
      className={`
        relative p-8 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isSelected
          ? `${area.color} shadow-2xl`
          : 'bg-surface hover:bg-opacity-80 border border-gray-600'
        }
      `}
    >
      {/* Ícono */}
      <div className={`
        flex justify-center mb-6 transition-colors duration-300
        ${isSelected ? 'text-white' : area.textColor}
      `}>
        {area.icon}
      </div>

      {/* Título */}
      <h3 className={`
        text-2xl font-bold text-center mb-4 transition-colors duration-300
        ${isSelected ? 'text-white' : 'text-white'}
      `}>
        {area.name}
      </h3>

      {/* Descripción */}
      <p className={`
        text-center leading-relaxed transition-colors duration-300
        ${isSelected ? 'text-white text-opacity-90' : 'text-secondary'}
      `}>
        {area.description}
      </p>

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default AreaCard