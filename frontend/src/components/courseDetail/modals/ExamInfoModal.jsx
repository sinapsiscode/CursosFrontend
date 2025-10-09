import { Modal } from '../../common'
import { COURSE_DETAIL_CONFIG } from '../../../constants/courseDetailConstants'

const ExamInfoModal = ({ isOpen, onClose, courseExam, course, navigate }) => {
  if (!courseExam) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Examen: {courseExam.title}
        </h2>

        <div className="space-y-4 mb-6">
          <p className="text-gray-300">{courseExam.description}</p>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">
              {COURSE_DETAIL_CONFIG.exam.discountSystem}
            </h3>
            <div className="space-y-2 text-sm">
              {COURSE_DETAIL_CONFIG.exam.scoreRanges.map((range, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">Puntaje {range.min}-{range.max}:</span>
                  <span className={`${range.color} font-bold`}>
                    {range.discount > 0 ? `${range.discount}% de descuento` : 'Sin descuento'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400">{COURSE_DETAIL_CONFIG.exam.duration}</p>
              <p className="text-white font-semibold">{courseExam.duration} {COURSE_DETAIL_CONFIG.exam.minutes}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400">{COURSE_DETAIL_CONFIG.exam.questions}</p>
              <p className="text-white font-semibold">{courseExam.questions?.length || 0} preguntas</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400">{COURSE_DETAIL_CONFIG.exam.attempts}</p>
              <p className="text-white font-semibold">{courseExam.attempts || 'Ilimitados'} intentos</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400">{COURSE_DETAIL_CONFIG.exam.passing}</p>
              <p className="text-white font-semibold">{courseExam.passingScore || 70}%</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              onClose()
              navigate(`/course/${course.id}/exam/${courseExam.id}`)
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {COURSE_DETAIL_CONFIG.exam.startExam}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            {COURSE_DETAIL_CONFIG.exam.cancel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ExamInfoModal