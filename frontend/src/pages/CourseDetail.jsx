import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingSpinner } from '../components/common'
import { useCourseDetail } from '../hooks/useCourseDetail'
import { COURSE_DETAIL_CONFIG } from '../constants/courseDetailConstants'
import CourseHeader from '../components/courseDetail/CourseHeader'
import CourseTabs from '../components/courseDetail/CourseTabs'
import CourseTabContent from '../components/courseDetail/CourseTabContent'
import CourseModals from '../components/courseDetail/CourseModals'

const CourseDetail = () => {
  const { id } = useParams()
  const {
    course,
    loading,
    courseExam,
    isUserEnrolled,
    isFavorite,
    safeProgress,
    courseReviewStats,
    reviews,
    handleLessonClick,
    handleFavoriteToggle,
    reloadCourseReviews,
    updateEnrollmentStatus,
    formatDuration,
    canReview,
    navigate,
    isAuthenticated,
    user
  } = useCourseDetail(id)

  const [activeTab, setActiveTab] = useState('temario')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showExamInfo, setShowExamInfo] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)

  const onLessonClick = (lesson) => {
    const success = handleLessonClick(lesson)
    if (!success) {
      setShowSubscriptionModal(true)
    }
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    setShowThankYouModal(true)
    reloadCourseReviews()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{COURSE_DETAIL_CONFIG.messages.courseNotFound}</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
          >
            {COURSE_DETAIL_CONFIG.messages.backToCourses}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseHeader
        course={course}
        isFavorite={isFavorite}
        safeProgress={safeProgress}
        isAuthenticated={isAuthenticated}
        isUserEnrolled={isUserEnrolled}
        courseExam={courseExam}
        formatDuration={formatDuration}
        handleFavoriteToggle={handleFavoriteToggle}
        onEnrollSuccess={updateEnrollmentStatus}
        onShowExamInfo={() => setShowExamInfo(true)}
        navigate={navigate}
      />

      <CourseTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        course={course}
      />

      <CourseTabContent
        activeTab={activeTab}
        course={course}
        safeProgress={safeProgress}
        isAuthenticated={isAuthenticated}
        isUserEnrolled={isUserEnrolled}
        user={user}
        courseReviewStats={courseReviewStats}
        reviews={reviews}
        formatDuration={formatDuration}
        onLessonClick={onLessonClick}
        navigate={navigate}
        canReview={canReview}
        onShowReviewForm={() => setShowReviewForm(true)}
      />

      <CourseModals
        course={course}
        courseExam={courseExam}
        navigate={navigate}
        showSubscriptionModal={showSubscriptionModal}
        setShowSubscriptionModal={setShowSubscriptionModal}
        showExamInfo={showExamInfo}
        setShowExamInfo={setShowExamInfo}
        showReviewForm={showReviewForm}
        setShowReviewForm={setShowReviewForm}
        showThankYouModal={showThankYouModal}
        setShowThankYouModal={setShowThankYouModal}
        handleReviewSuccess={handleReviewSuccess}
      />
    </div>
  )
}

export default CourseDetail