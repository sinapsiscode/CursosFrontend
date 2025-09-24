import { COURSE_EXPLORER_STYLES, COURSE_EXPLORER_MESSAGES } from '../../constants/courseExplorerConstants.jsx'
import ViewModeToggle from './ViewModeToggle'

const ExplorerHeader = ({
  coursesCount,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className={COURSE_EXPLORER_STYLES.header.container}>
      <div>
        <h1 className={COURSE_EXPLORER_STYLES.header.title}>
          {COURSE_EXPLORER_MESSAGES.title}
        </h1>
        <p className={COURSE_EXPLORER_STYLES.header.subtitle}>
          {COURSE_EXPLORER_MESSAGES.subtitle.replace('{count}', coursesCount)}
        </p>
      </div>

      <ViewModeToggle
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
    </div>
  )
}

export default ExplorerHeader