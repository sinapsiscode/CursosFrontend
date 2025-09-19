import { useState } from 'react'
import { useAuthStore, useReviewStore } from '../store'
import { validateReviewForm, createReviewData } from '../utils/reviewFormUtils'

export const useReviewForm = (course, onSuccess) => {
  const { user } = useAuthStore()
  const { submitReview, loading } = useReviewStore()

  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateReviewForm(formData)
    setErrors(validation.errors)

    if (!validation.isValid) return

    const reviewData = createReviewData(formData, course, user)
    const result = await submitReview(reviewData)

    if (result.success) {
      onSuccess()
    }
  }

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: null }))
    }
  }

  const handleCommentChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }))
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: null }))
    }
  }

  const handleRatingHover = (rating) => {
    setHoveredRating(rating)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  return {
    formData,
    hoveredRating,
    errors,
    loading,
    handleSubmit,
    handleRatingClick,
    handleCommentChange,
    handleRatingHover,
    handleRatingLeave
  }
}