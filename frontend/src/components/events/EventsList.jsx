import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'
import EventCard from './EventCard'
import EmptyEventsState from './EmptyEventsState'

const EventsList = ({
  events,
  hasEvents,
  demoMode,
  isAuthenticated,
  filter,
  onEventDetail,
  onSimulatorOpen,
  onNavigateToCourses,
  onNavigateToBundle,
  onNavigateToLogin,
  getDaysUntilEvent,
  getTimeIndicatorClass
}) => {
  if (!hasEvents) {
    return <EmptyEventsState />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          demoMode={demoMode}
          isAuthenticated={isAuthenticated}
          filter={filter}
          onEventDetail={onEventDetail}
          onSimulatorOpen={onSimulatorOpen}
          onNavigateToCourses={onNavigateToCourses}
          onNavigateToBundle={onNavigateToBundle}
          onNavigateToLogin={onNavigateToLogin}
          getDaysUntilEvent={getDaysUntilEvent}
          getTimeIndicatorClass={getTimeIndicatorClass}
        />
      ))}
    </div>
  )
}

export default EventsList