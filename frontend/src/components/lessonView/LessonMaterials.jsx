import { MATERIAL_TYPES, LESSON_VIEW_STYLES, LESSON_VIEW_MESSAGES } from '../../constants/lessonViewConstants.jsx'

const LessonMaterials = ({ lesson }) => {
  const getMaterialIcon = (type) => {
    return MATERIAL_TYPES[type]?.color || MATERIAL_TYPES.default.color
  }

  if (!lesson.materials || lesson.materials.length === 0) {
    return (
      <p className={LESSON_VIEW_STYLES.materials.empty}>
        {LESSON_VIEW_MESSAGES.tabs.materials.empty}
      </p>
    )
  }

  return (
    <div className={LESSON_VIEW_STYLES.materials.list}>
      {lesson.materials.map((material, index) => (
        <a
          key={index}
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className={LESSON_VIEW_STYLES.materials.item}
        >
          <div className={LESSON_VIEW_STYLES.materials.itemLeft}>
            <div className={`${LESSON_VIEW_STYLES.materials.icon} ${getMaterialIcon(material.type)}`}>
              <svg className={LESSON_VIEW_STYLES.materials.iconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className={LESSON_VIEW_STYLES.materials.info}>
              <p className={LESSON_VIEW_STYLES.materials.name}>
                {material.name}
              </p>
              <p className={LESSON_VIEW_STYLES.materials.type}>
                {material.type}
              </p>
            </div>
          </div>
          <span className={LESSON_VIEW_STYLES.materials.download}>
            <span className={LESSON_VIEW_STYLES.materials.downloadText}>
              {LESSON_VIEW_MESSAGES.tabs.materials.download}
            </span>
            <svg className={LESSON_VIEW_STYLES.materials.downloadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
        </a>
      ))}
    </div>
  )
}

export default LessonMaterials