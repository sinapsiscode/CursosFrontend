import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../store'
import { NAVBAR_ROUTES, NAVBAR_MODALS } from '../constants/navbarConstants.jsx'

export const useNavbar = () => {
  const { user, isAuthenticated, selectedArea, logout } = useAuthStore()
  const { searchQuery, setSearchQuery, openModal } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleSearch = useCallback((e) => {
    e.preventDefault()
  }, [])

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev)
  }, [])

  const closeUserMenu = useCallback(() => {
    setShowUserMenu(false)
  }, [])

  const navigateAndClose = useCallback((route) => {
    navigate(route)
    setShowUserMenu(false)
  }, [navigate])

  const handleLogout = useCallback(() => {
    logout()
    setShowUserMenu(false)
  }, [logout])

  const handleLogin = useCallback(() => {
    openModal(NAVBAR_MODALS.login)
  }, [openModal])

  const handleRegister = useCallback(() => {
    openModal(NAVBAR_MODALS.register)
  }, [openModal])

  return {
    user,
    isAuthenticated,
    selectedArea,
    searchQuery,
    showUserMenu,
    setSearchQuery,
    handleSearch,
    toggleUserMenu,
    closeUserMenu,
    navigateAndClose,
    handleLogout,
    handleLogin,
    handleRegister
  }
}

export const useUserMenuActions = (navigateAndClose, handleLogout) => {
  const menuActions = {
    profile: () => navigateAndClose(NAVBAR_ROUTES.profile),
    courses: () => navigateAndClose(NAVBAR_ROUTES.courses),
    certificates: () => navigateAndClose(NAVBAR_ROUTES.certificates),
    loyalty: () => navigateAndClose(NAVBAR_ROUTES.loyalty),
    admin: () => navigateAndClose(NAVBAR_ROUTES.admin),
    logout: handleLogout
  }

  return menuActions
}