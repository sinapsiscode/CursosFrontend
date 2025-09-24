import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { useAuthStore, useUIStore } from '../store'
import {
  FILTER_TYPES,
  TYPE_FILTERS,
  AREA_FILTERS,
  EVENTS_UTILS
} from '../constants/eventsConstants.jsx'

export const useEvents = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, selectedArea } = useAuthStore()
  const { showToast, openModal } = useUIStore()

  // State
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(FILTER_TYPES.all)
  const [areaFilter, setAreaFilter] = useState(FILTER_TYPES.all)
  const [registering, setRegistering] = useState(null)
  const [demoMode, setDemoMode] = useState(false)

  // Modal states
  const [showSimulator, setShowSimulator] = useState(false)
  const [selectedEventForSimulation, setSelectedEventForSimulation] = useState(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null)

  // Load events when filters change
  useEffect(() => {
    loadEvents()
  }, [filter, areaFilter])

  // Load events from service
  const loadEvents = useCallback(() => {
    setLoading(true)

    let eventsToShow = []

    if (filter === FILTER_TYPES.relevant && isAuthenticated) {
      eventsToShow = eventService.getRelevantEvents()
    } else {
      eventsToShow = eventService.getAllActiveEvents()

      // Filter by type
      if (filter === FILTER_TYPES.webinars) {
        eventsToShow = eventsToShow.filter(e => e.type === 'webinar' || e.type === 'masterclass')
      } else if (filter === FILTER_TYPES.promotions) {
        eventsToShow = eventsToShow.filter(e => e.type === 'promotion' || e.type === 'bundle')
      }
    }

    // Filter by area
    if (areaFilter !== FILTER_TYPES.all) {
      eventsToShow = eventsToShow.filter(e => e.area === areaFilter)
    }

    setEvents(eventsToShow)
    setLoading(false)
  }, [filter, areaFilter, isAuthenticated])

  // Event handlers
  const handleEventRegister = useCallback(async (event) => {
    setSelectedEventForRegistration(event)
    setShowRegistrationModal(true)
  }, [])

  const handleRegistrationSuccess = useCallback(() => {
    setShowRegistrationModal(false)
    setSelectedEventForRegistration(null)
    loadEvents() // Reload to update counter
  }, [loadEvents])

  const handleEventDetail = useCallback((event) => {
    setSelectedEventForDetail(event)
    setShowEventDetail(true)
  }, [])

  const handleEventDetailSuccess = useCallback(() => {
    console.log('✅ Inscripción exitosa al evento:', selectedEventForDetail?.title)
    setShowEventDetail(false)
    setSelectedEventForDetail(null)
    loadEvents() // Reload to update registered counter
  }, [selectedEventForDetail, loadEvents])

  const handleSimulatorOpen = useCallback((event) => {
    setSelectedEventForSimulation(event)
    setShowSimulator(true)
  }, [])

  const handleSimulatorClose = useCallback(() => {
    setShowSimulator(false)
    setSelectedEventForSimulation(null)
  }, [])

  const handleModalClose = useCallback((modalType) => {
    switch (modalType) {
      case 'registration':
        setShowRegistrationModal(false)
        setSelectedEventForRegistration(null)
        break
      case 'detail':
        setShowEventDetail(false)
        setSelectedEventForDetail(null)
        break
      default:
        break
    }
  }, [])

  // Filter handlers
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter)
  }, [])

  const handleAreaFilterChange = useCallback((newAreaFilter) => {
    setAreaFilter(newAreaFilter)
  }, [])

  const toggleDemoMode = useCallback(() => {
    setDemoMode(prev => !prev)
  }, [])

  // Navigation helpers
  const navigateToCourses = useCallback(() => {
    navigate('/courses')
  }, [navigate])

  const navigateToBundle = useCallback((eventId) => {
    navigate(`/bundle/${eventId}`)
  }, [navigate])

  const navigateToLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  // Utility functions
  const formatEventDate = useCallback((dateString) => {
    return EVENTS_UTILS.formatEventDate(dateString)
  }, [])

  const getDaysUntilEvent = useCallback((dateString) => {
    return EVENTS_UTILS.getDaysUntilEvent(dateString)
  }, [])

  const getTimeIndicatorClass = useCallback((dateString) => {
    return EVENTS_UTILS.getTimeIndicatorClass(dateString)
  }, [])

  // Computed values
  const hasEvents = events.length > 0
  const showRelevantFilter = isAuthenticated
  const typeFiltersWithRelevant = showRelevantFilter
    ? [...TYPE_FILTERS, { value: FILTER_TYPES.relevant, label: 'Para Ti 🎯' }]
    : TYPE_FILTERS

  const isRelevantFilterActive = filter === FILTER_TYPES.relevant && hasEvents

  return {
    // Data
    events,
    loading,
    filter,
    areaFilter,
    registering,
    demoMode,

    // Modal states
    showSimulator,
    selectedEventForSimulation,
    showRegistrationModal,
    selectedEventForRegistration,
    showEventDetail,
    selectedEventForDetail,

    // Computed values
    hasEvents,
    showRelevantFilter,
    typeFiltersWithRelevant,
    isRelevantFilterActive,

    // Filter options
    typeFilters: typeFiltersWithRelevant,
    areaFilters: AREA_FILTERS,

    // Event handlers
    handleEventRegister,
    handleRegistrationSuccess,
    handleEventDetail,
    handleEventDetailSuccess,
    handleSimulatorOpen,
    handleSimulatorClose,
    handleModalClose,

    // Filter handlers
    handleFilterChange,
    handleAreaFilterChange,
    toggleDemoMode,

    // Navigation helpers
    navigateToCourses,
    navigateToBundle,
    navigateToLogin,

    // Utility functions
    formatEventDate,
    getDaysUntilEvent,
    getTimeIndicatorClass,
    loadEvents,

    // User state
    isAuthenticated,
    user,
    selectedArea
  }
}