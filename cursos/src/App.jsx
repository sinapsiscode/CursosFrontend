import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, useUIStore } from './store'
import { 
  GUEST_ROUTES, 
  USER_ROUTES, 
  ADMIN_ROUTES, 
  isProtectedRoute, 
  isAdminRoute, 
  requiresAreaSelection 
} from './config/routes'

// Layout components (crearemos después)
import GuestLayout from './components/layout/GuestLayout'
import UserLayout from './components/layout/UserLayout' 
import AdminLayout from './components/layout/AdminLayout'

// Pages - Guest
import AreaSelection from './pages/guest/AreaSelection'
import Home from './pages/guest/Home'
import CourseExplorer from './pages/guest/CourseExplorer'
import ExamInitial from './pages/guest/ExamInitial'
import CertificateVerify from './pages/guest/CertificateVerify'

// Pages - Public
import HomePage from './pages/public/HomePage'
import CourseDetail from './pages/public/CourseDetail'
import CourseCatalog from './pages/public/CourseCatalog'
import InitialExamLanding from './pages/public/InitialExamLanding'

// Pages - Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Pages - User  
import Dashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import MyCourses from './pages/user/MyCourses'
import Favorites from './pages/user/Favorites'
import Certificates from './pages/user/Certificates'
import LoyaltyProgram from './pages/user/LoyaltyProgram'
import Events from './pages/user/Events'
import LessonView from './pages/user/LessonView'
import CourseExam from './pages/user/CourseExam'

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard'
import AreaManager from './pages/admin/AreaManager'
import CourseManager from './pages/admin/CourseManager'
import LeadManager from './pages/admin/LeadManager'
import ReviewManager from './pages/admin/ReviewManager'
import ConfigManager from './pages/admin/ConfigManager'
import WhatsAppManager from './pages/admin/WhatsAppManager'
import SystemCheck from './pages/admin/SystemCheck'

/**
 * Route Guard Component
 */
const RouteGuard = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isAdmin, needsAreaSelection } = useAuthStore()
  const pathname = location.pathname

  // Redirect to area selection if needed
  if (needsAreaSelection() && requiresAreaSelection(pathname)) {
    return <Navigate to={GUEST_ROUTES.AREA_SELECTION} replace />
  }

  // Protect authenticated routes
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return <Navigate to={GUEST_ROUTES.HOME} replace />
  }

  // Protect admin routes
  if (isAdminRoute(pathname) && !isAdmin()) {
    return <Navigate to={GUEST_ROUTES.HOME} replace />
  }

  return children
}

/**
 * Layout Wrapper - Determina qué layout usar basado en la ruta
 */
const LayoutWrapper = ({ children }) => {
  const location = useLocation()
  const pathname = location.pathname

  // Admin layout
  if (pathname.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>
  }

  // User layout (authenticated routes)
  if (isProtectedRoute(pathname)) {
    return <UserLayout>{children}</UserLayout>
  }

  // Guest layout (public routes)
  return <GuestLayout>{children}</GuestLayout>
}

/**
 * Main App Component
 */
function App() {
  const { user, isAuthenticated } = useAuthStore()
  const { showError } = useUIStore()

  // Initialize app on mount
  useEffect(() => {
    // Aquí podrías inicializar configuraciones, verificar token, etc.
    console.log('🚀 App initialized')
  }, [])

  // Global error boundary
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error)
      showError('Ha ocurrido un error inesperado')
    }

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      showError('Error de conexión')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [showError])

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="app min-h-screen bg-background">
        <RouteGuard>
          <LayoutWrapper>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Guest Routes */}
              <Route path={GUEST_ROUTES.AREA_SELECTION} element={<AreaSelection />} />
              <Route path={GUEST_ROUTES.HOME} element={<HomePage />} />
              <Route path={GUEST_ROUTES.COURSE_EXPLORER} element={<CourseCatalog />} />
              <Route path={GUEST_ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
              <Route path={GUEST_ROUTES.EXAM_INITIAL} element={<InitialExamLanding />} />
              <Route path={GUEST_ROUTES.CERTIFICATE_VERIFY} element={<CertificateVerify />} />

              {/* User Routes */}
              <Route path={USER_ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={USER_ROUTES.PROFILE} element={<Profile />} />
              <Route path={USER_ROUTES.MY_COURSES} element={<MyCourses />} />
              <Route path={USER_ROUTES.FAVORITES} element={<Favorites />} />
              <Route path={USER_ROUTES.CERTIFICATES} element={<Certificates />} />
              <Route path={USER_ROUTES.LOYALTY} element={<LoyaltyProgram />} />
              <Route path={USER_ROUTES.EVENTS} element={<Events />} />
              <Route path={USER_ROUTES.EVENT_DETAIL} element={<Events />} />
              <Route path={USER_ROUTES.COURSE_LESSON} element={<LessonView />} />
              <Route path={USER_ROUTES.COURSE_EXAM} element={<CourseExam />} />

              {/* Admin Routes */}
              <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
              <Route path={ADMIN_ROUTES.CONTENT_MANAGER} element={<AreaManager />} />
              <Route path={ADMIN_ROUTES.COURSE_MANAGER} element={<CourseManager />} />
              <Route path={ADMIN_ROUTES.LEAD_MANAGER} element={<LeadManager />} />
              <Route path={ADMIN_ROUTES.REVIEW_MANAGER} element={<ReviewManager />} />
              <Route path={ADMIN_ROUTES.CONFIG_MANAGER} element={<ConfigManager />} />
              <Route path="/admin/whatsapp" element={<WhatsAppManager />} />
              <Route path="/admin/system" element={<SystemCheck />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to={GUEST_ROUTES.HOME} replace />} />
            </Routes>
          </LayoutWrapper>
        </RouteGuard>
      </div>
    </Router>
  )
}

export default App