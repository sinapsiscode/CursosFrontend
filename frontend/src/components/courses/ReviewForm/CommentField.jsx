import { FORM_LABELS, FORM_STYLES, VALIDATION_RULES } from '../../../constants/reviewConstants'
import { getCharacterCountColor } from '../../../utils/reviewFormUtils'

const CommentField = ({ value, onChange, error }) => {
  const characterCountColor = getCharacterCountColor(value.length, VALIDATION_RULES.minCommentLength)

  return (
    <div className="space-y-2">
      <label className={FORM_STYLES.label}>
        {FORM_LABELS.comment}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={FORM_LABELS.commentPlaceholder}
        rows={4}
        className={FORM_STYLES.textarea}
      />
      <div className={FORM_STYLES.characterCount}>
        <span className={characterCountColor}>
          {value.length}/{VALIDATION_RULES.maxCommentLength} {FORM_LABELS.characterCount}
        </span>
      </div>
      {error && (
        <p className={FORM_STYLES.error}>{error}</p>
      )}
    </div>
  )
}

export default CommentField