import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const SuggestionCard = ({ suggestion, onAddToFavorites }) => {
  return (
    <div className={MY_FAVORITES_STYLES.suggestionCard.container}>
      <div className={MY_FAVORITES_STYLES.suggestionCard.imageContainer}>
        <img
          src={suggestion.thumbnail}
          alt={suggestion.title}
          className={MY_FAVORITES_STYLES.suggestionCard.image}
        />
      </div>
      <div className={MY_FAVORITES_STYLES.suggestionCard.content}>
        <h4 className={MY_FAVORITES_STYLES.suggestionCard.title}>
          {suggestion.title}
        </h4>
        <p className={MY_FAVORITES_STYLES.suggestionCard.instructor}>
          {suggestion.instructor}
        </p>
        <div className={MY_FAVORITES_STYLES.suggestionCard.actions}>
          <button
            onClick={() => onAddToFavorites(suggestion)}
            className={MY_FAVORITES_STYLES.suggestionCard.addButton}
          >
            {MY_FAVORITES_MESSAGES.suggestion.addToFavorites}
          </button>
          <div className={MY_FAVORITES_STYLES.suggestionCard.rating}>
            <svg className={MY_FAVORITES_STYLES.suggestionCard.ratingIcon} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className={MY_FAVORITES_STYLES.suggestionCard.ratingText}>
              {suggestion.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuggestionCard