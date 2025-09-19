import { SKELETON_STYLES } from '../../../constants/uiConstants'

const CourseCardSkeleton = () => {
  const { courseCard } = SKELETON_STYLES

  return (
    <div className={courseCard.container}>
      <div className={courseCard.image}></div>
      <div className={courseCard.content}>
        <div className={courseCard.title}></div>
        <div className={courseCard.instructor}></div>
        <div className={courseCard.tagContainer}>
          <div className={courseCard.tag1}></div>
          <div className={courseCard.tag2}></div>
        </div>
        <div className={courseCard.bottomContainer}>
          <div className={courseCard.rating}></div>
          <div className={courseCard.price}></div>
        </div>
      </div>
    </div>
  )
}

export default CourseCardSkeleton