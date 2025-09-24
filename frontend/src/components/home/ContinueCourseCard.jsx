import { HOME_STYLES } from '../../constants/homeConstants.jsx'

const ContinueCourseCard = ({ course, onNavigate }) => {
  if (!course) return null

  return (
    <div
      onClick={onNavigate}
      className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer mb-8"
    >
      <div className="flex items-center space-x-4">
        <img
          src={course.image}
          alt={course.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            Progreso: {course.progress}%
          </p>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Continuar
        </button>
      </div>
    </div>
  )
}

export default ContinueCourseCard