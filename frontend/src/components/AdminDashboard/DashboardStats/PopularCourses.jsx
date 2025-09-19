const PopularCourses = ({ topCourses }) => {
  return (
    <div className="bg-surface rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Cursos Más Populares</h3>
      <div className="space-y-4">
        {topCourses && topCourses.length > 0 ? (
          topCourses.map((course, index) => (
            <div key={course.id} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-background font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{course.title}</h4>
                <p className="text-text-secondary text-sm">
                  {course.students || 0} estudiantes
                </p>
              </div>
              <div className="text-accent font-medium">
                {course.rating || 0} ⭐
              </div>
            </div>
          ))
        ) : (
          <div className="text-text-secondary text-center py-8">
            No hay datos de cursos disponibles
          </div>
        )}
      </div>
    </div>
  )
}

export default PopularCourses