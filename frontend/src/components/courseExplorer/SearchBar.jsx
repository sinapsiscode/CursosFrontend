import {
  COURSE_EXPLORER_STYLES,
  COURSE_EXPLORER_MESSAGES,
  COURSE_EXPLORER_ICONS
} from '../../constants/courseExplorerConstants.jsx'

const SearchBar = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className={COURSE_EXPLORER_STYLES.search.container}>
      <div className={COURSE_EXPLORER_STYLES.search.wrapper}>
        <div className={COURSE_EXPLORER_STYLES.search.iconWrapper}>
          {COURSE_EXPLORER_ICONS.search}
        </div>
        <input
          type="text"
          className={COURSE_EXPLORER_STYLES.search.input}
          placeholder={COURSE_EXPLORER_MESSAGES.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default SearchBar