import { LoadingSpinner, CourseCardSkeleton } from '../components/common'
import { useHome } from '../hooks/useHome'
import { HOME_STYLES, HOME_MESSAGES } from '../constants/homeConstants.jsx'
import HomeCarousel from '../components/home/HomeCarousel'
import AreasGrid from '../components/home/AreasGrid'
import CoursesGrid from '../components/home/CoursesGrid'
import SectionHeader from '../components/home/SectionHeader'
import ContinueCourseCard from '../components/home/ContinueCourseCard'

const Home = () => {
  const {
    featuredCourses,
    recommendedCourses,
    continueCourse,
    loading,
    currentSlide,
    carouselSlides,
    areas,
    isAuthenticated,
    nextSlide,
    prevSlide,
    goToSlide,
    navigateToArea,
    navigateToCourse,
    navigateToContinueCourse
  } = useHome()


  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={HOME_STYLES.container}>
      <div className={HOME_STYLES.maxWidth}>

        {/* Carousel */}
        {carouselSlides.length > 0 && (
          <HomeCarousel
            slides={carouselSlides}
            currentSlide={currentSlide}
            onNextSlide={nextSlide}
            onPrevSlide={prevSlide}
            onGoToSlide={goToSlide}
          />
        )}

        {/* Areas */}
        <div className={HOME_STYLES.section.container}>
          <SectionHeader
            title={HOME_MESSAGES.explore.title}
            subtitle={HOME_MESSAGES.explore.subtitle}
          />
          <AreasGrid
            areas={areas}
            onNavigateToArea={navigateToArea}
          />
        </div>

        {/* Continue Learning */}
        {isAuthenticated && continueCourse && (
          <div className={HOME_STYLES.section.container}>
            <SectionHeader
              title={HOME_MESSAGES.continueWithCourse.title}
              subtitle={HOME_MESSAGES.continueWithCourse.subtitle}
            />
            <ContinueCourseCard
              course={continueCourse}
              onNavigate={navigateToContinueCourse}
            />
          </div>
        )}

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className={HOME_STYLES.section.container}>
            <SectionHeader
              title={HOME_MESSAGES.featured.title}
              subtitle={HOME_MESSAGES.featured.subtitle}
            />
            <CoursesGrid
              courses={featuredCourses}
              onNavigateToCourse={navigateToCourse}
            />
          </div>
        )}

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div className={HOME_STYLES.section.container}>
            <SectionHeader
              title={HOME_MESSAGES.recommended.title}
              subtitle={HOME_MESSAGES.recommended.subtitle}
            />
            <CoursesGrid
              courses={recommendedCourses}
              onNavigateToCourse={navigateToCourse}
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default Home