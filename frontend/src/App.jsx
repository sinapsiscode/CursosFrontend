import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { useAuthStore, useUIStore } from './store'
import { sessionService } from './services/sessionService'
import { Navbar, TabBar, Toast } from './components/common'
import { LoginModal, RegisterModal } from './components/auth'
import Home from './pages/Home'
import AreaSelection from './pages/AreaSelection'
import CourseExplorer from './pages/CourseExplorer'
import CourseDetail from './pages/CourseDetail'
import CourseExam from './pages/CourseExam'
import LessonView from './pages/LessonView'
import LearningPaths from './pages/LearningPaths'
import Profile from './pages/Profile'
import MyCourses from './pages/MyCourses'
import MyFavorites from './pages/MyFavorites'
import Certificates from './pages/Certificates'
import CertificateVerify from './pages/CertificateVerify'
import AdminRouter from './pages/Admin/micro/AdminRouter'
import LoyaltyProgram from './pages/LoyaltyProgram'
import Events from './pages/Events'

function App() {
  const { isAuthenticated: authContextAuthenticated } = useAuth()
  const { selectedArea, isGuest } = useAuthStore()
  const { isModalOpen } = useUIStore()

  // Usar autenticación del AuthContext
  const isAuthenticated = authContextAuthenticated

  // Verificar si necesita seleccionar área
  const needsAreaSelection = !selectedArea && !isAuthenticated && !isGuest

  // Inicializar tracking de sesiones
  useEffect(() => {
    if (isAuthenticated) {
      sessionService.startTracking()
    } else {
      sessionService.stopTracking()
    }

    // Cleanup al desmontar
    return () => {
      sessionService.stopTracking()
    }
  }, [isAuthenticated])
  
  

  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="app min-h-screen bg-background">
        {/* Mostrar navegación solo si ya seleccionó área */}
        {!needsAreaSelection && (
          <>
            <Navbar />
            <TabBar />
          </>
        )}

        <main className={needsAreaSelection ? '' : 'pb-20 md:pb-0'}>
          <Routes>
            {/* Ruta de selección de área */}
            <Route 
              path="/area-selection" 
              element={<AreaSelection />} 
            />
            
            {/* Rutas principales */}
            <Route 
              path="/" 
              element={
                needsAreaSelection ? (
                  <Navigate to="/area-selection" replace />
                ) : (
                  <Home />
                )
              } 
            />
            
            {/* Rutas implementadas */}
            <Route path="/search" element={<CourseExplorer />} />
            <Route path="/courses" element={<CourseExplorer />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course/:courseId/exam/:examId" element={<CourseExam />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/favorites" element={<MyFavorites />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/certificate/verify/:verificationCode" element={<CertificateVerify />} />
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/loyalty" element={<LoyaltyProgram />} />
            <Route path="/profile/loyalty" element={<LoyaltyProgram />} />
            <Route path="/profile/rewards" element={<LoyaltyProgram />} />
            <Route path="/profile/rewards/:id" element={<LoyaltyProgram />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Events />} />
            <Route path="/promotions/:id" element={<Events />} />
            
            {/* Rutas pendientes */}
            <Route path="/downloads" element={<div className="p-8 text-white">Descargas - Próximamente</div>} />
            
            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Modals */}
        {isModalOpen('login') && <LoginModal />}
        {isModalOpen('register') && <RegisterModal />}
        

        {/* Toast Notifications */}
        <Toast />
      </div>
    </Router>
  )
}

export default App
