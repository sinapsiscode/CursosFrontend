import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuthStore, useCourseStore, useUIStore } from '../store'
import { apiService } from '../services/api'
import { whatsappService } from '../services/whatsappService'
import { eventService } from '../services/eventService'
import {
  COURSE_EXPLORER_CONFIG,
  DEFAULT_FILTERS,
  VIEW_MODES
} from '../constants/courseExplorerConstants.jsx'

export const useCourseExplorer = () => {
  const { selectedArea } = useAuthStore()
  const {
    filteredCourses,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    setCourses
  } = useCourseStore()
  const { searchQuery, setSearchQuery } = useUIStore()

  // Local state
  const [loading, setLoading] = useState(true)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [whatsappTriggered, setWhatsappTriggered] = useState(false)

  // Load courses when area changes
  useEffect(() => {
    loadCourses()
  }, [selectedArea])

  // Handle search with debounce and WhatsApp lead generation
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      setFilters({ search: searchQuery })

      // WhatsApp Lead Generation: Trigger when user searches courses
      if (searchQuery.trim().length > COURSE_EXPLORER_CONFIG.minSearchQueryLength && !whatsappTriggered) {
        whatsappService.triggerCourseSearch(searchQuery, selectedArea)
        setWhatsappTriggered(true)

        // Track interests for personalized events
        eventService.trackUserInterest('search', {
          query: searchQuery,
          area: selectedArea
        })

        // Reset trigger after 30 seconds to allow new searches
        setTimeout(() => setWhatsappTriggered(false), COURSE_EXPLORER_CONFIG.whatsappResetTime)
      }
    }, COURSE_EXPLORER_CONFIG.searchDebounceTime)

    setSearchTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchQuery, selectedArea, whatsappTriggered, setFilters])

  // Load courses from API
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true)
      const courses = await apiService.getCourses()
      setCourses(courses)

      // Ensure dynamic courses are included
      useCourseStore.getState().initializeDynamicCourses()
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }, [setCourses])

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    const newFilters = { ...filters }

    if (newFilters[filterType] === value) {
      newFilters[filterType] = null // Toggle off if same value
    } else {
      newFilters[filterType] = value
    }

    setFilters(newFilters)
  }, [filters, setFilters])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSearchQuery('')
  }, [setFilters, setSearchQuery])

  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode)
  }, [setViewMode])

  // Handle search input change
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value)
  }, [setSearchQuery])

  // Computed values
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value =>
      value !== null && value !== ''
    ).length
  }, [filters])

  const hasResults = filteredCourses.length > 0
  const coursesCount = filteredCourses.length

  const isGridView = viewMode === VIEW_MODES.grid
  const isListView = viewMode === VIEW_MODES.list

  return {
    // Data
    filteredCourses,
    filters,
    viewMode,
    searchQuery,
    loading,
    selectedArea,

    // Computed values
    activeFiltersCount,
    hasResults,
    coursesCount,
    isGridView,
    isListView,

    // Actions
    handleFilterChange,
    clearAllFilters,
    handleViewModeChange,
    handleSearchChange,
    loadCourses,

    // View helpers
    getViewModeClass: () => {
      return isGridView
        ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    },

    getCourseCardVariant: () => {
      return isListView ? 'large' : 'medium'
    }
  }
}