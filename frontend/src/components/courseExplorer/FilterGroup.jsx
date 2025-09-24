import { COURSE_EXPLORER_STYLES } from '../../constants/courseExplorerConstants.jsx'

const FilterOption = ({
  option,
  isSelected,
  onClick
}) => {
  const buttonClass = isSelected
    ? COURSE_EXPLORER_STYLES.filterOption.active
    : COURSE_EXPLORER_STYLES.filterOption.inactive

  return (
    <button
      onClick={() => onClick(option.key)}
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
      <label className={COURSE_EXPLORER_STYLES.filters.label}>
        {label}
      </label>
      <div className={COURSE_EXPLORER_STYLES.filters.optionsList}>
        {options.map(option => (
          <FilterOption
            key={option.key}
            option={option}
            isSelected={selectedValue === option.key}
            onClick={onFilterChange}
          />
        ))}
      </div>
    </div>
  )
}

export default FilterGroup