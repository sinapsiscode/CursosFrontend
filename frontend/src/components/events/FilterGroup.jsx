import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const FilterButton = ({
  option,
  isSelected,
  onClick
}) => {
  const buttonClass = isSelected
    ? EVENTS_STYLES.filters.button.active
    : EVENTS_STYLES.filters.button.inactive

  return (
    <button
      onClick={() => onClick(option.value)}
      className={buttonClass}
    >
      {option.label}
    </button>
  )
}

const FilterGroup = ({
  label,
  options,
  selectedValue,
  onFilterChange
}) => {
  return (
    <div>
      <label className={EVENTS_STYLES.filters.label}>
        {label}
      </label>
      <div className={EVENTS_STYLES.filters.buttonGroup}>
        {options.map(option => (
          <FilterButton
            key={option.value}
            option={option}
            isSelected={selectedValue === option.value}
            onClick={onFilterChange}
          />
        ))}
      </div>
    </div>
  )
}

export default FilterGroup