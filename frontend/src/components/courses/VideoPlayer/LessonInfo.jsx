import { VIDEO_PLAYER_STYLES } from '../../../constants/videoPlayerConstants'

const LessonInfo = ({ lesson, course }) => {
  return (
    <div className={VIDEO_PLAYER_STYLES.lessonInfo}>
      <h3 className={VIDEO_PLAYER_STYLES.lessonTitle}>
        {lesson?.title}
      </h3>
      <p className={VIDEO_PLAYER_STYLES.courseTitle}>
        {course?.title}
      </p>
    </div>
  )
}

export default LessonInfo