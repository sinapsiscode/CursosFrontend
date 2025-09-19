import { VALIDATION_RULES, ERROR_MESSAGES, RATING_LABELS } from '../constants/reviewConstants'

export const validateReviewForm = (formData) => {
  const errors = {}

  if (formData.rating === 0) {
    errors.rating = ERROR_MESSAGES.rating
  }

  if (!formData.comment.trim()) {
    errors.comment = ERROR_MESSAGES.commentRequired
  } else if (formData.comment.trim().length < VALIDATION_RULES.minCommentLength) {
    errors.comment = ERROR_MESSAGES.commentTooShort
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

export const getRatingText = (rating) => {
  return RATING_LABELS[rating] || RATING_LABELS.default
}

export const createReviewData = (formData, course, user) => {
  return {
    courseId: course.id,
    userId: user.id,
    userName: user.name || user.email,
    rating: formData.rating,
    comment: formData.comment.trim()
  }
}

export const getCharacterCountColor = (length, minLength) => {
  return length < minLength ? 'text-red-400' : 'text-green-400'
}