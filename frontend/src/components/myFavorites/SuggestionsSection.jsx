import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'
import SuggestionCard from './SuggestionCard'

const SuggestionsSection = ({ suggestions, onAddToFavorites }) => {
  if (suggestions.length === 0) return null

  return (
    <div className={MY_FAVORITES_STYLES.suggestions.container}>
      <h3 className={MY_FAVORITES_STYLES.suggestions.title}>
        {MY_FAVORITES_MESSAGES.suggestion.title}
      </h3>
      <p className={MY_FAVORITES_STYLES.suggestions.subtitle}>
        {MY_FAVORITES_MESSAGES.suggestion.subtitle}
      </p>
      <div className={MY_FAVORITES_STYLES.suggestions.grid}>
        {suggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAddToFavorites={onAddToFavorites}
          />
        ))}
      </div>
    </div>
  )
}

export default SuggestionsSection