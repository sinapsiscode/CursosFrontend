import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'
import FilterGroup from './FilterGroup'

const EventsFilters = ({
  filter,
  areaFilter,
  typeFilters,
  areaFilters,
  isRelevantFilterActive,
  onFilterChange,
  onAreaFilterChange
}) => {
  return (
    <div className={EVENTS_STYLES.filters.container}>
      <div className={EVENTS_STYLES.filters.grid}>
        {/* Type Filter */}
        <FilterGroup
          label="Tipo de evento"
          options={typeFilters}
          selectedValue={filter}
          onFilterChange={onFilterChange}
        />

        {/* Area Filter */}
        <FilterGroup
          label="Área de interés"
          options={areaFilters}
          selectedValue={areaFilter}
          onFilterChange={onAreaFilterChange}
        />
      </div>
    </div>
  )
}

export default EventsFilters