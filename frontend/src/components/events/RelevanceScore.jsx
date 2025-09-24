import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const RelevanceScore = ({ score }) => {
  return (
    <div className={EVENTS_STYLES.eventCard.relevanceScore}>
      <span>
        {EVENTS_MESSAGES.eventDetails.relevance} {Math.round(score)}%
      </span>
    </div>
  )
}

export default RelevanceScore