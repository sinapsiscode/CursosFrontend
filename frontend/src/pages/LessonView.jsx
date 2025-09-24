import { LoadingSpinner } from '../components/common'
import VideoPlayer from '../components/courses/VideoPlayer'
import { useLessonView } from '../hooks/useLessonView'
import { LESSON_VIEW_STYLES } from '../constants/lessonViewConstants.jsx'
import LessonHeader from '../components/lessonView/LessonHeader'
import PremiumContent from '../components/lessonView/PremiumContent'
import LessonTabs from '../components/lessonView/LessonTabs'
import LessonSidebar from '../components/lessonView/LessonSidebar'

const LessonView = () => {
  const {
    course,
    lesson,
    loading,
    activeTab,
    courseId,
    lessonId,
    isAuthenticated,
    currentIndex,
    hasNext,
    hasPrevious,
    isPremiumContent,
    handleLessonComplete,
    handleNextLesson,
    handlePreviousLesson,
    navigateToLesson,
    navigateToCourse,
    handleTabChange
  } = useLessonView()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!lesson || isPremiumContent) {
    return <PremiumContent onNavigateToCourse={navigateToCourse} />
  }

  return (
    <div className={LESSON_VIEW_STYLES.container}>
      <div className={LESSON_VIEW_STYLES.maxWidth}>

        <LessonHeader
          lesson={lesson}
          course={course}
          currentIndex={currentIndex}
          onNavigateToCourse={navigateToCourse}
        />

        <div className={LESSON_VIEW_STYLES.layout.grid}>
          {/* Video Player - Main Column */}
          <div className={LESSON_VIEW_STYLES.layout.mainColumn}>
            <VideoPlayer
              course={course}
              lesson={lesson}
              onLessonComplete={handleLessonComplete}
              onNextLesson={handleNextLesson}
              onPreviousLesson={handlePreviousLesson}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />

            <LessonTabs
              lesson={lesson}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Sidebar - Lessons List */}
          <div className={LESSON_VIEW_STYLES.layout.sidebarColumn}>
            <LessonSidebar
              course={course}
              lessonId={lessonId}
              courseId={courseId}
              isAuthenticated={isAuthenticated}
              onNavigateToLesson={navigateToLesson}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default LessonView