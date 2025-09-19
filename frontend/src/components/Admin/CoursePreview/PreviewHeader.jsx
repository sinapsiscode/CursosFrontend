import { CloseIcon } from '../../common/Icons'
import { formatDuration, formatPrice } from '../../../utils/formatters'

const PreviewHeader = ({ course, onClose }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {course?.title || 'Sin título'}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>Por {course?.instructor || 'Sin instructor'}</span>
            <span>•</span>
            <span>{formatDuration(course?.duration)}</span>
            <span>•</span>
            <span className={course?.price === 0 ? 'text-green-400' : 'text-accent'}>
              {formatPrice(course?.price || 0)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

export default PreviewHeader