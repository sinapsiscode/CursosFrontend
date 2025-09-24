import { MATERIAL_COLORS, COURSE_DETAIL_CONFIG } from '../../constants/courseDetailConstants'

const CourseAbout = ({ course, isAuthenticated, navigate }) => {
  const getMaterialIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      case 'video':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6">{COURSE_DETAIL_CONFIG.labels.aboutCourse}</h3>
      <div className="prose prose-invert max-w-none">
        <p className="text-text-secondary text-lg leading-relaxed mb-6">
          {course.description}
        </p>

        <h4 className="text-lg font-semibold text-white mb-4">{COURSE_DETAIL_CONFIG.labels.whatYouWillLearn}</h4>
        <ul className="text-text-secondary space-y-2 mb-6">
          {COURSE_DETAIL_CONFIG.learningPoints.map((point, index) => (
            <li key={index}>• {point} {index === 0 ? course.area : ''}</li>
          ))}
        </ul>

        <h4 className="text-lg font-semibold text-white mb-4">{COURSE_DETAIL_CONFIG.labels.instructor}</h4>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {course.instructor.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h5 className="text-white font-medium">{course.instructor}</h5>
            <p className="text-text-secondary">Especialista en {course.area}</p>
          </div>
        </div>

        {course.materials && course.materials.length > 0 && isAuthenticated && (
          <>
            <h4 className="text-lg font-semibold text-white mb-4">{COURSE_DETAIL_CONFIG.labels.includedMaterials}</h4>
            <div className="space-y-3">
              {course.materials.map((material, index) => (
                <a
                  key={index}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      MATERIAL_COLORS[material.type] || MATERIAL_COLORS.default
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getMaterialIcon(material.type)}
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{material.name || `Material ${index + 1}`}</p>
                      <p className="text-xs text-gray-400 uppercase">{material.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-accent group-hover:text-accent-light">
                    <span className="text-sm font-medium">{COURSE_DETAIL_CONFIG.labels.download}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {course.materials && course.materials.length > 0 && !isAuthenticated && (
          <>
            <h4 className="text-lg font-semibold text-white mb-4">{COURSE_DETAIL_CONFIG.labels.includedMaterials}</h4>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h5 className="text-white font-medium mb-2">{COURSE_DETAIL_CONFIG.labels.availableMaterials}</h5>
              <p className="text-text-secondary text-sm mb-4">
                Este curso incluye {course.materials.length} {course.materials.length === 1 ? 'material adicional' : 'materiales adicionales'} que podrás descargar una vez que inicies sesión.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                {COURSE_DETAIL_CONFIG.labels.loginToViewMaterials}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CourseAbout