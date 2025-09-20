import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

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
  <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />

      <Route path="students">
        <Route index element={<StudentListPage />} />
        <Route path="create" element={<StudentCreatePage />} />
        <Route path="manager" element={<StudentManagerPage />} />
        <Route path="enrollments" element={<StudentEnrollmentsPage />} />
      </Route>

      <Route path="courses">
        <Route index element={<CourseListPage />} />
      </Route>

      <Route path="analytics">
        <Route index element={<OverviewPage />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="exports" element={<ExportsPage />} />
      </Route>

      <Route path="exams">
        <Route index element={<ExamListPage />} />
        <Route path="create" element={<ExamCreatePage />} />
        <Route path="config" element={<ExamConfigPage />} />
      </Route>

      <Route path="areas">
        <Route index element={<AreaListPage />} />
        <Route path="create" element={<AreaCreatePage />} />
      </Route>

      <Route path="coupons">
        <Route index element={<CouponListPage />} />
        <Route path="create" element={<CouponCreatePage />} />
      </Route>

      <Route path="whatsapp" element={<WhatsAppPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="events/management" element={<EventManagementPage />} />
      <Route path="photos" element={<PhotosPage />} />

      <Route path="enrollments" element={<EnrollmentCountersPage />} />
      <Route path="reviews" element={<ReviewModerationPage />} />
      <Route path="loyalty" element={<LoyaltyManagementPage />} />
    </Routes>
  </Suspense>
)

export default AdminRouter