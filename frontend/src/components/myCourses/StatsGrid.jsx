import { MY_COURSES_STYLES, MY_COURSES_MESSAGES } from '../../constants/myCoursesConstants.jsx'

const StatsGrid = ({ stats }) => {
  return (
    <div className={MY_COURSES_STYLES.stats.grid}>
      <div className={MY_COURSES_STYLES.stats.card}>
        <div className={`${MY_COURSES_STYLES.stats.number} ${MY_COURSES_STYLES.stats.totalColor}`}>
          {stats.total}
        </div>
        <div className={MY_COURSES_STYLES.stats.label}>
          {MY_COURSES_MESSAGES.stats.total}
        </div>
      </div>

      <div className={MY_COURSES_STYLES.stats.card}>
        <div className={`${MY_COURSES_STYLES.stats.number} ${MY_COURSES_STYLES.stats.completedColor}`}>
          {stats.completed}
        </div>
        <div className={MY_COURSES_STYLES.stats.label}>
          {MY_COURSES_MESSAGES.stats.completed}
        </div>
      </div>

      <div className={MY_COURSES_STYLES.stats.card}>
        <div className={`${MY_COURSES_STYLES.stats.number} ${MY_COURSES_STYLES.stats.inProgressColor}`}>
          {stats.inProgress}
        </div>
        <div className={MY_COURSES_STYLES.stats.label}>
          {MY_COURSES_MESSAGES.stats.inProgress}
        </div>
      </div>

      <div className={MY_COURSES_STYLES.stats.card}>
        <div className={`${MY_COURSES_STYLES.stats.number} ${MY_COURSES_STYLES.stats.averageColor}`}>
          {stats.averageProgress}%
        </div>
        <div className={MY_COURSES_STYLES.stats.label}>
          {MY_COURSES_MESSAGES.stats.averageProgress}
        </div>
      </div>
    </div>
  )
}

export default StatsGrid