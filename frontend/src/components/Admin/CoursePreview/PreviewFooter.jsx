import { ExternalLinkIcon } from '../../common/Icons'

const PreviewFooter = ({ course, onClose }) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between">
      <button
        onClick={() => window.open(`/course/${course.id}`, '_blank')}
        className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2"
      >
        <ExternalLinkIcon className="w-5 h-5" />
        <span>Abrir en Nueva Pestaña</span>
      </button>
      <button
        onClick={onClose}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        Cerrar
      </button>
    </div>
  )
}

export default PreviewFooter