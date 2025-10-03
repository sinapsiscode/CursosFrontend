import { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser()

        if (currentUser) {
          setUsuario(currentUser)
          setIsAuthenticated(true)
          console.log('👤 Usuario cargado:', currentUser.nombre)
        } else {
          setUsuario(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error cargando usuario:', error)
        setUsuario(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Escuchar eventos de autenticación
  useEffect(() => {
    const handleLogout = () => {
      setUsuario(null)
      setIsAuthenticated(false)
      console.log('🔓 Usuario deslogueado')
    }

    const handleUnauthorized = () => {
      handleLogout()
      // Podrías redirigir a login aquí
      console.warn('🚫 Acceso no autorizado - redirigiendo a login')
    }

    window.addEventListener('auth:logout', handleLogout)
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:logout', handleLogout)
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  /**
   * Iniciar sesión
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const result = await authService.login(email, password)

      if (result.success && result.usuario) {
        setUsuario(result.usuario)
        setIsAuthenticated(true)
        console.log('✅ Login exitoso')
        return { success: true, usuario: result.usuario }
      }

      throw new Error('Login falló')
    } catch (error) {
      console.error('❌ Error en login:', error)
      setUsuario(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cerrar sesión
   */
  const logout = () => {
    authService.logout()
    setUsuario(null)
    setIsAuthenticated(false)
  }

  /**
   * Verificar si tiene un permiso específico
   */
  const hasPermission = (permiso) => {
    if (!usuario || !usuario.permisos) {
      return false
    }
    return usuario.permisos.includes(permiso)
  }

  /**
   * Verificar si tiene alguno de los permisos
   */
  const hasAnyPermission = (permisos = []) => {
    if (!usuario || !usuario.permisos) {
      return false
    }
    return permisos.some(permiso => usuario.permisos.includes(permiso))
  }

  /**
   * Verificar si tiene todos los permisos
   */
  const hasAllPermissions = (permisos = []) => {
    if (!usuario || !usuario.permisos) {
      return false
    }
    return permisos.every(permiso => usuario.permisos.includes(permiso))
  }

  /**
   * Verificar si tiene un rol específico
   */
  const hasRole = (rolId) => {
    return usuario && usuario.rolId === rolId
  }

  /**
   * Actualizar datos del usuario localmente
   */
  const updateUser = (updates) => {
    if (authService.updateLocalUser(updates)) {
      setUsuario(prev => ({ ...prev, ...updates }))
      return true
    }
    return false
  }

  /**
   * Refrescar usuario desde localStorage
   */
  const refreshUser = () => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUsuario(currentUser)
      setIsAuthenticated(true)
    } else {
      setUsuario(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    // Estado
    usuario,
    isLoading,
    isAuthenticated,

    // Acciones
    login,
    logout,
    updateUser,
    refreshUser,

    // Permisos y roles
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,

    // Helpers
    rol: usuario?.rol || null,
    rolId: usuario?.rolId || null,
    permisos: usuario?.permisos || [],
    nombre: usuario?.nombre || null,
    email: usuario?.email || null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }

  return context
}

export default AuthContext
