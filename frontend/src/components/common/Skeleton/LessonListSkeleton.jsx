import { SKELETON_STYLES, SKELETON_ITEM_COUNT } from '../../../constants/uiConstants'

const LessonListSkeleton = () => {
  const { lessonList } = SKELETON_STYLES

  return (
    <div className={lessonList.container}>
      {[...Array(SKELETON_ITEM_COUNT)].map((_, index) => (
        <div key={index} className={lessonList.item}>
          <div className={lessonList.icon}></div>
          <div className={lessonList.content}>
            <div className={lessonList.title}></div>
            <div className={lessonList.subtitle}></div>
          </div>
          <div className={lessonList.duration}></div>
        </div>
      ))}
    </div>
  )
}

export default LessonListSkeleton