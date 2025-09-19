import { EVENT_STYLES, EVENT_LABELS, ICON_PATHS } from '../../../constants/eventDetailConstants'

const EventResources = ({ event }) => {
  return (
    <div className={EVENT_STYLES.detailsRight}>
      <h3 className={EVENT_STYLES.resourcesTitle}>{EVENT_LABELS.resources}</h3>

      {event.pdfUrl && (
        <a
          href={event.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={EVENT_STYLES.resourceLink}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.pdf} />
          </svg>
          <span>{EVENT_LABELS.downloadPdf}</span>
        </a>
      )}

      {event.youtubeUrl && (
        <a
          href={event.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={EVENT_STYLES.resourceLink}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.video} />
          </svg>
          <span>{EVENT_LABELS.watchVideo}</span>
        </a>
      )}
    </div>
  )
}

export default EventResources