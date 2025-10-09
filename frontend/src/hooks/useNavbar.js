import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuthStore, useUIStore } from '../store'
import { NAVBAR_ROUTES, NAVBAR_MODALS } from '../constants/navbarConstants.jsx'
import { isAdmin } from '../constants/roleIds'

export const useNavbar = () => {
  // Usar AuthContext como fuente principal de verdad
  const { usuario, isAuthenticated: authContextAuthenticated, logout: authContextLogout } = useAuth()
  const { selectedArea } = useAuthStore()
  const { searchQuery, setSearchQuery, openModal } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  // Mapear usuario del AuthContext al formato esperado por el Navbar
  const user = useMemo(() => {
    if (!usuario) return null

    return {
      id: usuario.id,
      name: usuario.nombre,
      email: usuario.email,
      avatar: usuario.avatar || usuario.foto,
      role: isAdmin(usuario.rolId) ? 'admin' : 'user',
      rolId: usuario.rolId
    }
  }, [usuario])

  const isAuthenticated = authContextAuthenticated

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
    authContextLogout()
    setShowUserMenu(false)
    navigate('/')
  }, [authContextLogout, navigate])

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