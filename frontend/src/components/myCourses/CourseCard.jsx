import { MY_COURSES_STYLES, MY_COURSES_MESSAGES } from '../../constants/myCoursesConstants.jsx'

const CourseCard = ({
  course,
  getProgressColor,
  getProgressText,
  formatDuration,
  onContinueCourse,
  onDownloadCertificate
}) => {
  return (
    <div className={MY_COURSES_STYLES.courseCard.container}>
      {/* Course Image */}
      <div className={MY_COURSES_STYLES.courseCard.imageContainer}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className={MY_COURSES_STYLES.courseCard.image}
        />
        {course.isFavorite && (
          <div className={MY_COURSES_STYLES.courseCard.favoriteIcon}>
            <svg className={MY_COURSES_STYLES.courseCard.icon} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
        {course.progress.percentage >= 100 && (
          <div className={MY_COURSES_STYLES.courseCard.completedIcon}>
            <svg className={MY_COURSES_STYLES.courseCard.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className={MY_COURSES_STYLES.courseCard.content}>
        {/* Header */}
        <div className={MY_COURSES_STYLES.courseCard.header}>
          <div className={MY_COURSES_STYLES.courseCard.headerTop}>
            <span className={MY_COURSES_STYLES.courseCard.levelBadge}>
              {course.level.toUpperCase()}
            </span>
            <span className={MY_COURSES_STYLES.courseCard.duration}>
              {formatDuration(course.duration)}
            </span>
          </div>
          <h3 className={MY_COURSES_STYLES.courseCard.title}>
            {course.title}
          </h3>
          <p className={MY_COURSES_STYLES.courseCard.description}>
            {course.description}
          </p>
          <p className={MY_COURSES_STYLES.courseCard.instructor}>
            {MY_COURSES_MESSAGES.labels.instructor} {course.instructor}
          </p>
        </div>

        {/* Progress */}
        <div className={MY_COURSES_STYLES.courseCard.progressSection}>
          <div className={MY_COURSES_STYLES.courseCard.progressHeader}>
            <span className={MY_COURSES_STYLES.courseCard.progressText}>
              {getProgressText(course.progress.percentage)}
            </span>
            <span className={MY_COURSES_STYLES.courseCard.progressPercentage}>
              {course.progress.percentage}%
            </span>
          </div>
          <div className={MY_COURSES_STYLES.courseCard.progressBar}>
            <div
              className={`${MY_COURSES_STYLES.courseCard.progressFill} ${getProgressColor(course.progress.percentage)}`}
              style={{ width: `${course.progress.percentage}%` }}
            ></div>
          </div>
          {course.progress.timeSpent > 0 && (
            <p className={MY_COURSES_STYLES.courseCard.timeSpent}>
              {MY_COURSES_MESSAGES.labels.timeSpent} {formatDuration(course.progress.timeSpent)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className={MY_COURSES_STYLES.courseCard.actions}>
          <button
            onClick={() => onContinueCourse(course)}
            className={MY_COURSES_STYLES.courseCard.continueButton}
          >
            {course.progress.percentage === 0
              ? MY_COURSES_MESSAGES.actions.start
              : MY_COURSES_MESSAGES.actions.continue
            }
          </button>

          {course.progress.percentage >= 100 && (
            <button
              onClick={() => onDownloadCertificate(course)}
              className={MY_COURSES_STYLES.courseCard.certificateButton}
              title={MY_COURSES_MESSAGES.actions.downloadCertificate}
            >
              <svg className={MY_COURSES_STYLES.courseCard.certificateIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard