const LoadingSpinner = ({ size = 'medium', color = 'accent', className = '' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  }

  const colors = {
    accent: 'border-accent',
    white: 'border-white',
    gray: 'border-gray-400',
    primary: 'border-primary-metalurgia'
  }

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 ${colors[color]} ${className}`}></div>
  )
}

// Spinner de página completa
export const FullPageSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="text-white mt-4 text-lg">{message}</p>
      </div>
    </div>
  )
}

// Spinner inline
export const InlineSpinner = ({ message }) => {
  return (
    <div className="flex items-center space-x-3">
      <LoadingSpinner size="small" />
      {message && <span className="text-text-secondary">{message}</span>}
    </div>
  )
}

// Skeleton loader para tarjetas de curso
export const CourseCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm bg-surface rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="aspect-video bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700 rounded-full w-20"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

// Skeleton para lista de lecciones
export const LessonListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-surface rounded-lg animate-pulse">
          <div className="w-12 h-12 bg-gray-700 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner