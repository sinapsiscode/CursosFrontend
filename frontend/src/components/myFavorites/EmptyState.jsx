import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const EmptyState = ({ onExplore }) => {
  return (
    <div className={MY_FAVORITES_STYLES.empty.container}>
      <div className={MY_FAVORITES_STYLES.empty.icon}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <h3 className={MY_FAVORITES_STYLES.empty.title}>
        {MY_FAVORITES_MESSAGES.empty.title}
      </h3>
      <p className={MY_FAVORITES_STYLES.empty.subtitle}>
        {MY_FAVORITES_MESSAGES.empty.subtitle}
      </p>
      <button
        onClick={onExplore}
        className={MY_FAVORITES_STYLES.empty.button}
      >
        {MY_FAVORITES_MESSAGES.empty.exploreButton}
      </button>
    </div>
  )
}

export default EmptyState