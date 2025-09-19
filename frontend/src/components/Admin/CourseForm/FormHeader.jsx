const FormHeader = ({ editingCourse, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-accent to-blue-600 p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl font-bold text-white mb-2">
        {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
      </h2>
      <p className="text-white/90 text-sm">
        {editingCourse ? 'Modifica la información del curso' : 'Completa todos los campos para crear un curso completo'}
      </p>
    </div>
  )
}

export default FormHeader