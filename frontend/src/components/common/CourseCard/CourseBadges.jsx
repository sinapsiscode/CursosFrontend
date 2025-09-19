import { COURSE_BADGES, BADGE_BASE_STYLES, CARD_STYLES } from '../../../constants/courseConstants'

const CourseBadges = ({ course }) => {
  const badges = []

  if (course.isNew) {
    badges.push({
      key: 'new',
      text: COURSE_BADGES.NEW.text,
      className: COURSE_BADGES.NEW.className
    })
  }

  if (course.price === 0) {
    badges.push({
      key: 'free',
      text: COURSE_BADGES.FREE.text,
      className: COURSE_BADGES.FREE.className
    })
  }

  if (course.popular) {
    badges.push({
      key: 'popular',
      text: COURSE_BADGES.POPULAR.text,
      className: COURSE_BADGES.POPULAR.className
    })
  }

  if (badges.length === 0) return null

  return (
    <div className={CARD_STYLES.badgeContainer}>
      {badges.map(badge => (
        <span
          key={badge.key}
          className={`${BADGE_BASE_STYLES} ${badge.className}`}
        >
          {badge.text}
        </span>
      ))}
    </div>
  )
}

export default CourseBadges