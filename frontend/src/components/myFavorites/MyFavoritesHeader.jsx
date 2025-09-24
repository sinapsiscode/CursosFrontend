import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const MyFavoritesHeader = () => {
  return (
    <div className={MY_FAVORITES_STYLES.header.container}>
      <h1 className={MY_FAVORITES_STYLES.header.title}>
        {MY_FAVORITES_MESSAGES.title}
      </h1>
      <p className={MY_FAVORITES_STYLES.header.subtitle}>
        {MY_FAVORITES_MESSAGES.subtitle}
      </p>
    </div>
  )
}

export default MyFavoritesHeader