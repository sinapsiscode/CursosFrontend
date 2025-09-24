import { MY_FAVORITES_STYLES, MY_FAVORITES_MESSAGES } from '../../constants/myFavoritesConstants.jsx'

const QuickActions = ({
  onEnrollInAll,
  onDownloadList,
  onShareList,
  onClearAll,
  favoritesCount
}) => {
  if (favoritesCount === 0) return null

  return (
    <div className={MY_FAVORITES_STYLES.quickActions.container}>
      <h3 className={MY_FAVORITES_STYLES.quickActions.title}>
        {MY_FAVORITES_MESSAGES.quickActions.title}
      </h3>
      <div className={MY_FAVORITES_STYLES.quickActions.grid}>
        <button
          onClick={onEnrollInAll}
          className={MY_FAVORITES_STYLES.quickActions.button}
        >
          <svg className={MY_FAVORITES_STYLES.quickActions.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className={MY_FAVORITES_STYLES.quickActions.label}>
            {MY_FAVORITES_MESSAGES.quickActions.enrollInAll}
          </span>
        </button>

        <button
          onClick={onDownloadList}
          className={MY_FAVORITES_STYLES.quickActions.button}
        >
          <svg className={MY_FAVORITES_STYLES.quickActions.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <span className={MY_FAVORITES_STYLES.quickActions.label}>
            {MY_FAVORITES_MESSAGES.quickActions.downloadList}
          </span>
        </button>

        <button
          onClick={onShareList}
          className={MY_FAVORITES_STYLES.quickActions.button}
        >
          <svg className={MY_FAVORITES_STYLES.quickActions.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className={MY_FAVORITES_STYLES.quickActions.label}>
            {MY_FAVORITES_MESSAGES.quickActions.shareList}
          </span>
        </button>

        <button
          onClick={onClearAll}
          className={MY_FAVORITES_STYLES.quickActions.button}
        >
          <svg className={MY_FAVORITES_STYLES.quickActions.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className={MY_FAVORITES_STYLES.quickActions.label}>
            {MY_FAVORITES_MESSAGES.quickActions.clearAll}
          </span>
        </button>
      </div>
    </div>
  )
}

export default QuickActions