import { CourseCardSkeleton } from '../common'
import {
  COURSE_EXPLORER_STYLES,
  COURSE_EXPLORER_CONFIG
} from '../../constants/courseExplorerConstants.jsx'

const LoadingState = () => {
  return (
    <div className={COURSE_EXPLORER_STYLES.loading.container}>
      <div className={COURSE_EXPLORER_STYLES.loading.wrapper}>
        <div className={COURSE_EXPLORER_STYLES.loading.headerSkeleton}></div>
        <div className={COURSE_EXPLORER_STYLES.loading.grid}>
          {[...Array(COURSE_EXPLORER_CONFIG.defaultSkeletonCount)].map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingState