import { HOME_STYLES } from '../../constants/homeConstants.jsx'

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className={HOME_STYLES.section.header}>
      <h2 className={HOME_STYLES.section.title}>
        {title}
      </h2>
      {subtitle && (
        <p className={HOME_STYLES.section.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeader