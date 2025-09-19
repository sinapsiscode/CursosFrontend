import { COURSE_VARIANTS, CARD_STYLES } from '../../constants/courseConstants'
import { useCourseCard } from '../../hooks/useCourseCard'
import CourseImage from './CourseCard/CourseImage'
import CourseContent from './CourseCard/CourseContent'

const CourseCard = ({ course, variant = 'medium', showProgress = false }) => {
  const {
    imageLoaded,
    isFavorite,
    progress,
    isAuthenticated,
    handleCardClick,
    handleFavoriteClick,
    handleImageLoad,
    handleImageError
  } = useCourseCard(course)

  return (
    <div className={`${COURSE_VARIANTS[variant]} ${CARD_STYLES.container}`}>
      <div onClick={handleCardClick}>
        <CourseImage
          course={course}
          imageLoaded={imageLoaded}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
          onFavoriteClick={handleFavoriteClick}
          isAuthenticated={isAuthenticated}
          isFavorite={isFavorite}
        />

        <CourseContent
          course={course}
          showProgress={showProgress}
          progress={progress}
        />
      </div>
    </div>
  )
}

export default CourseCard