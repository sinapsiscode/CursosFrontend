import { CARD_STYLES, FAVORITE_MESSAGES } from '../../../constants/courseConstants'

const FavoriteButton = ({ onClick, isAuthenticated, isFavorite }) => {
  return (
    <button
      onClick={onClick}
      className={`${CARD_STYLES.favoriteButton} ${
        !isAuthenticated ? 'opacity-70' : ''
      }`}
      title={!isAuthenticated ? FAVORITE_MESSAGES.LOGIN_REQUIRED : ''}
    >
      {!isAuthenticated ? (
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ) : (
        <svg
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  )
}

export default FavoriteButton