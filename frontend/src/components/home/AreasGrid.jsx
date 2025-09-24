import { HOME_STYLES, AREA_COLORS } from '../../constants/homeConstants.jsx'

const AreasGrid = ({ areas, onNavigateToArea }) => {
  return (
    <div className={HOME_STYLES.areas.grid}>
      {areas.map(area => (
        <div
          key={area.id}
          onClick={() => onNavigateToArea(area.id)}
          className={`${HOME_STYLES.areas.card} ${AREA_COLORS[area.id]}`}
        >
          <h3 className={HOME_STYLES.areas.cardTitle}>
            {area.name}
          </h3>
        </div>
      ))}
    </div>
  )
}

export default AreasGrid