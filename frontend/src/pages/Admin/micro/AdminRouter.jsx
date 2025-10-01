import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../../../components/Admin/Layout/AdminLayout'

// Lazy load todas las páginas atómicas
const DashboardPage = lazy(() => import('./DashboardPage'))

// Students
const StudentListPage = lazy(() => import('./Students/StudentListPage'))
const StudentCreatePage = lazy(() => import('./Students/StudentCreatePage'))
const StudentManagerPage = lazy(() => import('./Students/StudentManagerPage'))

// Courses
const CourseListPage = lazy(() => import('./Courses/CourseListPage'))

// Analytics
const OverviewPage = lazy(() => import('./Analytics/OverviewPage'))
const ReportsPage = lazy(() => import('./Analytics/ReportsPage'))
const ExportsPage = lazy(() => import('./Analytics/ExportsPage'))

// Exams
const ExamListPage = lazy(() => import('./Exams/ExamListPage'))
const ExamCreatePage = lazy(() => import('./Exams/ExamCreatePage'))
const ExamConfigPage = lazy(() => import('./Exams/ExamConfigPage'))
const ExamManagementPage = lazy(() => import('./Exams/ExamManagementPage'))

// Areas
const AreaListPage = lazy(() => import('./Areas/AreaListPage'))
const AreaCreatePage = lazy(() => import('./Areas/AreaCreatePage'))

// Coupons
const CouponListPage = lazy(() => import('./Coupons/CouponListPage'))
const CouponCreatePage = lazy(() => import('./Coupons/CouponCreatePage'))

// System
const WhatsAppPage = lazy(() => import('./System/WhatsAppPage'))
const NotificationsPage = lazy(() => import('./System/NotificationsPage'))
const EventsPage = lazy(() => import('./System/EventsPage'))
const EventDetailsPage = lazy(() => import('./System/EventDetailsPage'))
const EventManagementPage = lazy(() => import('./System/EventManagementPage'))
const PhotosPage = lazy(() => import('./System/PhotosPage'))

// Enrollments
const EnrollmentCountersPage = lazy(() => import('./Enrollments/EnrollmentCountersPage'))

// Reviews
const ReviewModerationPage = lazy(() => import('./Reviews/ReviewModerationPage'))

// Loyalty
const LoyaltyManagementPage = lazy(() => import('./Loyalty/LoyaltyManagementPage'))

// Student Enrollments
const StudentEnrollmentsPage = lazy(() => import('./Students/StudentEnrollmentsPage'))

const AdminRouter = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route
        path="dashboard"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <DashboardPage />
          </Suspense>
        }
      />

      <Route path="students">
        <Route
          index
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <StudentListPage />
            </Suspense>
          }
        />
        <Route
          path="create"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <StudentCreatePage />
            </Suspense>
          }
        />
        <Route
          path="manager"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <StudentManagerPage />
            </Suspense>
          }
        />
        <Route
          path="enrollments"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <StudentEnrollmentsPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="courses">
        <Route
          index
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <CourseListPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="analytics">
        <Route
          index
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <OverviewPage />
            </Suspense>
          }
        />
        <Route
          path="overview"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <OverviewPage />
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <ReportsPage />
            </Suspense>
          }
        />
        <Route
          path="exports"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <ExportsPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="exams">
        <Route
          index
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <ExamListPage />
            </Suspense>
          }
        />
        <Route
          path="create"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <ExamCreatePage />
            </Suspense>
          }
        />
        <Route
          path="config"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <ExamConfigPage />
            </Suspense>
          }
        />
        <Route
          path="management"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <ExamManagementPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="areas">
        <Route
          index
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <AreaListPage />
            </Suspense>
          }
        />
        <Route
          path="create"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <AreaCreatePage />
            </Suspense>
          }
        />
      </Route>

      <Route path="coupons">
        <Route
          index
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <CouponListPage />
            </Suspense>
          }
        />
        <Route
          path="create"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
              <CouponCreatePage />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="whatsapp"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <WhatsAppPage />
          </Suspense>
        }
      />
      <Route
        path="notifications"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <NotificationsPage />
          </Suspense>
        }
      />
      <Route
        path="events"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <EventsPage />
          </Suspense>
        }
      />
      <Route
        path="events/:id"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <EventDetailsPage />
          </Suspense>
        }
      />
      <Route
        path="events/management"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <EventManagementPage />
          </Suspense>
        }
      />
      <Route
        path="photos"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <PhotosPage />
          </Suspense>
        }
      />

      <Route
        path="enrollments"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <EnrollmentCountersPage />
          </Suspense>
        }
      />
      <Route
        path="reviews"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <ReviewModerationPage />
          </Suspense>
        }
      />
      <Route
        path="loyalty"
        element={
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <LoyaltyManagementPage />
          </Suspense>
        }
      />
    </Route>
  </Routes>
)

export default AdminRouter