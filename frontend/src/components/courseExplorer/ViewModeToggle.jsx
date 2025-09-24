import {
  COURSE_EXPLORER_STYLES,
  COURSE_EXPLORER_ICONS,
  VIEW_MODES
} from '../../constants/courseExplorerConstants.jsx'

const ViewModeButton = ({
  mode,
  currentMode,
  onClick,
  icon
}) => {
  const isActive = currentMode === mode
  const buttonClass = isActive
    ? COURSE_EXPLORER_STYLES.viewButton.active
    : COURSE_EXPLORER_STYLES.viewButton.inactive

  return (
    <button
      onClick={() => onClick(mode)}
      className={buttonClass}
    >
      {icon}
    </button>
  )
}

const ViewModeToggle = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className={COURSE_EXPLORER_STYLES.header.viewToggle}>
      <ViewModeButton
        mode={VIEW_MODES.grid}
        currentMode={viewMode}
        onClick={onViewModeChange}
        icon={COURSE_EXPLORER_ICONS.gridView}
      />
      <ViewModeButton
        mode={VIEW_MODES.list}
        currentMode={viewMode}
        onClick={onViewModeChange}
        icon={COURSE_EXPLORER_ICONS.listView}
      />
    </div>
  )
}

export default ViewModeToggle