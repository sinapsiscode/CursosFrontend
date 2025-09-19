import { useReviewForm } from '../../hooks/useReviewForm'
import { FORM_STYLES } from '../../constants/reviewConstants'
import FormHeader from './ReviewForm/FormHeader'
import RatingStars from './ReviewForm/RatingStars'
import CommentField from './ReviewForm/CommentField'
import FormButtons from './ReviewForm/FormButtons'
import InfoFooter from './ReviewForm/InfoFooter'

const ReviewForm = ({ course, onClose, onSuccess }) => {
  const {
    formData,
    hoveredRating,
    errors,
    loading,
    handleSubmit,
    handleRatingClick,
    handleCommentChange,
    handleRatingHover,
    handleRatingLeave
  } = useReviewForm(course, onSuccess)

  return (
    <div className={FORM_STYLES.container}>
      <FormHeader courseTitle={course.title} />

      <form onSubmit={handleSubmit} className={FORM_STYLES.form}>
        <RatingStars
          rating={formData.rating}
          hoveredRating={hoveredRating}
          onRatingClick={handleRatingClick}
          onRatingHover={handleRatingHover}
          onRatingLeave={handleRatingLeave}
          error={errors.rating}
        />

        <CommentField
          value={formData.comment}
          onChange={handleCommentChange}
          error={errors.comment}
        />

        <FormButtons
          onCancel={onClose}
          isSubmitting={loading.submitting}
        />
      </form>

      <InfoFooter />
    </div>
  )
}

export default ReviewForm