import { AREA_COLORS, LEVEL_COLORS, CARD_STYLES } from '../../../constants/courseConstants'
import { capitalizeFirst } from '../../../utils/courseUtils'

const CourseTags = ({ area, level }) => {
  return (
    <div className={CARD_STYLES.tagContainer}>
      {area && (
        <span className={`${AREA_COLORS[area]} ${CARD_STYLES.tag}`}>
          {capitalizeFirst(area)}
        </span>
      )}
      {level && (
        <span className={`${LEVEL_COLORS[level]} ${CARD_STYLES.tag}`}>
          {capitalizeFirst(level)}
        </span>
      )}
    </div>
  )
}

export default CourseTags