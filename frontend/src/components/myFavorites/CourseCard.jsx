import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const CourseCard = ({ course, onRemoveFavorite, onEnrollInCourse }) => {
  const getLevelStyle = (difficulty) => {
    switch (difficulty) {
      case 'Principiante':
        return MY_FAVORITES_STYLES.courseCard.levelBeginner
      case 'Intermedio':
        return MY_FAVORITES_STYLES.courseCard.levelIntermediate
      case 'Avanzado':
        return MY_FAVORITES_STYLES.courseCard.levelAdvanced
      default:
        return MY_FAVORITES_STYLES.courseCard.levelBeginner
    }
  }

  return (
    <div className={MY_FAVORITES_STYLES.courseCard.container}>
      <div className={MY_FAVORITES_STYLES.courseCard.imageContainer}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className={MY_FAVORITES_STYLES.courseCard.image}
        />
        <button
          onClick={() => onRemoveFavorite(course.id)}
          className={MY_FAVORITES_STYLES.courseCard.favoriteButton}
          title={MY_FAVORITES_MESSAGES.actions.removeFavorite}
        >
          <svg
            className={`${MY_FAVORITES_STYLES.courseCard.favoriteIcon} ${MY_FAVORITES_STYLES.courseCard.favoriteIconFilled}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      <div className={MY_FAVORITES_STYLES.courseCard.content}>
        <div className={MY_FAVORITES_STYLES.courseCard.header}>
          <div className={MY_FAVORITES_STYLES.courseCard.titleContainer}>
            <h3 className={MY_FAVORITES_STYLES.courseCard.title}>
              {course.title}
            </h3>
            <span className={`${MY_FAVORITES_STYLES.courseCard.levelBadge} ${getLevelStyle(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
          <p className={MY_FAVORITES_STYLES.courseCard.description}>
            {course.description}
          </p>
        </div>

        <div className={MY_FAVORITES_STYLES.courseCard.meta}>
          <span className={MY_FAVORITES_STYLES.courseCard.area}>
            {MY_FAVORITES_MESSAGES.filters[course.area]}
          </span>
          <span className={MY_FAVORITES_STYLES.courseCard.duration}>
            {course.duration}h
          </span>
        </div>

        <div className={MY_FAVORITES_STYLES.courseCard.actions}>
          {course.isEnrolled ? (
            <a
              href={`/course/${course.id}`}
              className={MY_FAVORITES_STYLES.courseCard.continueButton}
            >
              {MY_FAVORITES_MESSAGES.actions.continueCourse}
            </a>
          ) : (
            <button
              onClick={() => onEnrollInCourse(course.id)}
              className={MY_FAVORITES_STYLES.courseCard.enrollButton}
            >
              {MY_FAVORITES_MESSAGES.actions.enrollNow}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard