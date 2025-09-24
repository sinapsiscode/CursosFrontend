import { useState, useEffect, useMemo, useCallback } from 'react'
import { AREAS, SORT_OPTIONS, DIFFICULTY_ORDER, MY_FAVORITES_MESSAGES } from '../constants/myFavoritesConstants.jsx'
import { useAuthStore } from '../store'
import { apiService } from '../services/api'

export const useMyFavorites = () => {
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [selectedArea, setSelectedArea] = useState('all')
  const [sortBy, setSortBy] = useState('dateAdded')
  const [loading, setLoading] = useState(true)

  const mockFavorites = useMemo(() => [
    {
      id: 1,
      title: 'React Avanzado',
      description: 'Domina React con hooks, context y patrones avanzados',
      area: 'programming',
      difficulty: 'Avanzado',
      duration: 25,
      thumbnail: '/course1.jpg',
      instructor: 'Juan Pérez',
      dateAdded: '2024-01-15',
      isEnrolled: false
    },
    {
      id: 2,
      title: 'Diseño UX/UI',
      description: 'Aprende a crear interfaces intuitivas y atractivas',
      area: 'design',
      difficulty: 'Intermedio',
      duration: 18,
      thumbnail: '/course2.jpg',
      instructor: 'María García',
      dateAdded: '2024-01-12',
      isEnrolled: true
    },
    {
      id: 3,
      title: 'Marketing Digital',
      description: 'Estrategias efectivas para el marketing online',
      area: 'marketing',
      difficulty: 'Principiante',
      duration: 15,
      thumbnail: '/course3.jpg',
      instructor: 'Carlos López',
      dateAdded: '2024-01-10',
      isEnrolled: false
    },
    {
      id: 4,
      title: 'Análisis de Datos con Python',
      description: 'Manipula y analiza datos usando pandas y numpy',
      area: 'data-science',
      difficulty: 'Intermedio',
      duration: 30,
      thumbnail: '/course4.jpg',
      instructor: 'Ana Martín',
      dateAdded: '2024-01-08',
      isEnrolled: false
    },
    {
      id: 5,
      title: 'Gestión de Proyectos',
      description: 'Metodologías ágiles y gestión efectiva de equipos',
      area: 'business',
      difficulty: 'Intermedio',
      duration: 20,
      thumbnail: '/course5.jpg',
      instructor: 'Pedro Sánchez',
      dateAdded: '2024-01-05',
      isEnrolled: true
    }
  ], [])

  const mockSuggestions = useMemo(() => [
    {
      id: 101,
      title: 'Vue.js Fundamentals',
      instructor: 'Elena Torres',
      thumbnail: '/suggestion1.jpg',
      rating: 4.8,
      area: 'programming'
    },
    {
      id: 102,
      title: 'Figma Masterclass',
      instructor: 'Roberto Kim',
      thumbnail: '/suggestion2.jpg',
      rating: 4.9,
      area: 'design'
    },
    {
      id: 103,
      title: 'SEO Avanzado',
      instructor: 'Laura Chen',
      thumbnail: '/suggestion3.jpg',
      rating: 4.7,
      area: 'marketing'
    }
  ], [])

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true)
      if (user) {
        const response = await apiService.get('/favorites')
        setFavorites(response.data || mockFavorites)
      } else {
        setFavorites(mockFavorites)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      setFavorites(mockFavorites)
    } finally {
      setLoading(false)
    }
  }, [user, mockFavorites])

  const loadSuggestions = useCallback(async () => {
    try {
      if (user) {
        const response = await apiService.get('/suggestions')
        setSuggestions(response.data || mockSuggestions)
      } else {
        setSuggestions(mockSuggestions)
      }
    } catch (error) {
      console.error('Error loading suggestions:', error)
      setSuggestions(mockSuggestions)
    }
  }, [user, mockSuggestions])

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites

    if (selectedArea !== 'all') {
      filtered = filtered.filter(course => course.area === selectedArea)
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded)
        case 'difficulty':
          return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
        case 'duration':
          return a.duration - b.duration
        case 'area':
          return a.area.localeCompare(b.area)
        case 'popularity':
          return Math.random() - 0.5
        default:
          return 0
      }
    })

    return sorted
  }, [favorites, selectedArea, sortBy])

  const stats = useMemo(() => {
    const total = favorites.length
    const byArea = AREAS.slice(1).reduce((acc, area) => {
      acc[area] = favorites.filter(course => course.area === area).length
      return acc
    }, {})

    return {
      total,
      programming: byArea.programming || 0,
      design: byArea.design || 0,
      marketing: byArea.marketing || 0,
      business: byArea.business || 0,
      dataScience: byArea['data-science'] || 0
    }
  }, [favorites])

  const handleRemoveFavorite = useCallback(async (courseId) => {
    try {
      if (user) {
        await apiService.delete(`/favorites/${courseId}`)
      }
      setFavorites(prev => prev.filter(course => course.id !== courseId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }, [user])

  const handleAddSuggestion = useCallback(async (suggestion) => {
    try {
      const newFavorite = {
        ...suggestion,
        description: `Curso recomendado de ${suggestion.area}`,
        difficulty: 'Intermedio',
        duration: 20,
        dateAdded: new Date().toISOString().split('T')[0],
        isEnrolled: false
      }

      if (user) {
        await apiService.post('/favorites', newFavorite)
      }
      setFavorites(prev => [...prev, newFavorite])
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    } catch (error) {
      console.error('Error adding suggestion to favorites:', error)
    }
  }, [user])

  const handleEnrollInCourse = useCallback(async (courseId) => {
    try {
      if (user) {
        await apiService.post(`/courses/${courseId}/enroll`)
      }
      setFavorites(prev => prev.map(course =>
        course.id === courseId ? { ...course, isEnrolled: true } : course
      ))
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }, [user])

  const handleEnrollInAll = useCallback(async () => {
    const unenrolledCourses = favorites.filter(course => !course.isEnrolled)

    try {
      if (user) {
        await Promise.all(
          unenrolledCourses.map(course =>
            apiService.post(`/courses/${course.id}/enroll`)
          )
        )
      }
      setFavorites(prev => prev.map(course => ({ ...course, isEnrolled: true })))
    } catch (error) {
      console.error('Error enrolling in all courses:', error)
    }
  }, [favorites, user])

  const handleDownloadList = useCallback(() => {
    const csvContent = [
      ['Título', 'Área', 'Dificultad', 'Duración', 'Instructor'],
      ...favorites.map(course => [
        course.title,
        MY_FAVORITES_MESSAGES.filters[course.area],
        course.difficulty,
        `${course.duration}h`,
        course.instructor
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mis-favoritos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [favorites])

  const handleShareList = useCallback(() => {
    const shareData = {
      title: 'Mis Cursos Favoritos',
      text: `Mira mis ${favorites.length} cursos favoritos en nuestra plataforma`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert('Enlace copiado al portapapeles')
    }
  }, [favorites.length])

  const handleClearAll = useCallback(async () => {
    if (confirm('¿Estás seguro de que quieres quitar todos los cursos de favoritos?')) {
      try {
        if (user) {
          await apiService.delete('/favorites/all')
        }
        setFavorites([])
      } catch (error) {
        console.error('Error clearing favorites:', error)
      }
    }
  }, [user])

  const navigateToExplore = useCallback(() => {
    window.location.href = '/courses'
  }, [])

  useEffect(() => {
    loadFavorites()
    loadSuggestions()
  }, [loadFavorites, loadSuggestions])

  return {
    favorites: filteredAndSortedFavorites,
    suggestions,
    selectedArea,
    sortBy,
    loading,
    stats,
    setSelectedArea,
    setSortBy,
    handleRemoveFavorite,
    handleAddSuggestion,
    handleEnrollInCourse,
    handleEnrollInAll,
    handleDownloadList,
    handleShareList,
    handleClearAll,
    navigateToExplore
  }
}