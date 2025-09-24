import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'
import FilterGroup from './FilterGroup'
import RelevantIndicator from './RelevantIndicator'

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
          label={EVENTS_MESSAGES.filters.eventType}
          options={typeFilters}
          selectedValue={filter}
          onFilterChange={onFilterChange}
        />

        {/* Area Filter */}
        <FilterGroup
          label={EVENTS_MESSAGES.filters.areaOfInterest}
          options={areaFilters}
          selectedValue={areaFilter}
          onFilterChange={onAreaFilterChange}
        />
      </div>

      {/* Relevant Events Indicator */}
      {isRelevantFilterActive && <RelevantIndicator />}
    </div>
  )
}

export default EventsFilters