import { CloseIcon } from '../../common/Icons'

const LoginHeader = ({ onClose }) => {
  return (
    <>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 z-10"
      >
        <CloseIcon />
      </button>

      {/* Header Section con gradiente */}
      <div className="text-center mb-10">
        {/* Logo mejorado */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <img
              src="/logo.png"
              alt="Logo"
              className="relative h-20 w-20 object-contain rounded-2xl shadow-2xl ring-2 ring-white/10"
            />
          </div>
        </div>

        {/* Title con gradiente */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          Bienvenido de nuevo
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm">
          Inicia sesión para continuar tu aprendizaje
        </p>

        {/* Decorative line */}
        <div className="flex items-center justify-center mt-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
      </div>
    </>
  )
}

export default LoginHeader