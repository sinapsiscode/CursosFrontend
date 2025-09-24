import { LoadingSpinner } from '../components/common'
import { useEvents } from '../hooks/useEvents'
import { EVENTS_STYLES } from '../constants/eventsConstants.jsx'
import EventsHeader from '../components/events/EventsHeader'
import EventsFilters from '../components/events/EventsFilters'
import EventsList from '../components/events/EventsList'
import DemoModeMessage from '../components/events/DemoModeMessage'
import SimpleEventDemo from '../components/events/SimpleEventDemo'
import EventRegistrationModal from '../components/events/EventRegistrationModal'
import EventDetailModal from '../components/events/EventDetailModal'

const Events = () => {
  const {
    events,
    loading,
    filter,
    areaFilter,
    demoMode,
    showSimulator,
    selectedEventForSimulation,
    showRegistrationModal,
    selectedEventForRegistration,
    showEventDetail,
    selectedEventForDetail,
    hasEvents,
    typeFilters,
    areaFilters,
    isRelevantFilterActive,
    handleFilterChange,
    handleAreaFilterChange,
    toggleDemoMode,
    handleEventDetail,
    handleEventDetailSuccess,
    handleSimulatorOpen,
    handleSimulatorClose,
    handleModalClose,
    handleRegistrationSuccess,
    navigateToCourses,
    navigateToBundle,
    navigateToLogin,
    getDaysUntilEvent,
    getTimeIndicatorClass,
    isAuthenticated
  } = useEvents()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={EVENTS_STYLES.container}>
      <div className={EVENTS_STYLES.maxWidth}>
        {/* Header */}
        <EventsHeader
          isAuthenticated={isAuthenticated}
          demoMode={demoMode}
          onToggleDemoMode={toggleDemoMode}
        />

        {/* Filters */}
        <EventsFilters
          filter={filter}
          areaFilter={areaFilter}
          typeFilters={typeFilters}
          areaFilters={areaFilters}
          isRelevantFilterActive={isRelevantFilterActive}
          onFilterChange={handleFilterChange}
          onAreaFilterChange={handleAreaFilterChange}
        />

        {/* Events List */}
        <EventsList
          events={events}
          hasEvents={hasEvents}
          demoMode={demoMode}
          isAuthenticated={isAuthenticated}
          filter={filter}
          onEventDetail={handleEventDetail}
          onSimulatorOpen={handleSimulatorOpen}
          onNavigateToCourses={navigateToCourses}
          onNavigateToBundle={navigateToBundle}
          onNavigateToLogin={navigateToLogin}
          getDaysUntilEvent={getDaysUntilEvent}
          getTimeIndicatorClass={getTimeIndicatorClass}
        />

        {/* Demo Mode Message */}
        {demoMode && <DemoModeMessage />}
      </div>

      {/* Event Simulator */}
      {showSimulator && selectedEventForSimulation && (
        <SimpleEventDemo
          event={selectedEventForSimulation}
          onClose={handleSimulatorClose}
        />
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEventForRegistration && (
        <EventRegistrationModal
          event={selectedEventForRegistration}
          onClose={() => handleModalClose('registration')}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Event Detail Modal */}
      {showEventDetail && selectedEventForDetail && (
        <EventDetailModal
          event={selectedEventForDetail}
          onClose={() => handleModalClose('detail')}
          onSuccess={handleEventDetailSuccess}
        />
      )}
    </div>
  )
}

export default Events