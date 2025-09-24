import { NAVBAR_STYLES, NAVBAR_TEXTS, NAVBAR_ICONS } from '../../../constants/navbarConstants.jsx'

const NavbarSearch = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <div className={NAVBAR_STYLES.searchContainer}>
      <form onSubmit={onSearch} className={NAVBAR_STYLES.searchForm}>
        <div className={NAVBAR_STYLES.searchInputContainer}>
          <div className={NAVBAR_STYLES.searchIcon}>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {NAVBAR_ICONS.search}
            </svg>
          </div>
          <input
            type="text"
            className={NAVBAR_STYLES.searchInput}
            placeholder={NAVBAR_TEXTS.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  )
}

export default NavbarSearch